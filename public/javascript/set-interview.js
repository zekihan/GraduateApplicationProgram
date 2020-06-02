function setInterview(){
    var userId = user.uid;
    //Decode the URL and get the parameters
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    //Get the application id from the url
    var applicationId = (queries[0].split("="))[1];
    var termInfo = (queries[1].split("="))[1];
    var department = (queries[2].split("="))[1];

    var placeIn = $('#place-field').val();
    var dateIn = $('#date-picker').val();
    var timeIn = $('#time-picker').val();

    //TODO: check fields left blank or not?
    
    firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId + '/departmentControl').set ({
        date: dateIn,
        time: timeIn,
        place : placeIn
    });
    
    getApplicationInfoWithId(applicationId, termInfo, department);
}

function getApplicationInfoWithId(applicationId, term, department) {
    console.log("application id is " + applicationId);
    var id = applicationId;
    var queryString = "?id=" + id + '&term=' + term + '&department=' + department;
    window.location.href = "student-review.html" + queryString;
}