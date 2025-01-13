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

4. **Crear el archivo `.env`**
    ```sh
    echo "OWNER_ID=tu_id_de_usuario" > .env
    ```

5. **Instalar dependencias**
    ```sh
    npm install
    ```

6. **Ejecutar el bot**
    ```sh
    node index.js
    ```

### Notas Importantes
- Asegúrate de reemplazar `tu_id_de_usuario` con el ID correcto del propietario del bot en el archivo `.env`.
- Asegúrate de escanear el código QR que se generará en Termux para iniciar sesión en WhatsApp Web.
- El bot ahora debería estar funcionando y listo para usar.

### Dependencias
El archivo `package.json` incluye las siguientes dependencias:
```json
{
  "dependencies": {
    "whatsapp-web.js": "^1.16.6",
    "qrcode-terminal": "^0.12.0",
    "lowdb": "^3.0.0",
    "pino": "^6.13.0",
    "readline": "^1.3.0",
    "dotenv": "^10.0.0"
  }
}
