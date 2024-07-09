import express from "express";
import handleEvent from "./handler.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 3000;
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

server.listen(PORT, () => {
  console.log("App running");
});
