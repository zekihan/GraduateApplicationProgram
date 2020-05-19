function getApplicationData() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //Get firebase database instance
            var userId = firebase.auth().currentUser.uid;
            var userEmail = user.email;
            var applicationProperties = new Map();
            firebase.database().ref('users/' + userId + '/applications').once('value').then(function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    //Get the application id
                    var applicationId = childSnapshot.key;

                    //application path is something like 'applications/2020-1/1/uTMJFggaAcSi5xYQ4o6kpkvifh4
                    //Get the application term
                    var term = childSnapshot.child('term').val() + '/';
                    //Get the application departmentId
                    var departmentId = childSnapshot.child('department').val();

                    //Get the interview data.
                    firebase.database().ref('applications').child(term).child(departmentId).child(applicationId).once('value').then(function (snapshot) {
                        var date = snapshot.child('departmentControl/interviewInfo/date').val();
                        var place = snapshot.child('departmentControl/interviewInfo/place').val();
                        var time = snapshot.child('departmentControl/interviewInfo/time').val();
                        var isAccepted = snapshot.child('departmentControl/isAccepted').val();

                        applicationProperties.set('date', date);
                        applicationProperties.set('place', place);
                        applicationProperties.set('time', time);
                        applicationProperties.set('isAccepted', isAccepted);

                        //Get the application's acceptance data
                        var isVerified = snapshot.child('gradschoolControl/isVerified').val();
                        var result = snapshot.child('gradschoolControl/result').val();

                        applicationProperties.set('isVerified', isVerified);
                        applicationProperties.set('result', result);

                        //Display each application's data on the my-application.html page
                        addDataToApplicationTable(applicationProperties, userEmail);
                    });
                });
            });
        } else {
            // No user is signed in.
            console.log("Authentication failed!");
        }
    });

}

//applicationData is a map that contains date, place, time, isAccepted, isVerified and result data.
function addDataToApplicationTable(applicationData, userEmail) {
    var date = applicationData.get('date');
    var place = applicationData.get('place');
    var time = applicationData.get('time');
    var isAccepted = applicationData.get('isAccepted');
    var isVerified = applicationData.get('isVerified');
    var result = applicationData.get('result');

    var currentStatus = 'Application not verified';

    if (isVerified == 'true') {
        if (isAccepted == 'true') {
            if (result == 'true') {
                currentStatus = 'Your application has been accepted';
            } else {
                currentStatus = 'Waiting for announcements';
            }
        } else {
            currentStatus = 'Waiting for department response';
        }
    } else {
        currentStatus = 'Application has been rejected';
    }

    var tableRow = document.createElement("TR");

var tableDataTag1 = document.createElement("TD");
var tableData1 = document.createTextNode(userEmail);
tableDataTag1.appendChild(tableData1);

var tableDataTag2 = document.createElement("TD");
var tableData2 = document.createTextNode(currentStatus);
tableDataTag2.appendChild(tableData2);


var tableDataTag3 = document.createElement("TD");
var tableData3 = document.createTextNode('some date');
tableDataTag1.appendChild(tableData3);


tableRow.appendChild(tableDataTag1);
tableRow.appendChild(tableDataTag2);
tableRow.appendChild(tableDataTag3);

document.getElementById('applicationEntries').appendChild(tableRow);


 var interviewTableRow= document.createElement("TR");

var interviewTableDataTag1 = document.createElement("TD");
tableData1 = document.createTextNode(place);
interviewTableDataTag1.appendChild(tableData1);

var interviewTableDataTag2 = document.createElement("TD");
tableData2 = document.createTextNode(date);
interviewTableDataTag2.appendChild(tableData2);

var interviewTableDataTag3 = document.createElement("TD");
tableData3 = document.createTextNode(time);
interviewTableDataTag3.appendChild(tableData3);

interviewTableRow.appendChild(interviewTableDataTag1);
interviewTableRow.appendChild(interviewTableDataTag2);
interviewTableRow.appendChild(interviewTableDataTag3);

document.getElementById('interviewEntries').appendChild(interviewTableRow);
}