# SoqueTIC

Hola soquete, ¿querés correr este proyecto? Seguí estos pasos.

## ¿Cómo instalar el proyecto?

```bash
npm i
```

## ¿Cómo correr el proyecto?

Levantar el servidor del backend:

```bash
npm start
```

Opcionalmente, se puede levantar en modo desarrollo:

```bash
npm run dev
```

## ¿Cómo levantar el front?

El front es un HTML, por lo que se puede abrir directamente en el navegador. También se puede levantar un servidor de desarrollo con:

```bash
npx http-server
```

Dentro de la carpeta `front`.

## ¿Cómo se usa?

### Backend

El backend es un servidor de Express.js y Socket.io que escucha en el puerto 3000. Escucha únicamente un evento: `event`. Cuando recibe un evento, llama a la función `handleEvent` que se encuentra en `/handler.js`. Se puede distinguir el tipo de evento por el parámetro `type`. Luego, se puede utilizar el parámetro `data` para obtener la información que se envió. El último parámetro es la función `callback` que se debe llamar para devolver una respuesta al cliente.

### Frontend

El frontend es un HTML que se conecta al servidor de Socket.io por medio de la librería `socket.io-client`. El script `socket.js` se encarga de manejar la conexión y los eventos. Se pueden enviar eventos al servidor con la función `send` y escuchar eventos con la función `receive`.
