const functions = require('firebase-functions');

var admin = require("firebase-admin");

const https = require('https');

global.URL = require('url').URL;


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

exports.deptPagination = functions.https.onRequest(async (request, response) => {

    // info = {
    //     "content": {
    //         "address1": "address1",
    //         "address2": "",
    //         "ales": "/documents/6phlpzlB7Dajo35ey1Cap8OVdWx2/4/ales.pdf",
    //         "country": "Turkey",
    //         "department": "1",
    //         "englishExam": "/documents/6phlpzlB7Dajo35ey1Cap8OVdWx2/4/englishExam.pdf",
    //         "isForeign": false,
    //         "isWorking": false,
    //         "lastName": "lastName",
    //         "mastersTranscript": "#",
    //         "name": "name",
    //         "passport": "#",
    //         "permissionLetter": "#",
    //         "photo": "/documents/6phlpzlB7Dajo35ey1Cap8OVdWx2/4/photo.jpg",
    //         "program": "mastersDegree",
    //         "purpose": "/documents/6phlpzlB7Dajo35ey1Cap8OVdWx2/4/purpose.pdf",
    //         "referenceLetters": ["/documents/6phlpzlB7Dajo35ey1Cap8OVdWx2/4/referenceLetter.pdf", "#"],
    //         "socialSecurityNumber": "12312312312",
    //         "undergradTranscript": "/documents/6phlpzlB7Dajo35ey1Cap8OVdWx2/4/undergradTranscript.pdf",
    //         "zip": "00000"
    //     },
    //     "gradschoolControl": {
    //         "isVerified": true
    //     }
    // }
    // for (let index = 0; index < 100; index++) {
    //     var ref = admin.database().ref('/__applications__')
    //     var newAppKey = ref.push().key;
    //     var term = '2020-2'
    //     var department = '1'
    //     var updates = {};
    //     updates['/__applications__/' + term + '/' + newAppKey] = department;
    //     updates['/applications/' + term + "/" + department + "/" + newAppKey] = info;

    //     admin.database().ref().update(updates);
    // }

    const myURL = new URL("https://www.xyz.com" + request.url);
    var term = myURL.searchParams.get('term');
    var pageLength = parseInt(myURL.searchParams.get('pageSize'), 10);
    var deptId = myURL.searchParams.get('deptId');
    if (term === null) {
        response.status(400).send("term is not proper");
    }
    if (deptId === null) {
        response.status(400).send("deptId is not proper");
    }
    if (isNaN(pageLength)) {
        response.status(400).send("pageSize is not proper");
    }

    var valuesRef = admin.database().ref('/applications').child(term).child(deptId);
    valuesRef.orderByChild('gradschoolControl/isVerified').equalTo(true).once('value')
        .then((snaps) => {
            var apps = [];
            snaps.forEach((snap) => {
                apps.push({
                    [snap.key]: snap.val()
                });
            });

            var pageCount = apps.length / pageLength;
            var pages = [];
            for (var i = 0; i < pageCount; i++) {
                var page = [];
                for (let index = i * pageLength; index < (i + 1) * pageLength && index < apps.length; index++) {
                    page.push(apps[index]);
                }
                pages.push(page);
            }
            responseBody = {
                pages
            }
            console.log(responseBody)
            response.status(200).send(responseBody);
            return responseBody;
        })
        .catch(error => {
            console.log("Error: " + error.message);
            response.status(400).send(error.message);
        });


});
exports.appPagination = functions.https.onRequest(async (request, response) => {

    const myURL = new URL("https://www.xyz.com" + request.url);
    var term = myURL.searchParams.get('term');
    var pageLength = parseInt(myURL.searchParams.get('pageSize'), 10);

    if (term === null) {
        response.status(400).send("term is not proper");
    }
    if (isNaN(pageLength)) {
        response.status(400).send("pageSize is not proper");
    }

    https.get(`https://grad-application.firebaseio.com/__applications__/${term}.json?shallow=true`, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        resp.on('end', () => {

            var keys = Object.keys(JSON.parse(data)).sort();
            var pageCount = keys.length / pageLength;
            var pages = [];
            for (var i = 0; i < pageCount; i++) {
                var page = [];
                for (let index = i * pageLength; index < (i + 1) * pageLength && index < keys.length; index++) {
                    page.push(keys[index]);
                }
                pages.push(page);
            }
            responseBody = {
                pages
            }
            response.status(200).send(responseBody);
        });

    }).on("error", (error) => {
        console.log("Error: " + error.message);
        response.status(400).send(error.message);
    });
});