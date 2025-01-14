import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import yargs from 'yargs';
import express from 'express';
import chalk from 'chalk';
import os from 'os';
import { promises as fsPromises } from 'fs';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author } = require(join(__dirname, './package.json'));

const client = new Client({
    authStrategy: new LocalAuth()
});

const rl = createInterface(process.stdin, process.stdout);

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

    if (command === 'update' || command === 'actualizar') {
        const commandFile = require('./commands/update');
        commandFile.execute(msg, args);
    }
});

client.initialize();

var isRunning = false;

async function start(file) {
    if (isRunning) return;
    isRunning = true;
    let args = [join(__dirname, file), ...process.argv.slice(2)];
    setupMaster({
        exec: args[0],
        args: args.slice(1),
    });
    let p = fork();
    p.on('message', data => {
        switch (data) {
            case 'reset':
                p.process.kill();
                isRunning = false;
                start.apply(this, arguments);
                break;
            case 'uptime':
                p.send(process.uptime());
                break;
        }
    });

    p.on('exit', (_, code) => {
        isRunning = false;
        console.error('⚠️ ERROR ⚠️ >> ', code);
        start('main.js');

        if (code === 0) return;
        watchFile(args[0], () => {
            unwatchFile(args[0]);
            start(file);
        });
    });

    const ramInGB = os.totalmem() / (1024 * 1024 * 1024);
    const freeRamInGB = os.freemem() / (1024 * 1024 * 1024);
    const packageJsonPath = path.join(path.dirname(fileURLToPath(import.meta.url)), './package.json');
    try {
        const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8');
        const packageJsonObj = JSON.parse(packageJsonData);
        const currentTime = new Date().toLocaleString();
        console.log(chalk.yellow(`╭⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》
┊${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.blueBright('┊')}${chalk.yellow(`🖥️ ${os.type()}, ${os.release()} - ${os.arch()}`)}
┊${chalk.blueBright('┊')}${chalk.yellow(`💾 Total RAM: ${ramInGB.toFixed(2)} GB`)}
┊${chalk.blueBright('┊')}${chalk.yellow(`💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`)}
┊${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.blueBright('┊')} ${chalk.blue.bold(`🟢INFORMACIÓN :`)}
┊${chalk.blueBright('┊')} ${chalk.blueBright('┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊${chalk.blueBright('┊')}${chalk.cyan(`💚 Nombre: ${packageJsonObj.name}`)}
┊${chalk.blueBright('┊')}${chalk.cyan(`𓃠 Versión: ${packageJsonObj.version}`)}
┊${chalk.blueBright('┊')}${chalk.cyan(`💜 Descripción: ${packageJsonObj.description}`)}
┊${chalk.blueBright('┊')}${chalk.cyan(`😺 Project Author: ${packageJsonObj.author.name} (@gata_dios)`)}
┊${chalk.blueBright('┊')}${chalk.blueBright('┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊${chalk.blueBright('┊')}${chalk.yellow(`💜 Colaborador:`)}
┊${chalk.blueBright('┊')}${chalk.yellow(`• elrebelde21 (Mario ofc)`)}
┊${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
┊${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊${chalk.blueBright('┊')}${chalk.cyan(`⏰ Hora Actual :`)}
┊${chalk.blueBright('┊')}${chalk.cyan(`${currentTime}`)}
┊${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')} 
╰⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》`));
        setInterval(() => {}, 1000);
    } catch (err) {
        console.error(chalk.red(`❌ No se pudo leer el archivo package.json: ${err}`));
    }
    
    let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    if (!opts['test']) {
        if (!rl.listenerCount()) rl.on('line', line => {
            p.emit('message', line.trim());
        });
    }
}

start('main.js');
