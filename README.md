# LITMO-Bot-MD

## Ejecución del Bot en Termux (Android)

### Requisitos
- Termux instalado en tu dispositivo Android.
- Conexión a internet.

### Pasos para la instalación y ejecución

1. **Actualizar y actualizar paquetes**
    ```sh
    pkg update && pkg upgrade
    ```

2. **Instalar Node.js y Git**
    ```sh
    pkg install nodejs
    pkg install git
    ```

3. **Clonar el repositorio**
    ```sh
    git clone https://github.com/INVICTO-RD/LITMO-Bot-MD.git
    cd LITMO-Bot-MD
    ```

4. **Instalar dependencias**
    ```sh
    npm install
    ```

5. **Actualizar el número de dueño en `bot.js`**
    - Edita el archivo `bot.js` y reemplaza `'your-phone-number'` con tu número de teléfono.

6. **Ejecutar el bot**
    ```sh
    node bot.js
    ```

### Notas
- Asegúrate de escanear el código QR que se generará en Termux para iniciar sesión en WhatsApp Web.
- El bot ahora debería estar funcionando y listo para usar.
