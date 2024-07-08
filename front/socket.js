const socket = io("http://localhost:3000");

const send = (type, data) => {
  socket.emit("event", { type, payload: data });
};

const receive = (type, callback, once = false) => {
  const event = once ? "once" : "on";
  socket[event]("event", (data) => {
    if (data.type === type) callback(data.payload);
  });
};

const fetchData = (type, callback) => {
  send(type, null);
  receive(type, callback, true);
};

const postData = (type, data, callback = undefined) => {
  send(type, data);
  if (callback) {
    receive(type, callback, true);
  }
};
