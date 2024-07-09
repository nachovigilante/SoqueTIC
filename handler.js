const handleEvent = (type, data) => {
  let result;
  if (type === "message") {
    console.log(`Mensaje recibido: ${data.msg}`);
    result = { msg: `Mensaje recibido: ${data.msg}` };
  } else if (type === "date") {
    const date = new Date();
    result = `${date.getUTCDate()}/${date.getUTCMonth() + 1}`;
  }

  return result;
};

export default handleEvent;
