import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import chalk from "chalk";

// events es un objeto que contiene los eventos que se pueden ejecutar y sus respectivos handlers
const events = {};
// DEBUG es un booleano que determina si se muestran mensajes de debug en la consola
let DEBUGMODE = true;

const makeStyledJSON = (object) => {
    const json = JSON.stringify(object, null, 2);
    if (json === undefined) return chalk.blue("undefined");
    const jsonSplitByLines = json.split("\n");
    const lineCount = jsonSplitByLines.length;
    let styledJSON = chalk.blue(jsonSplitByLines.slice(0, 15).join("\n"));
    if (lineCount > 15) {
        styledJSON += `\n... y ${lineCount - 15} líneas más`;
    }
    return styledJSON;
};

const eventTypes = ["GET", "POST"];

const subscribeEvent = (type, route, handler) => {
    if (!eventTypes.includes(type)) {
        throw new Error(
            `No se puede subscribir eventos del tipo '${type}'. Los tipos soportados son: ${eventTypes.join(
                ", "
            )}`
        );
    }
    events[route] = { type, route, handler };
};

const app = express();
const server = createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const handlerWrapper = (type, route, handler) => {
    return async (data) => {
        DEBUGMODE &&
            console.log(
                `Llegó un evento ${chalk.green(`'${type}: ${route}'`)} ${
                    data
                        ? ` con la siguiente información:\n${makeStyledJSON(
                              data
                          )}`
                        : ""
                }`
            );
        const response = await handler(data);
        DEBUGMODE &&
            console.log(
                `Se respondió al evento ${chalk.green(
                    `'${type}: ${route}'`
                )} con:\n${makeStyledJSON(response)}`
            );
        return {
            status: 200,
            data: response,
        };
    };
};

/* DEBUGMODE &&
        console.log(chalk.red(`Llegó un evento no soportado: '${type}'`));
    return {
        status: 404,
        message: `Evento '${type}' no soportado.\nRevisá que esté el onEvent apropiado y que coincidan los tipos.`,
}*/

io.on("connection", (socket) => {
    DEBUGMODE && console.log(chalk.gray("Se conectó un soquete"));
    Object.values(events).forEach((event) => {
        const { type, route, handler } = event;
        if (type === "GET") {
            socket.on(route, async (callback) => {
                try {
                    const result = await handlerWrapper(type, route, handler)();
                    callback(result);
                } catch (e) {
                    callback({
                        status: 500,
                        message: `El servidor crasheó al mandar el mensaje '${route}'`,
                    });
                    throw e;
                }
            });
        } else if (type === "POST") {
            socket.on(route, async (data, callback) => {
                try {
                    const result = await handlerWrapper(
                        type,
                        route,
                        handler
                    )(data);
                    callback(result);
                } catch (e) {
                    callback({
                        status: 500,
                        message: `El servidor crasheó al mandar el mensaje '${route}' con la data:\n${JSON.stringify(
                            data,
                            null,
                            2
                        )}`,
                    });
                    throw e;
                }
            });
        }
    });
    socket.on("disconnect", () => {
        DEBUGMODE && console.log(chalk.gray("Se desconectó un soquete"));
    });
});

const sendEvent = (route, data) => {
    DEBUGMODE &&
        console.log(
            `Enviando evento: ${chalk.green(
                `'${route}'`
            )} con la siguiente información:\n${makeStyledJSON(data)}`
        );
    io.emit("realTimeEvent", route, data);
};

const startServer = (PORT = 3000, DEBUG = true) => {
    DEBUGMODE = DEBUG;
    server.listen(PORT, () => {
        console.log(
            `${chalk.yellowBright(
                "¡Servidor prendido!"
            )}\nEscuchando eventos...\n${chalk.gray(
                "Para parar el servidor, apretá Ctrl + C"
            )}\n${
                DEBUG
                    ? chalk.gray(
                          `Para que no se muestren por consola los mensajes sobre el funcionamiento de ${chalk.white(
                              "SoqueTIC"
                          )}, iniciar ${chalk.green(
                              "startServer"
                          )} con modo ${chalk.blue("'DEBUG'")} en ${chalk.green(
                              "false"
                          )}`
                      )
                    : ""
            }\n`
        );
    });
};

export { subscribeEvent, sendEvent, startServer };
