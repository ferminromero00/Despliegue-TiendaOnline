#!/bin/bash

# Verificar si json-server está instalado
if ! command -v json-server &> /dev/null
then
    echo "json-server no está instalado. Instalando..."
    npm install -g json-server
fi

# Iniciar Apache en primer plano
httpd -D FOREGROUND &

# Iniciar JSON Server en HTTPS (usando el archivo https-server.js)
node /var/www/https-server.js &

# Mantener el contenedor en ejecución
tail -f /dev/null
