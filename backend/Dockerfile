#Dockerfile for back

# Imagen de python
FROM python:3.10-slim

# Establecer workdir
WORKDIR /app

# Copia requirements para la app
COPY requirements.txt .

# Instala deps del back
RUN pip install --no-cache-dir -r requirements.txt

# Copia codigo del back
COPY . .

# Puerto a exponer
EXPOSE 5000

# Comando para ejecutar la app
CMD [ "flask", "run", "--host=0.0.0.0" ]