// plugins/menu.js

function sendMenu(client, chatId) {
    const ownerName = 'JUAN'; // Reemplaza con el nombre del dueño
    const imageUrl = 'URL_DE_LA_IMAGEN'; // Reemplaza con la URL de la imagen

    const menuMessage = `
*Menú de Comandos Disponibles:*
1. *listahoy* - Muestra la lista de personas para hoy.
2. *listaMñ* - Agrega tu número a la lista de mañana.
3. *menúlista* - Muestra las listas de hoy y mañana.
4. *borrar lista* - Borra todas las listas (solo para el creador del bot).
5. *.unirmelista [nombre]* - Agrega tu número a la lista de hoy con el nombre proporcionado.
6. *menu* - Muestra este menú de comandos.

_Bot creado por ${ownerName}_`;

    client.sendMessage(chatId, menuMessage);
    client.sendMessage(chatId, { media: { url: imageUrl } });
}

module.exports = { sendMenu };
