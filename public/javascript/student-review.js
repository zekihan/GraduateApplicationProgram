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


//If an interview has already been set, disable the 'Set an interview' button, if not then disable 'Cancel the interview' button.
function onLoad() {

    firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId).once('value').then(function (snapshot) {

        if(snapshot.val() === null){
            window.location.href = "dept-list-applications";
        }
        
        var departmentControl = snapshot.child('departmentControl');
        var content = snapshot.child('content');
        //Get applicant's personal information
        var name = content.child('name').val();
        var lastname = content.child('lastName').val();
        var email = content.child('email').val();
        var socialSecurityNo = content.child('socialSecurityNumber').val();
        var isForeign = content.child('isForeign').val();
        var isWorking = content.child('isWorking').val();
        var interviewInfo = departmentControl.child('interviewInfo').val();


        showSetInterviewButton(interviewInfo);
        displayPersonalInfo(name, lastname, email, socialSecurityNo, isForeign, isWorking, interviewInfo);

        //Get document paths
        setDocumentLink(content.child('undergradTranscript').val(), 'undergrad-btn');
        setDocumentLink(content.child('ales').val(), 'ales-btn');
        setDocumentLink(content.child('englishExam').val(), 'en-Exam-btn');
        setDocumentLink(content.child('mastersTranscript').val(), 'mas-transcript-btn');
        setDocumentLink(content.child('referenceLetters/0').val(), 'ref-letter-btn');
    });
        
}

function cancelInterview(){
    firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId + '/departmentControl/interviewInfo').remove();
    window.location.reload();
}

function setInterview(){
    getSetInterviewPage(applicationId, termInfo, department);
}


function getSetInterviewPage(applicationId, term, department) {
    console.log("application id is " + applicationId);
    var id = applicationId;
    var queryString = "?id=" + id + '&term=' + term + '&department=' + department;
    window.location.href = "set-interview.html" + queryString;
}

function setDocumentLink(path, buttonId){
    if(path !== "#"){
        firebase.storage().ref(path).getDownloadURL().then(function (url) {
            document.getElementById(buttonId).onclick = function () {
                open(url);
            }
        }).catch(function (error) {
            //handle errors here
        });
    }
}

function displayPersonalInfo(name, lastname, email, socialSecurityNo, isForeign, isWorking, interviewInfo) {
    document.getElementById("nameAndLastName").innerHTML = name + ' ' + lastname;
    document.getElementById("email").innerHTML = email;
    document.getElementById("social-security-no").innerHTML = socialSecurityNo;
    document.getElementById("isForeign").innerHTML = isForeign;
    document.getElementById("isWorking").innerHTML = isWorking;

    if (interviewInfo) {
        document.getElementById("interview-info").innerHTML = "Yes";
    }else{
        document.getElementById("interview-info").innerHTML = "No";
    }
}


function showSetInterviewButton(interview) {
    if (interview) {
        document.getElementById("cancel-interview-btn").disabled = false;
        document.getElementById("set-interview-btn").disabled = false;

    } else{
        document.getElementById("set-interview-btn").disabled = false;
        document.getElementById("cancel-interview-btn").disabled = true;
    }
}

