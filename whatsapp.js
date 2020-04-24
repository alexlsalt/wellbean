require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

// Create the whatsapp message
client.messages.create({
	    to: "whatsapp:" + '+19495790294',
	    from: "whatsapp:" + '+14155238886',
	    body: "Hey there! Consider reaching out today to Graci, Nana-B, and Dad. Stay well. Love, wellbean"
	}).then(message => {
	    callback(null, message.sid);
	}).catch(err => callback(err));