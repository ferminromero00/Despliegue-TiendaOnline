const fs = require('fs');
const https = require('https');
const jsonServer = require('/var/www/node_modules/json-server');

// Cargar los certificados SSL
const options = {
    key: fs.readFileSync('/etc/pki/tls/private/private.key'),
    cert: fs.readFileSync('/etc/pki/tls/certs/certificate.crt'),
    ca: fs.readFileSync('/etc/pki/tls/certs/ca_bundle.crt')
};

// Crear un servidor HTTPS para JSON Server
const server = jsonServer.create();
const router = jsonServer.router('/var/www/json/miinfo.json');
const middlewares = jsonServer.defaults();

// Usar middlewares por defecto
server.use(middlewares);
server.use(router);

// Iniciar el servidor HTTPS
https.createServer(options, server).listen(3000, () => {
    console.log('JSON Server está corriendo en https://0.0.0.0:3000');
});
