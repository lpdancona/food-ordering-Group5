const accountSid = "AC2e20704dd16f07396b3fa291a50f0dcf";
const authToken = "03953c38c0a457517e13a9d5ca463487";
const client = require("twilio")(accountSid, authToken);
client.messages
  .create({
    body: "your order is ready",
    from: "+13307719275",
    to: "+17788364271",
  })
  .then((message) => console.log(message.sid));
