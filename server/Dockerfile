FROM python:3.12.8

WORKDIR /app
COPY . ./server

RUN pip install -r /app/server/requirements.txt

EXPOSE 5000
CMD ["python", "/app/server/app.py"]
