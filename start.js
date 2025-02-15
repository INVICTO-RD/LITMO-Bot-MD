import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { Low, JSONFile } from 'lowdb';
import { createInterface } from 'readline';
import { readdirSync, unlinkSync } from 'fs';
import { platform } from 'process';

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

const rl = createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

global.__dirname = path.dirname(new URL(import.meta.url).pathname);
global.db = new Low(new JSONFile('database.json'));
global.loadDatabase = async function () {
    if (global.db.data !== null) return;
    await global.db.read();
    global.db.data = global.db.data || { users: {}, chats: {}, stats: {} };
};

(async () => {
    await global.loadDatabase();
})();

const clearTmp = () => {
    const tmpDir = path.join(__dirname, 'tmp');
    readdirSync(tmpDir).forEach(file => unlinkSync(path.join(tmpDir, file)));
};

const purgeOldFiles = (dir) => {
    readdirSync(dir).forEach(file => {
        if (file !== 'creds.json') {
            unlinkSync(path.join(dir, file));
        }
    });
};

const purgeSessions = () => {
    const sessionsDir = path.join(__dirname, 'sessions');
    readdirSync(sessionsDir).forEach(file => {
        if (file.startsWith('pre-key-')) {
            unlinkSync(path.join(sessionsDir, file));
        }
    });
};

const redefineConsoleMethod = (methodName, filterStrings) => {
    const originalMethod = console[methodName];
    console[methodName] = function () {
        const message = arguments[0];
        if (typeof message === 'string' && filterStrings.some(filter => message.includes(filter))) {
            arguments[0] = "";
        }
        originalMethod.apply(console, arguments);
    };
};

setInterval(clearTmp, 1000 * 60 * 4);
setInterval(purgeSessions, 1000 * 60 * 10);
setInterval(() => purgeOldFiles(path.join(__dirname, 'sessions')), 1000 * 60 * 10);

(async () => {
    // Code to handle connections, updates, and other events
})();

process.on('uncaughtException', console.error);
