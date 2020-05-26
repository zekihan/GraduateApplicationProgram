function getApplicationData() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //Get firebase database instance
            var userId = firebase.auth().currentUser.uid;
            firebase.database().ref('users/' + userId + '/applications').once('value').then(function (snapshot) {
                if (snapshot === null) {
                    addDataToTables(null, null);
                    return;
                }
                snapshot.forEach(function (childSnapshot) {
                    //Get the application id
                    var applicationId = childSnapshot.key;

                    //application path is something like 'applications/2020-1/1/uTMJFggaAcSi5xYQ4o6kpkvifh4
                    //Get the application term
                    var term = childSnapshot.child('term').val() + '/';
                    //Get the application departmentId
                    var departmentId = childSnapshot.child('department').val();

                    //Get the interview data.
                    firebase.database().ref('applications').child(term).child(departmentId).child(applicationId).once('value').then(function (applicationSnapshot) {
                        var createDate = applicationSnapshot.child('date').val();
                        var date = applicationSnapshot.child('departmentControl/interviewInfo/date').val();
                        var place = applicationSnapshot.child('departmentControl/interviewInfo/place').val();
                        var time = applicationSnapshot.child('departmentControl/interviewInfo/time').val();
                        var isAccepted = applicationSnapshot.child('departmentControl/isAccepted').val();

                        var applicationProperties = new Map();

                        applicationProperties.set('createDate', createDate);
                        applicationProperties.set('date', date);
                        applicationProperties.set('place', place);
                        applicationProperties.set('time', time);
                        if (isAccepted === null) {
                            applicationProperties.set('isAccepted', null);
                        } else {
                            applicationProperties.set('isAccepted', isAccepted);
                        }

                        //Get the application's acceptance data
                        var isVerified = applicationSnapshot.child('gradschoolControl/isVerified').val();
                        if (isVerified === null) {
                            applicationProperties.set('isVerified', null);
                        } else {
                            applicationProperties.set('isVerified', isVerified);
                        }

                        var result = applicationSnapshot.child('gradschoolControl/result').val();
                        if (result === null) {
                            applicationProperties.set('result', null);
                        } else {
                            applicationProperties.set('result', result);
                        }
                        firebase.database().ref('departments').child(departmentId).once('value').then(function (depSnapshot) {
                            //Display each application's data on the my-application.html page
                            addDataToTables(applicationProperties, depSnapshot.child("name").val());
                        });
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
function addDataToTables(applicationData, departmentId) {
    if (applicationData === null) {
        var currentStatus = 'You haven\'t created an application yet';
        var createDate = "-";
        var date = "-";
        var place = "-";
        var time = "-";
        var isAccepted = "-";
        var isVerified = "-";
        var result = "-";
    } else {
        var createDate = applicationData.get('createDate');
        createDate = timeConverter(createDate);
        var date = applicationData.get('date');
        if (date === null) date = "-";
        var place = applicationData.get('place');
        if (place === null) place = "-";
        var time = applicationData.get('time');
        if (time === null) time = "-";
        var isAccepted = applicationData.get('isAccepted');
        var isVerified = applicationData.get('isVerified');
        var result = applicationData.get('result');
        if (isVerified === 1) {
            if (isAccepted === 'true') {
                if (result === 'true') {
                    currentStatus = 'Your application has been accepted';
                } else {
                    currentStatus = 'Waiting for announcements';
                }
            } else if (isAccepted === 'false') {
                currentStatus = 'Application has been rejected';
            } else {
                currentStatus = 'Waiting for department response';
            }
        } else if (isVerified === 0) {
            currentStatus = 'Application has been rejected';
        } else {
            currentStatus = 'Waiting Graduate School to verify documents';
        }
    }

    var tableRow = document.createElement("TR");

    var tableDataTag1 = document.createElement("TD");
    var tableData1 = document.createTextNode(departmentId);
    tableDataTag1.appendChild(tableData1);

    var tableDataTag2 = document.createElement("TD");
    var tableData2 = document.createTextNode(currentStatus);
    tableDataTag2.appendChild(tableData2);


    var tableDataTag3 = document.createElement("TD");
    var tableData3 = document.createTextNode(createDate);
    tableDataTag3.appendChild(tableData3);


    tableRow.appendChild(tableDataTag1);
    tableRow.appendChild(tableDataTag2);
    tableRow.appendChild(tableDataTag3);

    document.getElementById('applicationEntries').appendChild(tableRow);


    var interviewTableRow = document.createElement("TR");

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

function timeConverter(timestamp) {
    var a = new Date(timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}