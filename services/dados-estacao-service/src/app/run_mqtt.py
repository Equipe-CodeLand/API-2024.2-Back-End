import paho.mqtt.client as mqtt
import time
import json
from config.firebase_config import init_firebase_receptor, init_firebase_client

# Inicializando Firebase Firestore
db_receptor = init_firebase_receptor()
db_client = init_firebase_client()

# Função para enviar dados ao Firebase Firestore
def send_to_firebase(data):
    try:
        doc_ref = db_receptor.collection('Receptor').add(data)
        print(f"Dados enviados ao Firebase: {data}")
        return doc_ref
    except Exception as e:
        print(f"Erro ao enviar dados ao Firebase: {e}")
        return None

# Função para verificar se o UID existe no banco secundário e imprimir informações
def check_and_print_station_parameters(uid):
    try:
        # Procurar Estação no banco secundário com base no UID
        docs = db_client.collection('Estacao').where('uid', '==', uid).stream()
        encontrados = False
        estacao_data = None
        parametros_list = []

        for doc in docs:
            data = doc.to_dict()
            nome_estacao = data.get('nome', 'N/A')  
            uid_estacao = data.get('uid', 'N/A')
            print(f"Estação Encontrada:")
            print(f" - Nome da Estação: {nome_estacao}")
            print(f" - UID da Estação: {uid_estacao}")

            # Buscar os parâmetros relacionados na coleção 'Receptor'
            parametros = db_receptor.collection('Receptor').where('uid', '==', uid).stream()
            for param_doc in parametros:
                param_data = param_doc.to_dict()
                parametros_list.append(param_data)

            # Exibir os parâmetros encontrados
            if parametros_list:
                print(" - Parâmetros Relacionados:")
                for param in parametros_list:
                    print(f"   - {param}")
            else:
                print(" - Nenhum parâmetro encontrado para esta estação.")

            estacao_data = data
            encontrados = True
        
        if not encontrados:
            print(f"Nenhuma estação encontrada com UID: {uid}")
        return estacao_data, parametros_list
    
    except Exception as e:
        print(f"Erro ao verificar no Firebase (secundário): {e}")
        return None, None

# Função para verificar alertas e gerar notificações
def check_alerts_and_generate_notifications(data, estacao_data, parametros_list):
    try:
        uid = data.get("uid")
        if not uid:
            print("UID não encontrado no payload de dados.")
            return

        # Verificar se a estação foi encontrada e seus parâmetros foram carregados
        if not estacao_data or not parametros_list:
            print(f"Dados da estação ou parâmetros não encontrados para UID: {uid}")
            return

        estacao_id = estacao_data['id']
        print(f"Estação encontrada: {estacao_id}")

        # Obter os parâmetros da estação e mapear seus IDs
        parametros_estacao = estacao_data.get('parametros', [])
        print(f"Parâmetros relacionados à estação: {parametros_estacao}")

        # Mapeamento dos parâmetros da estação
        parametros_map = {}
        for parametro_id in parametros_estacao:
            param_doc = db_client.collection('Parametros').document(parametro_id).get()
            if param_doc.exists:
                param_data = param_doc.to_dict()
                parametros_map[parametro_id] = param_data['sigla']  # Mapeia o 'parametroId' para 'sigla'
                print(f"Parâmetro mapeado: {parametro_id} -> {param_data['sigla']}")
            else:
                print(f"Parâmetro {parametro_id} não encontrado na coleção 'Parametros'.")

        # Buscar alertas relacionados à estação
        alertas = db_client.collection('Alerta').where('estacaoId', '==', estacao_id).stream()
        alertas_encontrados = False  
        for alerta in alertas:
            alerta_data = alerta.to_dict()
            parametro_id = alerta_data.get('parametroId')
            condicao = alerta_data.get('condicao')
            valor = float(alerta_data.get('valor'))
            mensagem_alerta = alerta_data.get('mensagemAlerta')
            print(f"Processando alerta: {alerta_data}")

            # Verificar se o alerta está associado a um parâmetro presente nos dados
            if parametro_id in parametros_map:
                parametro_sigla = parametros_map[parametro_id]
                print(f"Verificando alerta para o parâmetro {parametro_sigla} com ID {parametro_id}")

                # Verificar se a condição do alerta é atendida
                if parametro_sigla in data:
                    parametro_valor = float(data[parametro_sigla])
                    print(f"Verificando condição do alerta: {parametro_sigla} {condicao} {valor} com valor recebido de: {parametro_valor}")
                    if (condicao == '>' and parametro_valor > valor) or \
                       (condicao == '>=' and parametro_valor >= valor) or \
                       (condicao == '<' and parametro_valor < valor) or \
                       (condicao == '<=' and parametro_valor <= valor) or \
                       (condicao == '==' and parametro_valor == valor):
                        # Gerar notificação
                        notificacao = {
                            'estacaoId': estacao_id,
                            'parametroId': parametro_id,
                            'mensagemAlerta': mensagem_alerta,
                            'dataNotificacao': time.strftime('%d/%m/%Y %H:%M:%S'),
                            'alertaId': alerta.id,
                            'uid': uid
                        }
                        db_client.collection('Notificacao').add(notificacao)
                        print(f"Notificação gerada: {notificacao}")
                        alertas_encontrados = True
                    else:
                        print(f"Condição do alerta não atendida: {parametro_valor} {condicao} {valor}")
                else:
                    print(f"Parâmetro {parametro_sigla} não encontrado nos dados.")
            else:
                print(f"Parâmetro no alerta não encontrado nos parâmetros da estação.")

        # Se nenhum alerta for encontrado
        if not alertas_encontrados:
            print(f"Nenhum alerta processado ou condição não atende nenhum alerta cadastrado para UID: {uid}")
    except Exception as e:
        print(f"Erro ao verificar alertas e gerar notificações: {e}")

# Função chamada quando o cliente se conecta ao broker MQTT
def on_connect(con, userData, flag, rc):
    print("Conectado ao MQTT Broker com código de resultado: " + str(rc))
    con.subscribe("fatec/api/4dsm/codeLand/")  # Substitua pelo seu tópico MQTT

# Callback para quando uma mensagem é recebida via MQTT
def on_message(con, userData, msg):
    print(f"Mensagem recebida do tópico {msg.topic}: {str(msg.payload)}")
    try:
        # Decodifica a mensagem e converte para dicionário
        data = json.loads(msg.payload.decode("utf-8"))
        # Envia os dados para o Firebase primário
        doc_ref = send_to_firebase(data)
        
        # Se o envio para o primário foi bem-sucedido, verifica no secundário
        if doc_ref:
            uid = data.get("uid")
            if uid:
                estacao_data, parametros_list = check_and_print_station_parameters(uid)
                if estacao_data and parametros_list:
                    check_alerts_and_generate_notifications(data, estacao_data, parametros_list)
                else:
                    print("Dados de estação ou parâmetros não encontrados.")
            else:
                print("UID não encontrado no payload.")
    except json.JSONDecodeError as e:
        print(f"Erro ao decodificar a mensagem JSON: {e}")
    except Exception as e:
        print(f"Erro geral no processamento da mensagem: {e}")

if __name__ == "__main__":
    # Inicializando o cliente MQTT
    con = mqtt.Client()

    # Configurando callbacks
    con.on_connect = on_connect
    con.on_message = on_message
    
    # Conectando ao broker MQTT
    con.connect("test.mosquitto.org", 1883, 15)
    con.loop_start()

    # Aguarda a conexão antes de começar a processar mensagens
    print("Aguardando mensagens MQTT...")
    while True:
        time.sleep(1) 
