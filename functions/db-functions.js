const functions = require('firebase-functions');

var admin = require("firebase-admin");

exports.deletePhoneInfo = functions.database.ref('/users/{userId}')
    .onCreate((snapshot, context) => {
        const original = snapshot.val()['phone'];
        return admin.database().ref('/tmp/phones/').child(original).remove();
    });

exports.applicationCreated = functions.database.ref('/applications/{term}/{department}/{applicationId}')
    .onCreate((snapshot, context) => {
        const timestamp = Date.now();
        return snapshot.ref.child('date').set(timestamp);
    });