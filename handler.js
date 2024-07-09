const handleEvent = (type, data) => {
  let result;
  if (type === "message") {
    console.log(`Mensaje recibido: ${data.msg}`);
    result = { msg: `Mensaje recibido: ${data.msg}` };
  } else if (type === "date") {
    result = new Date();
  }

  return result;
};

export default handleEvent;
