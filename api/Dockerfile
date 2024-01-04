FROM python:3.11.3
ENV PYTHONUNBUFFERED True

RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r  requirements.txt

ENV APP_HOME /root/myapp
WORKDIR $APP_HOME
COPY / $APP_HOME

EXPOSE 8080
CMD ["gunicorn", "main:app", "--workers", "1", "--bind", "0.0.0.0:8080", "-k", "uvicorn.workers.UvicornWorker"]