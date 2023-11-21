FROM python:3.9.7

WORKDIR /usr/src/app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

COPY . .

ENV DATABASE_HOSTNAME=host.docker.internal

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]