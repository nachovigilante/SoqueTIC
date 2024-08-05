import { onEvent, startServer } from "./server.js";

onEvent("message", (data) => {
    console.log(`Mensaje recibido: ${data.msg}`);
    return { msg: `Mensaje recibido: ${data.msg}` };
});

onEvent("date", () => {
    const date = new Date();
    return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
});

startServer();