require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
client.messages
  .create({
    body: "your order is ready",
    from: "+13307719275",
    to: "+17788364271",
  })
  .then((message) => console.log(message.sid));
