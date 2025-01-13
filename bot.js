const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { sendMenu } = require('./plugins/menu');

const client = new Client({
    authStrategy: new LocalAuth()
});

let todayList = [];
let tomorrowList = [];
const MAX_LIST_SIZE = 35;
const OWNER_NUMBER = '18098781279'; // Reemplaza con tu número

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('El bot está listo');
});

client.on('message', msg => {
    const chatId = msg.from;
    const from = msg.author || msg.from;
    const message = msg.body;

    // Mostrar mensajes en Termux
    console.log(`Mensaje recibido de ${from}: ${message}`);

    if (msg.isGroupMsg) {
        console.log(`Mensaje recibido en el grupo ${msg.from}`);
    }

    if (message === 'listahoy') {
        sendList(chatId, todayList, 'hoy');
    } else if (message === 'listaMñ') {
        if (tomorrowList.length < MAX_LIST_SIZE) {
            addToList(tomorrowList, from, chatId, 'mañana');
        } else {
            client.sendMessage(chatId, 'La lista de mañana está llena.');
        }
    } else if (message === 'menúlista') {
        sendList(chatId, todayList, 'hoy');
        sendList(chatId, tomorrowList, 'mañana');
    } else if (message === 'borrar lista') {
        if (from === OWNER_NUMBER) {
            todayList = [];
            tomorrowList = [];
            client.sendMessage(chatId, 'Las listas han sido borradas.');
        } else {
            client.sendMessage(chatId, 'Solo mi creador puede ejecutar este comando [😡]');
        }
    } else if (message.startsWith('.unirmelista')) {
        const name = message.split(' ')[1];
        if (name) {
            confirmJoinList(todayList, from, name, chatId);
        } else {
            client.sendMessage(chatId, 'Por favor, proporciona un nombre.');
        }
    } else if (message === 'menu') {
        sendMenu(client, chatId, OWNER_NUMBER);
    } else if (message === 'si' || message === 'Sí' || message === 'sí') {
        handleTomorrowList(from, chatId, message);
    }
});

function addToList(list, number, chatId, day) {
    if (list.some(item => item.number === number)) {
        client.sendMessage(chatId, `No seas tonto, ya estás registrado en la lista de ${day} 😡`);
        return;
    }
    if (list.length < MAX_LIST_SIZE) {
        const now = new Date();
        list.push({ number, time: now });
        client.sendMessage(chatId, `Te has agregado a la lista de ${day}.`);
    } else if (day === 'hoy') {
        client.sendMessage(chatId, `Se logró el límite de personas para hoy. ¿Quieres apuntarte para mañana? Responde con 'si' para verificar.`);
    }
}

function handleTomorrowList(from, chatId, message) {
    if (!tomorrowList.some(item => item.number === from)) {
        client.sendMessage(chatId, 'Por favor, proporciona tu nombre para agregar a la lista de mañana.');
        client.on('message', msg => {
            const name = msg.body;
            if (name) {
                const now = new Date();
                tomorrowList.push({ number: from, name: name, time: now });
                client.sendMessage(chatId, `Te has agregado a la lista de mañana con el nombre ${name}.`);
            } else {
                client.sendMessage(chatId, 'No proporcionaste un nombre válido.');
            }
        });
    } else {
        client.sendMessage(chatId, 'Ya estás registrado en la lista de mañana.');
    }
}

function sendList(chatId, list, day) {
    let message = `*Lista de ${day}:*\n`;
    list.forEach((item, index) => {
        message += `${index + 1}. *Número:* ${item.number}\n   *Hora:* ${item.time}\n`;
    });
    for (let i = list.length; i < MAX_LIST_SIZE; i++) {
        message += `${i + 1}. *Vacío* [❌]\n`;
    }
}
