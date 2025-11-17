FROM python:3.10.10
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg
COPY requirements.txt .
RUN pip install --disable-pip-version-check --no-cache-dir -r requirements.txt
COPY . . 
EXPOSE 80
ENTRYPOINT ["gunicorn","-b","0.0.0.0:80", "main:app"]