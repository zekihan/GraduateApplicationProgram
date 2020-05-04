
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.

var admin = require("firebase-admin");

admin.initializeApp();


exports.echoMessage = functions.https.onRequest(async (request, response) => {
    // Grab the text parameter.
    const original = request.query.text;

    const snapshot = await admin.database().ref('messages').set(original);
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    //console.log(request)
    response.redirect(303, "/");
    //response.status(303).send(original);
});
