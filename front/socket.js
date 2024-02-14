const socket = io("http://localhost:3000");

const send = (type, data) => {
    socket.emit("event", { type, payload: data });
};

const receive = (type, callback) => {
    socket.on("event", (data) => {
        if (data.type === type) callback(data.payload);
    });
};
