const socket = io("http://localhost:3000");

const send = (type, data, callback = () => {}) => {
  socket.emit("realTimeEvent", type, data, callback);
};

const receive = (type, callback) => {
  socket.on("realTimeEvent", (receivedType, data) => {
    if (receivedType === type) callback(data);
  });
};

const fetchData = (type, callback) => {
  socket.emit("GETEvent", type, callback);
};

const postData = (type, data, callback = undefined) => {
  socket.emit("POSTEvent", type, data, callback);
};
