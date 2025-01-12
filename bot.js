const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
    authStrategy: new LocalAuth()
});

let todayList = [];
let tomorrowList = [];
const MAX_LIST_SIZE = 35;
const OWNER_NUMBER = 'your-phone-number'; // Reemplaza con tu número

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
    }
});

function addToList(list, number, chatId, day) {
    if (list.length < MAX_LIST_SIZE) {
        const now = new Date();
        list.push({ number, time: now });
        client.sendMessage(chatId, `Te has agregado a la lista de ${day}.`);
    } else {
        client.sendMessage(chatId, `Se logró el límite de personas para hoy. ¿Quieres apuntarte para mañana? Escribe listaMñ.`);
    }
}

function sendList(chatId, list, day) {
    let message = `Lista de ${day}:\n`;
    list.forEach((item, index) => {
        message += `${index + 1} - ${item.number} [✅] ${item.time}\n`;
    });
    for (let i = list.length; i < MAX_LIST_SIZE; i++) {
        message += `${i + 1} - vacío [❌]\n`;
    }
    message += `Hay ${list.length} personas en la lista.`;
    client.sendMessage(chatId, message);
}

function confirmJoinList(list, number, name, chatId) {
    client.sendMessage(chatId, `Estás uniéndote en la lista, agrega un nombre. Seguro que quieres ese nombre, ${name}?`);
    list.push({ number, name, time: new Date() });
    client.sendMessage(chatId, `Estás en la lista [✅]`);
}

client.initialize();
