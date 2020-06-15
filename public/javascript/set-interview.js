
//Decode the URL and get the parameters
var queryString = decodeURIComponent(window.location.search);
queryString = queryString.substring(1);
var queries = queryString.split("&");

//Get the application id from the url
var applicationId = "";
applicationId = (queries[0].split("="))[1];
var termInfo = "";
termInfo = (queries[1].split("="))[1];
var department = "";
department = (queries[2].split("="))[1];

console.log("application id is " + applicationId);

firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId).once("value").then(function (snapshot) {
    if(snapshot.val() === null){
        window.location.href = "dept-list-applications";
    }
    var name = snapshot.child('content/name').val();
    var nameSpan = document.getElementById("applicant-name");
    nameSpan.textContent = name;
});


function setInterview(){

    var placeIn = $('#place-field').val();
    var dateIn = $('#date-picker').val();
    var timeIn = $('#time-picker').val();
    
    //TODO: check fields left blank or not?
    
    firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId + '/departmentControl/interviewInfo').set ({
        date: dateIn,
        time: timeIn,
        place : placeIn
    });
    
    getApplicationInfoWithId(applicationId, termInfo, department);
}

function getApplicationInfoWithId(applicationId, term, department) {
    console.log("application id is " + applicationId);
    var queryString = "?id=" + applicationId + '&term=' + term + '&department=' + department;
    window.location.href = "student-review" + queryString;
}