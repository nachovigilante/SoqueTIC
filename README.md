# SoqueTIC

Hola soquete, ¿querés conectar tu front con el back? Seguí estos pasos.

## ¿Cómo se instala?

```bash
npm i soquetic
```

## ¿Cómo se usa?

Además de esta documentación, pueden ver un ejemplo de uso en la [Demo](https://github.com/nachovigilante/Demo-SoqueTIC).

### Backend

El backend es un servidor de Express.js y Socket.io que escucha en el puerto 3000. Para responder eventos, soquetic cuenta con tres funciones: `onEvent`, `sendEvent` y `startServer`.

`onEvent` sirve para asociar acciones a eventos. Toma dos parámetros: `type` y `callback`
- `type` es un string que se utiliza para identificar el evento a responder. Debe coincidir con el llamado del front.
- `callback` es **la función** a ser llamada cuando llegue dicho evento. Tiene que tomar un único parámetro, `data`, en donde llega la información necesaria para responder al evento.

`sendEvent` sirve para enviar eventos al frontend sin que necesariamente los pida (realTime). Toma 2 parámetros:
- `type` con el que se pueden distinguir distintos eventos.
- `data` es la información a ser enviada al frontend.

`startServer` sirve para inicializar el backend. no toma parámetros, y se llama en el archivo principal a correr para levantar el servidor.

Entonces, para usar SoqueTIC hay que hacer tantos `onEvent` como eventos quiero saber responder, y en el archivo principal a correr con `node JS` llamar a la función `startServer`

### Frontend

El frontend es un HTML que se conecta al servidor de Socket.io por medio de la librería `socket.io-client`. El script `socket.js` se encarga de manejar la conexión y los eventos. Por cada archivo html que necesite conectarse al back, necesitan importar el archivo `socket.js` que se encuentra en la demo.

Se pueden pedir datos al servidor con la función `fetchData`, que toma 2 parámetros:
- `type` con el que se pueden distinguir distintos eventos.
- `callback` **función** a ser llamada cuando el servidor responda con la información deseada. Esta debe tomar un único parámetro, `data`, que sería la información a recibir.

Se pueden enviar datos al servidor con la función `postData`, que toma 3 parámetros (1 opcional):
- `type` con el que se pueden distinguir distintos eventos.
- `data` es la información a ser enviada al servidor.
- `callback` (opcional, puede quedar vacío) **función** a ser llamada cuando el servidor responda con la información deseada. Esta debe tomar un único parámetro, `data`, que sería la información que recibe del servidor.

Se pueden recibir instrucciones/datos en tiempo real con la función `recieve`, que toma 2 parámetros:
- `type` con el que se pueden distinguir distintos eventos.
- `callback` **función** a ser llamada cuando el servidor envía un evento al front. Esta debe tomar un único parámetro, `data`, que sería la información a recibir.
