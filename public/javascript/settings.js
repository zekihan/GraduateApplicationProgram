function getUserInformation() {
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {

            //User id
            var userId = user.uid;

            //User's email
            var userEmail = user.email;

            //reference path : 'users/userId'
            var refPath = 'users/' + userId;

            document.getElementById("email-placeholder").innerHTML = "25%";
            document.getElementById("email-placeholder").style.width = "25%";

            document.getElementById("phone-placeholder").innerHTML = "25%";
            document.getElementById("phone-placeholder").style.width = "25%";

            var phone;
            var name;
            var lastname;

            firebase.database().ref(refPath).once('value').then(function (snapshot) {

                phone = snapshot.child('phone').val();
                name = snapshot.child('name').val();
                lastname = snapshot.child('lastName').val();


                document.getElementById("email-placeholder-container").parentNode.removeChild(document.getElementById("email-placeholder-container"));
                document.getElementById("phone-placeholder-container").parentNode.removeChild(document.getElementById("phone-placeholder-container"));

                document.getElementById("nameAndLastname").value = name + ' ' + lastname;
                document.getElementById("staticEmail").value = userEmail;
                document.getElementById("staticPhone").value = phone;


            });

            document.getElementById("email-placeholder").innerHTML = "100%";
            document.getElementById("email-placeholder").style.width = "100%";

            document.getElementById("phone-placeholder").innerHTML = "100%";
            document.getElementById("phone-placeholder").style.width = "100%";


        }
    });
}

function changePhone() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //User has signed in.
            userId = user.uid;
            var myWindow = window.open("/phone", "myWindow", "width=800,height=450"); // Opens a new window
            var phone;
            window.phone = function (value) {
                phone = value;
                myWindow.location.href = 'phoneVerify';
            }
            window.verify = function (value) {
                if (value) {
                    myWindow.close();
                    firebase.database().ref('users/' + userId).update({
                        phone: phone
                    });
                    window.location.reload();
                } else {
                    myWindow.close();
                    $("#phone-error").text("Phone verification failed.");
                }
            }
        }
    });
}

function resetPassword() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //User has signed in.
            var userId = user.uid;
            var userEmail = user.email;
            firebase.auth().sendPasswordResetEmail(userEmail).then(function () {
                    window.alert("A reset email has been sent to " + userEmail + " address!");
                })
                .catch(function (error) {
                    console.log("An error has occurred " + error);
                })
        }
    });
}


function applicantDeleteAccount() {
    console.log("Delete account :");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            firebase.database().ref('users/' + userId + '/applications').once('value').then(function (snapshot) {
                if (snapshot.val() == null) {
                    console.log("inside if");
                    firebase.auth().currentUser.delete().then(function () {
                        firebase.database().ref("users/" + userId).remove();
                        alert('Your account has been successfully deleted!');
                        signOut();
                        window.location.href = "login";
                    });
                } else {
                    console.log("inside else");
                    snapshot.forEach(function (applicationId) {
                        var department = applicationId.child("department").val();
                        var term = applicationId.child("term").val();
                        firebase.database().ref("applications/" + term + "/" + department + "/" + applicationId).once('value').then(function (snapshot) {

                            if (snapshot.child("gradschoolControl/isVerified").val() === false) {
                                firebase.auth().currentUser.delete().then(function () {
                                    firebase.database().ref("users/" + userId).remove();
                                    alert('Your account has been successfully deleted!');
                                    signOut();
                                    window.location.href = "login";
                                });
                            }

                        }).catch(function (error) {});
                    });
                }
            }).catch(function (error) {});
        }
    });
}


function deleteAccount() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            firebase.auth().currentUser.delete().then(function () {
                firebase.database().ref("users/" + user.uid).remove();
                alert('Your account has been successfully deleted!');
                window.location.href = "login";
            });
        }
    });

}