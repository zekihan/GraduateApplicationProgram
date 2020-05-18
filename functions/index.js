const {
    google
} = require('googleapis');

const functions = require('firebase-functions');

var admin = require("firebase-admin");

admin.initializeApp();

exports.sendCode = functions.https.onRequest(async (request, res) => {

    const {
        phoneNumber,
        recaptchaToken
    } = request.body;
    console.log(request.body)

    const identityToolkit = google.identitytoolkit({
        auth: 'AIzaSyA547mqKiE8KaPBOhyzRzwmaqVvlefeTgY',
        version: 'v3'
    });

    response = await identityToolkit.relyingparty.sendVerificationCode({
        phoneNumber,
        recaptchaToken,
    });
    console.log(response.data.sessionInfo)

    const sessionInfo = response.data.sessionInfo;
    const timestamp = Date.now();
    admin.database().ref('/tmp/phones').child(phoneNumber).set({
        sessionInfo,
        timestamp
    });
    res.status(200).send("OK");
});

exports.verifyCode = functions.https.onRequest(async (request, res) => {

    const {
        phoneNumber,
        verificationCode
    } = request.body;
    console.log(request.body)

    const identityToolkit = google.identitytoolkit({
        auth: 'AIzaSyA547mqKiE8KaPBOhyzRzwmaqVvlefeTgY',
        version: 'v3',
    });

    var phoneSessionId;
    await admin.database().ref('/tmp/phones').child(phoneNumber).child('sessionInfo').once('value').then(snapshot => {
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

exports.checkUserExists = functions.https.onRequest(async (request, response) => {

    const {
        email
    } = request.body;
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

exports.populateUser = functions.https.onRequest(async (request, response) => {

    const {
        uid,
        firstName,
        lastName,
        phone
    } = request.body;
    console.log(firstName, lastName, phone);

    admin.database().ref('users').child(uid).set({
        name: firstName,
        lastName,
        phone,
        role: 0
    });
    response.status(200).send("saved");
});

exports.deletePhoneInfo = functions.database.ref('/users/{userId}')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const original = snapshot.val()['phone'];
        console.log('Uppercasing', context.params.pushId, original);

        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return admin.database().ref('/tmp/phones/').child(original).remove();
    });