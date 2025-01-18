#!/bin/bash
# Actualizar el sistema
sudo yum update -y

# Clonar para conseguir el dockerfile
sudo dnf install -y git
sudo mkdir /var/json
sudo mkdir /var/web

cd /var
sudo git clone https://github.com/ferminromero00/Despliegue-TiendaOnline.git
sudo mv Despliegue-TiendaOnline/src/dockerfile web
sudo mv Despliegue-TiendaOnline/data/miinfo.json web
sudo mv Despliegue-TiendaOnline/data/start.sh web
sudo mv Despliegue-TiendaOnline/src/js/https-server.js web
sudo mv Despliegue-TiendaOnline/src/js/package.json web
sudo rm -r Despliegue-TiendaOnline

#Actualizar IP del domninio
sudo curl https://api.dnsexit.com/dns/ud/?apikey=68OTW9l2eMS67w7jw6bQzm4hh91sVw -d host=tienda-videojuegos.work.gd

#Instalar docker
sudo dnf install docker -y
sudo systemctl start docker

#Hacer el build de nuestro dockerfile para que funcione la web
cd /var/
sudo mv ca_bundle.crt web
sudo mv private.key web
sudo mv certificate.crt web

cd web
docker build -t proyecto-tienda-online .
docker run -it --name proyecto-tienda-online -p 80:80 -p 443:443 -p 3000:3000 -d proyecto-tienda-online

sudo rm /var/web/certificate.crt
sudo rm /var/web/private.key
sudo rm /var/web/ca_bundle.crt

