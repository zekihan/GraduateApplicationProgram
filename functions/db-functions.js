const functions = require('firebase-functions');

var admin = require("firebase-admin");

const https = require('https');

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

exports.page = functions.https.onRequest(async (request, response) => {
    const {
        term
    } = request.body;

    https.get(`https://grad-application.firebaseio.com/__applications__/${term}.json?shallow=true`, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {

            var keys = Object.keys(JSON.parse(data)).sort(); // Notice the .sort()!
            console.log(keys)

            var pageLength = 20;
            var pageCount = keys.length / pageLength;
            var currentPage = 1;
            var promises = [];
            var nextKey;
            var query;

            var valuesRef = admin.database().ref('/__applications__').child(term)

            for (var i = 0; i < pageCount; i++) {
                key = keys[i * pageLength];
                console.log('key', key);
                query = valuesRef.orderByKey().limitToFirst(pageLength).startAt(key);
                promises.push(query.once('value'));
            }

            Promise.all(promises)
                .then(function (snaps) {
                    var pages = [];
                    snaps.forEach(function (snap) {
                        pages.push(snap.val());
                    });
                    response.status(200).send(pages);
                    process.exit();
                });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});