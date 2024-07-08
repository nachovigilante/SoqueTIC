const handleEvent = (type, data) => {
  let result;
  if (type === "message") {
    console.log(`Mensaje recibido: ${data.msg}`);
    result = { msg: `Mensaje recibido: ${data.msg}` };
  }

  return [type, result];
};

export default handleEvent;
