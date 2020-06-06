const functions = require('firebase-functions');

var admin = require("firebase-admin");

exports.checkUserExists = functions.https.onRequest(async (request, response) => {
    const {
        email
    } = request.body;
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
    admin.database().ref('users').child(uid).set({
        name: firstName,
        lastName,
        phone,
        role: 0
    });
    response.status(200).send("saved");
});