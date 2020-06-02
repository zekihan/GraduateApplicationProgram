//If an interview has already been set, disable the 'Set an interview' button, if not then disable 'Cancel the interview' button.
function onLoad() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var userId = user.uid;
            //Decode the URL and get the parameters
            var queryString = decodeURIComponent(window.location.search);
            queryString = queryString.substring(1);
            var queries = queryString.split("&");

            //Get the application id from the url
            var applicationId = (queries[0].split("="))[1];
            var termInfo = (queries[1].split("="))[1];
            var department = (queries[2].split("="))[1];

            firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId).once('value').then(function (snapshot) {
                
                var departmentControl = snapshot.child('departmentControl');
                var content = snapshot.child('content');
                //Get applicant's personal information
                var name = content.child('name').val();
                var lastname = content.child('lastName').val();
                var socialSecurityNo = content.child('socialSecurityNumber').val();
                var isForeign = content.child('isForeign').val();
                var isWorking = content.child('isWorking').val();
                var interviewInfo = departmentControl.child('interviewInfo');

                showSetInterviewButton(interviewInfo);
                displayPersonalInfo(name, lastname, socialSecurityNo, isForeign, isWorking);

                //Get document paths
                setDocumentLink(content.child('undergradTranscript').val(), 'undergrad-btn');
                setDocumentLink(content.child('ales').val(), 'ales-btn');
                setDocumentLink(content.child('englishExam').val(), 'en-Exam-btn');
                setDocumentLink(content.child('mastersTranscript').val(), 'mas-transcript-btn');
                setDocumentLink(content.child('referenceLetters/0').val(), 'ref-letter-btn');

            });

        } else {
            //redirect to login?
        }
      });
}

function setInterview(){
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    //Get the application id from the url
    var applicationId = (queries[0].split("="))[1];
    var termInfo = (queries[1].split("="))[1];
    var department = (queries[2].split("="))[1];

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

function displayPersonalInfo(name, lastname, socialSecurityNo, isForeign, isWorking) {
    document.getElementById("nameAndLastName").innerHTML = name + ' ' + lastname;
    document.getElementById("email").innerHTML = "NaN";
    document.getElementById("social-security-no").innerHTML = socialSecurityNo;
    document.getElementById("isForeign").innerHTML = isForeign;
    document.getElementById("isWorking").innerHTML = isWorking;
}


function showSetInterviewButton(interview) {
    if (interview) {
        document.getElementById("cancel-interview-btn").disabled = true;
        document.getElementById("set-interview-btn").disabled = false;

    } else if (interview) {
        document.getElementById("set-interview-btn").disabled = true;
        document.getElementById("cancel-interview-btn").disabled = false;
    } else {
        //throw exception
    }
}

