FROM python:3.9-slim

WORKDIR /app

COPY . .

EXPOSE 5001

RUN pip install -r requirements.txt

CMD ["python", "src/run_flask.py"]
