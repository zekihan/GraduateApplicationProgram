const {
    google
} = require('googleapis');

const functions = require('firebase-functions');

var admin = require("firebase-admin");

const {
    Storage
} = require('@google-cloud/storage');

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