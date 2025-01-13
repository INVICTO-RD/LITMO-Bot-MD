const fs = require('fs');
const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('QR code generated, scan it with WhatsApp');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    const args = msg.body.split(' ');
    const command = args.shift().toLowerCase();

    // Cargar el comando desde el archivo
    if (command === 'update' || command === 'actualizar') {
        const commandFile = require('./commands/update');
        commandFile.execute(msg, args);
    }

    // Otros comandos...
});

client.initialize();
