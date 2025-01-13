const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
    name: 'update',
    description: 'Actualiza los comandos agregados recientemente',
    execute(message, args) {
        // Verificar si el mensaje fue enviado por el dueño del bot
        if (message.author.id !== process.env.OWNER_ID) {
            return message.reply('No tienes permiso para usar este comando.');
        }

        message.reply('Actualizando bot...');

        // Ejecutar el comando para actualizar el bot
        exec('git pull && npm install', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al actualizar el bot: ${error.message}`);
                return message.reply('Hubo un error al actualizar el bot.');
            }

            if (stderr) {
                console.error(`Error: ${stderr}`);
                return message.reply('Hubo un error al actualizar el bot.');
            }

            console.log(`Salida: ${stdout}`);
            message.reply('Bot actualizado con éxito.');
        });
    },
};
