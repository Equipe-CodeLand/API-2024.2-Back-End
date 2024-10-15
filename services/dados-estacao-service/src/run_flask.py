from flask import Flask, jsonify
from config.firebase_config import init_firebase_receptor, init_firebase_client

app = Flask(__name__)

db_receptor = init_firebase_receptor() 
db_client = init_firebase_client() 

@app.route('/parametrosEstacao/<string:uid>', methods=['GET'])
def get_station_data(uid):
    try:
        # Buscar dados da estação
        docs = db_client.collection('Estacao').where('uid', '==', uid).stream()
        station_data = []
        
        for doc in docs:
            data = doc.to_dict()
            filtered_data = {
                "nome": data.get("nome", "N/A"),
                "uid": data.get("uid", "N/A")
            }
            station_data.append(filtered_data)

        if not station_data:
            return jsonify({"message": "Estação não encontrada."}), 404

        # Buscar parâmetros relacionados
        parameters = db_receptor.collection('Receptor').where('uid', '==', uid).stream()
        param_list = []
        for param_doc in parameters:
            param_data = param_doc.to_dict()
            param_list.append(param_data)

        return jsonify({
            "estacao": station_data,
            "parametros": param_list
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def run_flask():
    app.run(host='0.0.0.0', port=5001) 

if __name__ == "__main__":
    print("Iniciando servidor Flask...")
    run_flask()
