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
  socket.on("event", (data) => {
    const [type, result] = handleEvent(data.type, data.payload);
    socket.emit("event", {
      type,
      payload: result,
    });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log("App running");
});
