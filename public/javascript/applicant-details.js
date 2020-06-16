function getApplicantData() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            //Check if the authorized user has the appropriate role to access that data
            /*firebase.database().ref('users/' + userId ).once('value').then(function(snapshot){
                if(snapshot.child('role').val() == "2"){

                }
            });*/

            //Decode the URL and get the parameters
            var queryString = decodeURIComponent(window.location.search);
            queryString = queryString.substring(1);
            var queries = queryString.split("&");

            //Get the application id from the url
            var applicationId = (queries[0].split("="))[1];
            var termInfo = (queries[1].split("="))[1];
            var department = (queries[2].split("="))[1];

            console.log("app id: " + applicationId);
            console.log("term: " + termInfo);
            console.log("department: " + department);
            firebase.database().ref('applications/' + termInfo + '/' + department + '/' + applicationId).once('value').then(function (snapshot) {

                //Get applicant's personal information
                var name = snapshot.child('content/name').val();
                var lastname = snapshot.child('content/lastName').val();
                var email = snapshot.child('content/email').val();
                var socialSecurityNo = snapshot.child('content/socialSecurityNumber').val();
                var isForeign = snapshot.child('content/isForeign').val();
                var isWorking = snapshot.child('content/isWorking').val();

                //Put personal data into html table
                displayPersonalInfo(name, lastname, email, socialSecurityNo, isForeign, isWorking);


                //Get document paths
                var alesDocumentPath = snapshot.child('content/ales').val();
                var englishExamPath = snapshot.child('content/englishExam').val();
                var passportPath = snapshot.child('content/passport').val();
                var mastersTranscriptPath = snapshot.child('content/mastersTranscript').val();
                var permissionLetterPath = snapshot.child('content/permissionLetter').val();
                var photoPath = snapshot.child('content/photo').val();
                var purposePath = snapshot.child('content/purpose').val();
                var referenceLetter1Path = snapshot.child('content/referenceLetters/0').val();
                var referenceLetter2Path = snapshot.child('content/referenceLetters/1').val();
                var undergradTranscriptPath = snapshot.child('content/undergradTranscript').val();

                
                if (referenceLetter1Path !== "#") {
                    firebase.storage().ref(referenceLetter1Path).getDownloadURL().then(function (url) {
                        document.getElementById("reference1").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }

                if (referenceLetter2Path !== "#") {
                    firebase.storage().ref(referenceLetter2Path).getDownloadURL().then(function (url) {
                        document.getElementById("reference2").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                    //If document is not present in the database, don't display the link for it
                } else {
                    document.getElementById("all-documents").removeChild(document.getElementById("referenceLetter2"));
                }

                //Get ALES document's URL.
                if (alesDocumentPath !== "#") {
                    firebase.storage().ref(alesDocumentPath).getDownloadURL().then(function (url) {
                        document.getElementById("ales").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }


                //Get English Exam Result document's URL.
                if (englishExamPath !== "#") {
                    firebase.storage().ref(englishExamPath).getDownloadURL().then(function (url) {
                        document.getElementById("englishExam").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }


                //Get Master's Transcript's URL
                if (mastersTranscriptPath !== "#") {
                    console.log("hey");
                    firebase.storage().ref(mastersTranscriptPath).getDownloadURL().then(function (url) {
                        document.getElementById("mastersTranscriptButton").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }else{
                    document.getElementById("all-documents").removeChild(document.getElementById("mastersTranscript"));
                }


                //Get Permission Letter document's URL
                if (permissionLetterPath !== "#") {
                    firebase.storage().ref(permissionLetterPath).getDownloadURL().then(function (url) {
                        document.getElementById("permission").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                    //If document is not present in the database, don't display the link for it
                } else {
                    document.getElementById("all-documents").removeChild(document.getElementById("permission-field"));
                }


                //Get Photo's URL
                if (photoPath !== "#") {
                    firebase.storage().ref(photoPath).getDownloadURL().then(function (url) {
                        document.getElementById("photo").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }


                //Get Statement Of Purpose document's URL
                if (purposePath !== "#") {
                    firebase.storage().ref(purposePath).getDownloadURL().then(function (url) {
                        document.getElementById("purpose").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }


                //Get Undergraduate Transcript document's URL
                if (undergradTranscriptPath !== "#") {
                    firebase.storage().ref(undergradTranscriptPath).getDownloadURL().then(function (url) {
                        document.getElementById("undergrad").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                }


                //Get Passport's URL
                if (passportPath !== "#") {
                    firebase.storage().ref(passportPath).getDownloadURL().then(function (url) {
                        document.getElementById("passport").onclick = function () {
                            open(url);
                        }
                    }).catch(function (error) {
                        //handle errors here
                    });
                    //If document is not present in the database, don't display the link for it
                } else {
                    document.getElementById("all-documents").removeChild(document.getElementById("passport-field"));
                }

                document.querySelector("body").removeChild(document.getElementById("spinner"));
                document.getElementById("content-container").style.visibility = "visible";
            });
        }
    });
}


function displayPersonalInfo(name, lastname, email, socialSecurityNo, isForeign, isWorking) {
    document.getElementById("nameAndLastName").innerHTML = name + ' ' + lastname;
    document.getElementById("email").innerHTML = email;
    document.getElementById("social-security-no").innerHTML = socialSecurityNo;
    document.getElementById("isForeign").innerHTML = isForeign;
    document.getElementById("isWorking").innerHTML = isWorking;
}


function openDocument(url) {
    window.open(url);
}
