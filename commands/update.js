const { exec } = require('child_process');

module.exports = {
    name: 'update',
    description: 'Actualiza los comandos agregados recientemente',
    execute(message, args) {
        // Verificar si el mensaje fue enviado por el dueño del bot usando el número de WhatsApp
        const ownerNumber = '18098781279'; // Reemplaza con el número de WhatsApp del dueño del bot
        if (message.from !== ownerNumber) {
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
