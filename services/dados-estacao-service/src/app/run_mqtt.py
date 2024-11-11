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
        for doc in docs:
            data = doc.to_dict()
            nome_estacao = data.get('nome', 'N/A')
            uid_estacao = data.get('uid', 'N/A')
            print(f"Estação Encontrada:")
            print(f" - Nome da Estação: {nome_estacao}")
            print(f" - UID da Estação: {uid_estacao}")
            print(f" - UID do Receptor: {uid}")

            # Buscar os parâmetros relacionados na coleção 'Receptor'
            parametros = db_receptor.collection('Receptor').where('uid', '==', uid).stream()
            param_list = []
            for param_doc in parametros:
                param_data = param_doc.to_dict()
                param_list.append(param_data)

            # Exibir os parâmetros encontrados
            if param_list:
                print(" - Parâmetros Relacionados:")
                for param in param_list:
                    print(f"   - {param}")
            else:
                print(" - Nenhum parâmetro encontrado para esta estação.")

            encontrados = True

        if not encontrados:
            print(f"Nenhuma estação encontrada com UID: {uid}")
    except Exception as e:
        print(f"Erro ao verificar no Firebase (secundário): {e}")

# Função chamada quando o cliente se conecta ao broker MQTT
def on_connect(con, userData, flag, rc):
    print("Conectado ao MQTT Broker com código de resultado: " + str(rc))
    con.subscribe("fatec/api/4dsm/codeLand/")

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
                check_and_print_station_parameters(uid)
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

    # Mantém o script rodando para receber mensagens MQTT
    print("Aguardando mensagens do MQTT...")
    while True:
        time.sleep(1)
