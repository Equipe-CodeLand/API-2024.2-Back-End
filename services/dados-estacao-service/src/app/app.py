from flask import Flask

app = Flask(__name__)

@app.route('/')
def health_check():
    return "micro-servico para os dados da estação"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
