require('dotenv').config();
const userContacts = require('./script');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myNumber = process.env.MY_WHATSAPP_NUMBER;
const senderNumber = process.env.SENDER_NUMBER;

const client = require('twilio')(accountSid, authToken);

// Create the whatsapp message

	client.messages.create({
		to: "whatsapp:" + `${myNumber}`,
		from: "whatsapp:" + `${senderNumber}`,
		body: `Hello! Consider sending ${name} a message`
	}).then(message => {
		callback(null, message.sid);
	}).catch(err => callback(err));




