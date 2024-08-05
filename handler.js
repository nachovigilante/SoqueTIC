const handleEvent = (type, data) => {
  if (type === "message") {
    console.log(`Mensaje recibido: ${data.msg}`);
    return { msg: `Mensaje recibido: ${data.msg}` };
  } else if (type === "date") {
    const date = new Date();
    return `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
  }

  throw new Error(`Tipo de evento no soportado: ${type}`);
};

export default handleEvent;
