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

El front es un archivo HTML y dos archivos js linkeados al html, por lo que se pueden abrir directamente en el navegador. También se puede levantar un servidor de desarrollo con:

```bash
npx http-server
```

Los archivos se encuentran dentro de la carpeta `front`, pero pueden ser movidos a cualquier otro lugar (mientras esté en la misma máquina que el server).

## ¿Cómo se usa?

### Backend

El backend es un servidor de Express.js y Socket.io que escucha en el puerto 3000. Escucha únicamente un evento: `event`. Cuando recibe un evento, llama a la función `handleEvent` que se encuentra en `/handler.js`.
La función tiene 3 parámetros:
- `type` con el que se pueden distinguir distintos eventos.
- `data` que trae la información asociada a dicho evento.
- `callback` es una función con la cual se pueden enviar respuestas al cliente. Esta función toma 2 parámetros, `type` que el tipo del evento **a responder** y `data` que es la información a responder.

### Frontend

El frontend es un HTML que se conecta al servidor de Socket.io por medio de la librería `socket.io-client`. El script `socket.js` se encarga de manejar la conexión y los eventos. 
Se pueden enviar eventos al servidor con la función `send`, que toma 2 parámetros:
- `type` con el que se pueden distinguir distintos eventos.
- `data` que tiene la información a enviar.

Se pueden recibir eventos del servidor con la función `recieve`, que toma 2 parámetros:
- `type` con el que se pueden distinguir distintos eventos.
- `callback` que toma **una función** de un parámetro, `data`, que sería la información a recibir.
