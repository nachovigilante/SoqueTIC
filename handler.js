const handleEvent = (type, data, respond) => {
    if (type === "message") {
        console.log(`Mensaje recibido: ${data.msg}`);
        respond("message", { msg: `Mensaje recibido: ${data.msg}` });
    }
};

module.exports = { handleEvent };
