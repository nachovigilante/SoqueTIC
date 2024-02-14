const handleEvent = (type, data, callback) => {
    if (type === "message") {
        console.log(`Mensaje recibido: ${data.msg}`);
        callback("message", { msg: `Mensaje recibido: ${data.msg}` });
    }
};

module.exports = { handleEvent };
