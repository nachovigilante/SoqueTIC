import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// events es un objeto que contiene los eventos que se pueden ejecutar y sus respectivos handlers
const events = {};
// DEBUG es un booleano que determina si se muestran mensajes de debug en la consola
let DEBUGMODE = true;

const onEvent = (type, handler) => {
    events[type] = handler;
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const handleEvent = (type, data) => {
    const handler = events[type];
    if (handler !== undefined) {
        DEBUGMODE &&
            console.log(
                `Llegó un evento: \x1b[32m'${type}'\x1b[0m con la siguiente información:\n\x1b[34m${JSON.stringify(
                    data,
                    null,
                    2
                )}\x1b[0m`
            );
        const response = handler(data);
        DEBUGMODE &&
            console.log(
                `Se ejecutó el handler de \x1b[32m'${type}'\x1b[0m con la siguiente respuesta:\n\x1b[34m${JSON.stringify(
                    response,
                    null,
                    2
                )}\x1b[0m`
            );
        return response;
    }
    DEBUGMODE &&
        console.log(`\x1b[31mLlegó un evento no soportado: '${type}'\x1b[0m`);
    return {
        error: `Evento no soportado en el backend: ${type}.\nRevisar que haya un onEvent apropiado en el backend y/o revisar que coincidan los tipos de mensajes.`,
    };
};

io.on("connection", (socket) => {
    DEBUGMODE && console.log("\x1b[90mSe conectó un soquete\x1b[0m");
    socket.on("realTimeEvent", async (type, data, callback) => {
        const result = await handleEvent(type, data);
        callback(result);
    });
    socket.on("GETEvent", async (type, callback) => {
        const result = await handleEvent(type, undefined);
        callback(result);
    });
    socket.on("POSTEvent", async (type, data, callback) => {
        const result = await handleEvent(type, data);
        callback(result);
    });
    socket.on("disconnect", () => {
        DEBUGMODE && console.log("\x1b[90mSe desconectó un soquete\x1b[0m");
    });
});

const sendEvent = (type, data) => {
    DEBUGMODE &&
        console.log(
            `Enviando evento: \x1b[32m'${type}'\x1b[0m con la siguiente información:\n\x1b[34m${JSON.stringify(
                data,
                null,
                2
            )}\x1b[0m`
        );
    io.emit("realTimeEvent", type, data);
};

const startServer = (PORT = 3000, DEBUG = true) => {
    DEBUGMODE = DEBUG;
    server.listen(PORT, () => {
        console.log(
            `\x1b[93mServidor prendido\n\x1b[0mEscuchando eventos...\n\x1b[90mPara parar el servidor, apretá Ctrl + C\n${
                DEBUG
                    ? "Para que no se muestren por consola los mensajes sobre el funcionamiento de \x1b[0mSoqueTIC\x1b[90m, iniciar \x1b[32mstartServer\x1b[90m con modo \x1b[34m'DEBUG'\x1b[90m en \x1b[32mfalse\n"
                    : ""
            }\x1b[0m`
        );
    });
};

export { onEvent, sendEvent, startServer };
