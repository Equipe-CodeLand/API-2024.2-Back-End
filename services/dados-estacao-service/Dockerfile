FROM python:3.9-slim

EXPOSE 5001

COPY . /app
WORKDIR /app/src

RUN pip install -r ../requirements.txt

RUN echo -e '#!/bin/sh\npython -m app.run_mqtt &\npython run_flask.py' > start.sh
RUN chmod +x start.sh

CMD ["sh", "./start.sh"]