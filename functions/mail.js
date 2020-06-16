const functions = require('firebase-functions');

var admin = require("firebase-admin");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

exports.sendAcceptanceEmail = functions.https.onRequest(async (request, response) => {
    const myURL = new URL("https://www.xyz.com" + request.url);
    var term = myURL.searchParams.get('term');
    var deptId = myURL.searchParams.get('deptId');
    if (term === null) {
        response.status(400).send("term is not proper");
    }
    if (deptId === null) {
        response.status(400).send("deptId is not proper");
    }
    console.log(term, deptId);
    var valuesRef = admin.database().ref('/applications').child(term).child(deptId);
    valuesRef.orderByChild('gradschoolControl/result').equalTo(true).once('value')
        .then((snaps) => {
            snaps.forEach((snap) => {
                var data = {
                    email:snap.child('content').child('email').val(),
                    name:snap.child('content').child('name').val(),
                    lastname:snap.child('content').child('lastName').val(),
                    program:snap.child('content').child('program').val(),
                    applied:snap.child('content').child('appliedProgram').val(),
                    linkToMyapplication:'https://grad-application.web.app/users/applicant/my-application'
                }
                const msg = {
                    to: data.email,
                    from: 'IztechGradApplication@iztech.com',
                    templateId: 'd-e566f23014354760aec1bafcb72a1a42',
                    dynamic_template_data: {
                        name: data.name,
                        lastname: data.lastname,
                        program: data.program,
                        applied: data.applied,
                        email: data.email,
                        linkToMyapplication: data.linkToMyapplication
                     }
                };
                sgMail.send(msg);
            });
            response.status(200).send("ok");
            return "ok";
        })
        .catch(error => {
            console.log("Error: " + error.message);
            response.status(400).send(error.message);
        });
});