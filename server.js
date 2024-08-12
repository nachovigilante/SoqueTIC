import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

// events es un objeto que contiene los eventos que se pueden ejecutar y sus respectivos handlers
const events = {};

const onEvent = (type, handler) => {
    events[type] = handler;
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const handleEvent = (type, data) => {
    const handler = events[type];

    if (handler !== undefined) return handler(data);

    throw new Error(`Tipo de evento no soportado: ${type}`);
};

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("realTimeEvent", (type, data, callback) => {
        const result = handleEvent(type, data);
        callback(result);
    });
    socket.on("GETEvent", (type, callback) => {
        const result = handleEvent(type, undefined);
        callback(result);
    });
    socket.on("POSTEvent", (type, data, callback) => {
        const result = handleEvent(type, data);
        callback(result);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const sendEvent = (type, data) => {
    io.emit("realTimeEvent", type, data);
};

const startServer = (PORT = 3000) => {
    server.listen(PORT, () => {
        console.log("App running");
    });
};

export { onEvent, sendEvent, startServer };
