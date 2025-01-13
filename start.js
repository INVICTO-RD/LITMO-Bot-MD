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
    console.log(`Received message: ${msg.body}`);
    // Handle messages
});

client.initialize();
