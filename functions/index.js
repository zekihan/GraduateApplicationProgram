const {
    google
} = require('googleapis');

const functions = require('firebase-functions');

var admin = require("firebase-admin");

admin.initializeApp();

exports.sendCode = functions.https.onRequest(async (request, res) => {

    const {
        phoneNumber,
        recaptcha
    } = request.body;
    console.log(request.body)

    const identityToolkit = google.identitytoolkit({
        auth: 'AIzaSyBIa9fFrqi0f50b7jW8OI5racdVnVlbR3k',
        version: 'v3',
    });

    response = await identityToolkit.relyingparty.sendVerificationCode({
        phoneNumber,
        recaptchaToken: recaptcha,
    });
    console.log(response)
    console.log(response.data)
    console.log(response.data.sessionInfo)
    // save sessionInfo into db. You will need this to verify the SMS code
    const sessionInfo = response.data.sessionInfo;
    admin.database().ref('/tmp/phones').child(phoneNumber).set(sessionInfo);
    res.status(200).send("OK");
});

exports.verifyCode = functions.https.onRequest(async (request, res) => {

    const {
        phoneNumber,
        verificationCode
    } = request.body;
    console.log(request.body)

    const identityToolkit = google.identitytoolkit({
        auth: 'AIzaSyBIa9fFrqi0f50b7jW8OI5racdVnVlbR3k',
        version: 'v3',
    });

    var phoneSessionId;
    await admin.database().ref('/tmp/phones').child(phoneNumber).once('value').then(snapshot => {
        phoneSessionId = snapshot.val();
        console.log(phoneSessionId);
        return phoneSessionId;
    }).catch(err => {
        response.status(400).send(err.message);
    });

    await identityToolkit.relyingparty.verifyPhoneNumber({
        code: verificationCode,
        sessionInfo: phoneSessionId,
    });

    res.status(200).send("OK");
});

exports.echoMessage = functions.https.onRequest(async (request, response) => {
    // Grab the text parameter.
    const email = request.get("email");
    console.log(email)

    return admin.auth().getUserByEmail(email).then(user => {
        response.status(200).send("true");
        return response;
    }).catch(err => {
        if (err.code === 'auth/user-not-found') {
            response.status(200).send("false");
        } else {
            response.status(400).send(err.message);
        }
    })
});