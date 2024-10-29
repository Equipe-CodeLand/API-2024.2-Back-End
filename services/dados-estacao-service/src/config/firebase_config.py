import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

# Conexão com o banco Receptor dos dados (service.json)
def init_firebase_receptor():
    try:
        service_config = {
            "type": os.getenv('SERVICE_TYPE'),
            "project_id": os.getenv('SERVICE_PROJECT_ID'),
            "private_key_id": os.getenv('SERVICE_PRIVATE_KEY_ID'),
            "private_key": os.getenv('SERVICE_PRIVATE_KEY').replace('\\n', '\n'),
            "client_email": os.getenv('SERVICE_CLIENT_EMAIL'),
            "client_id": os.getenv('SERVICE_CLIENT_ID'),
            "auth_uri": os.getenv('SERVICE_AUTH_URI'),
            "token_uri": os.getenv('SERVICE_TOKEN_URI'),
            "auth_provider_x509_cert_url": os.getenv('SERVICE_AUTH_PROVIDER_CERT_URL'),
            "client_x509_cert_url": os.getenv('SERVICE_CLIENT_CERT_URL'),
            "universe_domain": os.getenv('SERVICE_UNIVERSE_DOMAIN')
        }

        cred = credentials.Certificate(service_config)
        firebase_admin.initialize_app(cred, name='receptor')
        db_receptor = firestore.client(app=firebase_admin.get_app('receptor'))
        print("Conexão com Firebase Receptor estabelecida com sucesso.")
        return db_receptor
    except Exception as e:
        print(f"Erro ao inicializar Firebase Receptor: {e}")
        raise e

# Conexão com o banco do projeto (client.json)
def init_firebase_client():
    try:
        client_config = {
            "type": os.getenv('CLIENT_TYPE'),
            "project_id": os.getenv('CLIENT_PROJECT_ID'),
            "private_key_id": os.getenv('CLIENT_PRIVATE_KEY_ID'),
            "private_key": os.getenv('CLIENT_PRIVATE_KEY').replace('\\n', '\n'),
            "client_email": os.getenv('CLIENT_CLIENT_EMAIL'),
            "client_id": os.getenv('CLIENT_CLIENT_ID'),
            "auth_uri": os.getenv('CLIENT_AUTH_URI'),
            "token_uri": os.getenv('CLIENT_TOKEN_URI'),
            "auth_provider_x509_cert_url": os.getenv('CLIENT_AUTH_PROVIDER_CERT_URL'),
            "client_x509_cert_url": os.getenv('CLIENT_CLIENT_CERT_URL'),
            "universe_domain": os.getenv('CLIENT_UNIVERSE_DOMAIN')
        }

        cred = credentials.Certificate(client_config)
        firebase_admin.initialize_app(cred, name='client')
        db_client = firestore.client(app=firebase_admin.get_app('client'))
        print("Conexão com Firebase Cliente estabelecida com sucesso.")
        return db_client
    except ValueError as ve:
        print(f"Erro de Valor ao inicializar Firebase Cliente: {ve}")
        raise ve
    except Exception as e:
        print(f"Erro ao inicializar Firebase Cliente: {e}")
        raise e
