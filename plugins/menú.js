function sendMenu(client, chatId) {
    const ownerName = '18098781279'; // Reemplaza con el nombre del dueño
    const imageUrl = 'https://i.postimg.cc/sDKhjV8B/IMG-20250111-WA0042.jpg'; // Reemplaza con la URL de la imagen

    const menuMessage = `
*Menú de Comandos Disponibles:*
1. *listahoy* - Muestra la lista de personas para hoy.
2. *listaMñ* - Agrega tu número a la lista de mañana.
3. *menúlista* - Muestra las listas de hoy y mañana.
4. *borrar lista* - Borra todas las listas (solo para el creador del bot).
5. *.unirmelista [nombre]* - Agrega tu número a la lista de hoy con el nombre proporcionado.
6. *menu* - Muestra este menú de comandos.

_Bot creado por ${JUAN}_`;

    client.sendMessage(chatId, menuMessage);
    client.sendMessage(chatId, { media: { url: imageUrl } });
}

module.exports = { sendMenu };
