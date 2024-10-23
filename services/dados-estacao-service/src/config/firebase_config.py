import firebase_admin
from firebase_admin import credentials, firestore

# Conexão com o banco Receptor dos dados
def init_firebase_receptor():
    try:
        cred = credentials.Certificate("<SEU_CONFI>")# Caminho para o arquivo JSON de credenciais do banco intermediario (api-tecsus-service)
        firebase_admin.initialize_app(cred)
        db_receptor = firestore.client()
        print("Conexão com Firebase Receptor estabelecida com sucesso.")
        return db_receptor
    except Exception as e:
        print(f"Erro ao inicializar Firebase Receptor: {e}")
        raise e

# conexão com o banco do projeto
def init_firebase_client():
    try:
        cred = credentials.Certificate("<SEU_CONFIG>")  # Caminho para o arquivo JSON de credenciais do banco principal (api-tecsus)
        app_secondary = firebase_admin.initialize_app(cred, name='secondary') 
        db_client = firestore.client(app=app_secondary)
        print("Conexão com Firebase Cliente estabelecida com sucesso.")
        return db_client
    except ValueError as ve:
        print(f"Erro de Valor ao inicializar Firebase Cliente: {ve}")
        raise ve
    except Exception as e:
        print(f"Erro ao inicializar Firebase Cliente: {e}")
        raise e

