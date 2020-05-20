//If the applicant is foreign, make the passport input field visible, invisible if otherwise.
function setVisibilityOfPassportInput(element) {
    document.getElementById("passport-input-field").style.display = element.value == 'foreign' ? 'block' : 'none';
}

//If the applicant currently has a job, make the permission letters input field visible, invisible if otherwise.
function setVisibilityOfPermissionLetterInput(element) {
    document.getElementById("permission-letters-input").style.display = element.value == 'yes' ? 'block' : 'none';
}

//If the applicant is applying for a PhD program, then ask for his/her Master's Degree transcript.
function setVisibilityOfGradTranscriptInput(element) {
    document.getElementById("grad-transcript-input").style.display = element.value == 'phd' ? 'block' : 'none';
}

function uploadDocument(uid, appId, file) {
    var storageRef = firebase.storage().ref();
    var metadata = {};
    var uploadTask = storageRef.child('documents/').child(uid).child(appId).child(file.name).put(file, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        },
        function (error) {
            switch (error.code) {
                case 'storage/unauthorized':
                    break;
                case 'storage/canceled':
                    break;
                case 'storage/unknown':
                    break;
            }
        },
        function () {
            console.log('Upload is finished');
        });
}

function submitResult() {
    var personelInfo = JSON.parse(getCookie("persenolInfo"));
    let info = {
        ...personelInfo,
        ...getInfo()
    };
    console.log(info);

    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users').child(userId).child("applications").once('value').then(function (snapshot) {
        i = snapshot.numChildren() + 1;
        if (info.passport != "#") {
            uploadDocument(userId, i + "", info.passport);
            info.passport = "/documents/" + userId + "/" + i + "/" + info.passport.name;
        }
        if (info.permissionLetter != "#") {
            uploadDocument(userId, i + "", info.permissionLetter);
            info.permissionLetter = "/documents/" + userId + "/" + i + "/" + info.permissionLetter.name;
        }
        if (info.mastersTranscript != "#") {
            uploadDocument(userId, i + "", info.mastersTranscript);
            info.mastersTranscript = "/documents/" + userId + "/" + i + "/" + info.mastersTranscript.name;
        }
        uploadDocument(userId, i + "", info.photo);
        info.photo = "/documents/" + userId + "/" + i + "/" + info.photo.name;
        uploadDocument(userId, i + "", info.undergradTranscript);
        info.undergradTranscript = "/documents/" + userId + "/" + i + "/" + info.undergradTranscript.name;
        uploadDocument(userId, i + "", info.ales);
        info.ales = "/documents/" + userId + "/" + i + "/" + info.ales.name;
        uploadDocument(userId, i + "", info.englishExam);
        info.englishExam = "/documents/" + userId + "/" + i + "/" + info.englishExam.name;
        uploadDocument(userId, i + "", info.referenceLetters[0]);
        info.referenceLetters[0] = "/documents/" + userId + "/" + i + "/" + info.referenceLetters[0].name;
        if (info.referenceLetters[1] != undefined) {
            uploadDocument(userId, i + "", info.referenceLetters[1]);
            info.referenceLetters[1] = "/documents/" + userId + "/" + i + "/" + info.referenceLetters[1].name;
        } else {
            info.referenceLetters[1] = "#";
        }
        uploadDocument(userId, i + "", info.purpose);
        info.purpose = "/documents/" + userId + "/" + i + "/" + info.purpose.name;

        firebase.database().ref('/applications').orderByValue().limitToLast(1).once('value').then(function (snapshot) {
            snapshot.forEach(childSnapshot => {
                var term = childSnapshot.key;
                var department = info.department;

                var newAppKey = childSnapshot.ref.child(info.department).push().key;

                var updates = {};
                updates['/applications/' + term + "/" + department + "/" + newAppKey] = info;
                updates['/users/' + userId + "/applications/" + newAppKey] = {
                    term,
                    department: parseInt(department, 10)
                };
                console.log(updates);
                return firebase.database().ref().update(updates);
            });
        });
    });


}

function getInfo() {
    var department = $("#departmentSelection :selected").val();

    var isForeign = false;
    var passport = "#";
    if ($("#studentTypeSelection :selected").val() === "foreign") {
        isForeign = true;
        var passport = document.getElementById("passport").files[0];
    }

    var isWorking = false;
    var permissionLetter = "#";
    if ($("#isWorking :selected").val() === "yes") {
        var isWorking = true;
        var permissionLetter = document.getElementById("permissionLetter").files[0];
    }

    var photo = document.getElementById("photoFile").files[0];
    var undergradTranscript = document.getElementById("underGradTransFile").files[0];
    var ales = document.getElementById("alesFile").files[0];
    var englishExam = document.getElementById("englishFile").files[0];
    var referenceLetters = {
        0: document.getElementById("referenceFiles").files[0],
        1: document.getElementById("referenceFiles").files[1]
    };
    var purpose = document.getElementById("purposeFile").files[0];

    var program = $("#degreeSelection :selected").val();
    var mastersTranscript = "#";
    if (program === "phd") {
        var mastersTranscript = document.getElementById("mastersDegreeTranscript").files[0];
    }
    var info = {
        department,
        isForeign,
        passport,
        isWorking,
        permissionLetter,
        photo,
        undergradTranscript,
        ales,
        englishExam,
        referenceLetters,
        purpose,
        program,
        mastersTranscript
    }
    return info;
}

function fillDepartment() {
    firebase.database().ref('departments').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var deptId = childSnapshot.key;
            var deptName = childSnapshot.child('name').val();
            if (childSnapshot.child('isTaking').val() == 1) {
                s = `<option value="${deptId}">${deptName}</option>`;
                $("#departmentSelection").append(s);
            }
        });
    });
}

//Function will be used whenever the user completes the first part of the application and presses 'Next' button.
function storeAndGetNextPage() {
    var persenolInfo = {
        name: document.getElementById('firstName').value,
        lastname: document.getElementById('lastName').value,
        socialSecurityNumber: document.getElementById('socialSecurityNumber').value,
        address1: document.getElementById('address').value,
        address2: document.getElementById('address2').value,
        country: document.getElementById('country').value,
        zip: document.getElementById('zip').value
    }
    document.cookie = "persenolInfo=" + JSON.stringify(persenolInfo);;
    //Store personal info first, display spinner while doing it.
    location.href = "application-app-info"; //Then direct the user to the next application page.
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}