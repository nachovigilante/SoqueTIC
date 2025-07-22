import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import chalk from "chalk";

const eventTypes = ["GET", "POST"];
// events es un objeto que contiene los eventos que se pueden ejecutar y sus respectivos handlers
const events = {};
eventTypes.forEach((type) => {
    events[type] = {};
});
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

const subscribeGETEvent = (event, handler) => {
    subscribeEvent("GET", event, handler);
};

const subscribePOSTEvent = (event, handler) => {
    subscribeEvent("POST", event, handler);
};

const subscribeEvent = (type, event, handler) => {
    if (!eventTypes.includes(type)) {
        throw new Error(
            `No se puede subscribir eventos del tipo '${type}'. Los tipos soportados son: ${eventTypes.join(
                ", "
            )}`
        );
    }
    events[type][event] = {
        type,
        event,
        handler,
    };
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

const handlerWrapper = (type, event, handler) => {
    return async (payload) => {
        const { data, query } = payload;
        DEBUGMODE &&
            console.log(
                `Llegó un evento ${chalk.green(`'${event}'`)}\n` +
                    `${
                        query && Object.keys(query).length > 0
                            ? `Tiene los siguientes parámetros query:\n${makeStyledJSON(
                                  query
                              )}\n`
                            : ""
                    }` +
                    `${
                        data
                            ? `Tiene la siguiente información:\n${makeStyledJSON(
                                  data
                              )}`
                            : ""
                    }`
            );

        const response = await (type === "GET"
            ? handler(query)
            : handler(data, query));
        DEBUGMODE &&
            console.log(
                `Se respondió al evento ${chalk.green(
                    `'${event}'`
                )} con:\n${makeStyledJSON(response)}`
            );
        return {
            status: 200,
            data: response,
        };
    };
};

io.on("connection", (socket) => {
    DEBUGMODE && console.log(chalk.gray("Se conectó un soquete"));
    // Subscribe to all GET and POST events
    Object.values(events["GET"]).forEach((e) => {
        const { type, event, handler } = e;
        const route = `${type}:${event}`;
        socket.on(route, async (payload, callback) => {
            try {
                const result = await handlerWrapper(
                    type,
                    route,
                    handler
                )(payload);
                callback(result);
            } catch (e) {
                callback({
                    status: 500,
                    message: `El servidor crasheó al procesar el evento '${route}'${
                        payload.query
                            ? ` con la query:\n${JSON.stringify(
                                  payload.query,
                                  null,
                                  2
                              )}`
                            : ""
                    }`,
                });
                throw e;
            }
        });
    });
    Object.values(events["POST"]).forEach((e) => {
        const { type, event, handler } = e;
        const route = `${type}:${event}`;

        socket.on(route, async (payload, callback) => {
            try {
                const result = await handlerWrapper(
                    type,
                    route,
                    handler
                )(payload);
                callback(result);
            } catch (e) {
                callback({
                    status: 500,
                    message: `El servidor crasheó al procesar el evento '${route}' con la data:\n${JSON.stringify(
                        payload.data,
                        null,
                        2
                    )}${
                        payload.query
                            ? `\ny la query:\n${JSON.stringify(
                                  payload.query,
                                  null,
                                  2
                              )}`
                            : ""
                    }`,
                });
                throw e;
            }
        });
    });
    socket.on("disconnect", () => {
        DEBUGMODE && console.log(chalk.gray("Se desconectó un soquete"));
    });
    socket.onAny((event, ...args) => {
        const eventRoutes = Object.keys(events["GET"])
            .map((e) => `GET:${e}`)
            .concat(Object.keys(events["POST"]).map((e) => `POST:${e}`));
        if (!eventRoutes.includes(event)) {
            DEBUGMODE &&
                console.log(
                    chalk.bgRed(
                        `Se pidió por un evento inexistente: '${event}'\n`
                    ) +
                        chalk.yellow(
                            `Revisá que esté el subscribeEvent apropiado y que coincidan los tipos. Los eventos disponibles son: ${eventRoutes.join(
                                ", "
                            )}\n`
                        )
                );
        }
    });
});
const realTimeEvent = (event, data) => {
    DEBUGMODE &&
        console.log(
            `Enviando evento: ${chalk.green(
                `'RT:${event}'`
            )} con la siguiente información:\n${makeStyledJSON(data)}`
        );
    io.emit(`RT:${event}`, data);
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

export { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer };
