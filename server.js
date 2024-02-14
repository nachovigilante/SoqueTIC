const express = require("express");
const app = express();
const PORT = 3000;
const { createServer } = require("node:http");

const { Server } = require("socket.io");
const { handleEvent } = require("./handler");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("User connected");
    socket.on("event", (data) => {
        handleEvent(data.type, data.payload, (type, data) => {
            socket.emit("event", {
                type,
                payload: data,
            });
        });
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log("App running");
});
