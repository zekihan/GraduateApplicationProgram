const functions = require('firebase-functions');

var admin = require("firebase-admin");

//const SENDGRID_API_KEY = functions.config().sendgrid.key

/*const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);*/


/*exports.sendAcceptanceEmail = functions.https.onRequest(async (request, response) => {
    const msg = {
        to: 'test@example.com',
        from: 'grad.application.1992@gmail.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
});*/