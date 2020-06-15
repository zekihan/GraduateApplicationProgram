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

    promises.push(uploadTask);

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

var promises = [];

function submitResult() {
    $('.error-msg').text("");
    if (checkDocumentFields()) {
        promises = [];
        var personelInfo = JSON.parse(getCookie("persenolInfo"));
        let info = {
            ...personelInfo,
            ...getInfo()
        };
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
            Promise.all(promises).then(tasks => {
                console.log('all uploads complete');
                firebase.database().ref('/applications').orderByValue().limitToLast(1).once('value').then(function (snapshot) {
                    snapshot.forEach(childSnapshot => {
                        var term = childSnapshot.key;
                        var department = info.department;

                        var newAppKey = firebase.database().ref('/__applications__').push().key;

                        var updates = {};
                        updates['/applications/' + term + "/" + department + "/" + newAppKey + "/content"] = info;
                        updates['/users/' + userId + "/applications/" + newAppKey] = {
                            term,
                            department: parseInt(department, 10)
                        };
                        console.log(updates);
                        return firebase.database().ref().update(updates);
                    });
                    window.location.href = "/users/applicant/applicant-dashboard"; //Then direct the user to dashboard page.
                });
            });

        });
    } else {
        $('#buttons').html('<button class="btn btn-primary btn-lg btn-block" id="create-app" type="button"onclick="submitResult()">Submit</button>');
    }
}

function checkDocumentFields(persenolInfo) {

    var department = $("#departmentSelection :selected").val()
    if (department === "Choose..." || department === "") {
        $("#departmentSelection-error").text("Please choose a department.");
        return false;
    }

    var isForeign = false;
    var passport = "#";
    var studentTypeSelection = $("#studentTypeSelection :selected").val();
    if (studentTypeSelection === "Choose..." || studentTypeSelection === "") {
        $("#studentTypeSelection-error").text("Please choose a student type.");
        return false;
    } else if (studentTypeSelection === "foreign") {
        isForeign = true;
        passport = document.getElementById("passport").files[0];
        if (passport === undefined || passport === "#") {
            $("#passport-error").text("Please choose passport file.");
            return false;
        }
    }

    var isWorking = false;
    var permissionLetter = "#";
    var working = $("#isWorking :selected").val()
    if (working === "Choose..." || working === "") {
        $("#isWorking-error").text("Please choose working status.");
        return false;
    } else if (working === "yes") {
        var isWorking = true;
        var permissionLetter = document.getElementById("permissionLetter").files[0];
        if (permissionLetter === undefined || permissionLetter === "#") {
            $("#permissionLetter-error").text("Please choose permission letter file.");
            return false;
        }
    }

    var photo = document.getElementById("photoFile").files[0];
    if (photo === undefined) {
        $("#photoFile-error").text("Please choose photo file.");
        return false;
    }

    var undergradTranscript = document.getElementById("underGradTransFile").files[0];
    if (undergradTranscript === undefined) {
        $("#undergradTranscript-error").text("Please choose Undergraduate Transcript file.");
        return false;
    }

    var ales = document.getElementById("alesFile").files[0];
    if (ales === undefined) {
        $("#alesFile-error").text("Please choose ales result file.");
        return false;
    }

    var englishExam = document.getElementById("englishFile").files[0];
    if (englishExam === undefined) {
        $("#englishFile-error").text("Please choose english exam result file.");
        return false;
    }

    var referenceLetters = {
        0: document.getElementById("referenceFiles").files[0],
        1: document.getElementById("referenceFiles").files[1]
    };
    if (referenceLetters[0] === undefined) {
        $("#referenceFiles-error").text("Please you need choose at least one reference file.");
        return false;
    }

    var purpose = document.getElementById("purposeFile").files[0];
    if (purpose === undefined) {
        $("#purposeFile-error").text("Please choose purpose file.");
        return false;
    }

    var program = $("#degreeSelection :selected").val();
    var mastersTranscript = "#";
    if (program === "Choose..." || program === "") {
        $("#degreeSelection-error").text("Please choose a degree.");
        return false;
    } else if (program === "phd") {
        mastersTranscript = document.getElementById("mastersTranscript").files[0];
        if (mastersTranscript === undefined || mastersTranscript === "#") {
            $("#mastersTranscript-error").text("Please choose Masters Degree Transcript file.");
            return false;
        }
    }

    var appliedProgram = $("#programSelection :selected").val();
    if (appliedProgram === "Choose..." || appliedProgram === "") {
        $("#programSelection-error").text("Please choose a program.");
        return false;
    }


    return true;
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
        var mastersTranscript = document.getElementById("mastersTranscript").files[0];
    }
    var appliedProgram = $("#programSelection :selected").val();
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
        mastersTranscript,
        appliedProgram
    }
    return info;
}

function fillDepartment() {
    firebase.database().ref('departments').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var deptId = childSnapshot.key;
            var deptName = childSnapshot.child('name').val();
            s = `<option id="${deptId}" value="${deptId}">${deptName}</option>`;
            $("#departmentSelection").append(s);
        });
    });
}

function checkPersenolInfoFields(persenolInfo) {
    if (persenolInfo.name === "") {
        $("#firstName-error").text("This field cannot be empty.");
        return false;
    }
    if (persenolInfo.lastName === "") {
        $("#lastName-error").text("This field cannot be empty.");
        return false;
    }
    if (persenolInfo.socialSecurityNumber === "") {
        $("#socialSecurityNumber-error").text("This field cannot be empty.");
        return false;
    }
    console.log(persenolInfo.socialSecurityNumber.length)
    if (persenolInfo.socialSecurityNumber.length != 11) {
        $("#socialSecurityNumber-error").text("Social Security Number has to be 11 digits.");
        return false;
    }
    if (persenolInfo.address1 === "") {
        $("#address-error").text("This field cannot be empty.");
        return false;
    }
    if (persenolInfo.country === "") {
        $("#country-error").text("This field cannot be empty.");
        return false;
    }
    if (persenolInfo.zip === "") {
        $("#zip-error").text("This field cannot be empty.");
        return false;
    }
    return true;
}

//Function will be used whenever the user completes the first part of the application and presses 'Next' button.
function storeAndGetNextPage() {
    $('.error-msg').text("");
    var persenolInfo = {
        name: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        socialSecurityNumber: document.getElementById('socialSecurityNumber').value,
        address1: document.getElementById('address').value,
        address2: document.getElementById('address2').value,
        country: document.getElementById('country').value,
        zip: document.getElementById('zip').value
    }
    if (checkPersenolInfoFields(persenolInfo)) {
        document.cookie = "persenolInfo=" + JSON.stringify(persenolInfo);;
        //Store personal info first, display spinner while doing it.
        location.href = "application-app-info"; //Then direct the user to the next application page.
    }
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