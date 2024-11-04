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

const handleEvent = async (type, data) => {
    const handler = events[type];
    if (handler !== undefined) {
        DEBUGMODE &&
            console.log(
                `Llegó un evento: \x1b[32m'${type}'\x1b[0m${
                    data
                        ? ` con la siguiente información:\n\x1b[34m${JSON.stringify(
                              data,
                              null,
                              2
                          )}\x1b[0m`
                        : ""
                }`
            );
        const response = await handler(data);
        DEBUGMODE &&
            console.log(
                `Se respondió al evento \x1b[32m'${type}'\x1b[0m con:\n\x1b[34m${JSON.stringify(
                    response,
                    null,
                    2
                )}\x1b[0m`
            );
        return {
            status: 200,
            data: response,
        };
    }
    DEBUGMODE &&
        console.log(`\x1b[31mLlegó un evento no soportado: '${type}'\x1b[0m`);
    return {
        status: 404,
        message: `Evento '${type}' no soportado.\nRevisá que esté el onEvent apropiado y que coincidan los tipos.`,
    };
};

io.on("connection", (socket) => {
    DEBUGMODE && console.log("\x1b[90mSe conectó un soquete\x1b[0m");
    socket.on("realTimeEvent", async (type, data, callback) => {
        try {
            const result = await handleEvent(type, data);
            callback(result);
        } catch (e) {
            callback({
                status: 500,
                message: `El servidor crasheó al mandar el mensaje '${type}' con la data:\n${JSON.stringify(
                    data,
                    null,
                    2
                )}`,
            });
            throw e;
        }
    });
    socket.on("GETEvent", async (type, callback) => {
        try {
            const result = await handleEvent(type, undefined);
            callback(result);
        } catch (e) {
            callback({
                status: 500,
                message: `El servidor crasheó al mandar el mensaje '${type}'`,
            });
            throw e;
        }
    });
    socket.on("POSTEvent", async (type, data, callback) => {
        try {
            const result = await handleEvent(type, data);
            callback(result);
        } catch (e) {
            callback({
                status: 500,
                message: `El servidor crasheó al mandar el mensaje '${type}' con la data:\n${JSON.stringify(
                    data,
                    null,
                    2
                )}`,
            });
            throw e;
        }
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
            `\x1b[93m¡Servidor prendido!\n\x1b[0mEscuchando eventos...\n\x1b[90mPara parar el servidor, apretá Ctrl + C\n${
                DEBUG
                    ? "Para que no se muestren por consola los mensajes sobre el funcionamiento de \x1b[0mSoqueTIC\x1b[90m, iniciar \x1b[32mstartServer\x1b[90m con modo \x1b[34m'DEBUG'\x1b[90m en \x1b[32mfalse\n"
                    : ""
            }\x1b[0m`
        );
    });
};

export { onEvent, sendEvent, startServer };
