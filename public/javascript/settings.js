
function getUserInformation() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            //User id
            var userId = user.uid;

            //User's email
            var userEmail = user.email;

            //reference path : 'users/userId'
            var refPath = 'users/' + userId;

            var phone;
            var name;
            var lastname;

            firebase.database().ref(refPath).once('value').then(function (snapshot) {
                phone = snapshot.child('phone').val();
                name = snapshot.child('name').val();
                lastname = snapshot.child('lastName').val();
                document.getElementById("nameAndLastname").value = name + ' ' + lastname;
                document.getElementById("staticEmail").value = userEmail;
                document.getElementById("staticPhone").value = phone;
            });


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

                } else {
                    myWindow.close();
                    $("#phone-error").text("Phone verification failed.");
                }
            }
        }
    });
}

function resetPassword(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //User has signed in.
            var userId = user.uid;
            var userEmail = user.email;
            firebase.auth().sendPasswordResetEmail(userEmail).then(function(){
                window.alert("A reset email has been sent to " + userEmail + " address!");
            })
            .catch(function(error){
                console.log("An error has occurred " + error);
            })
        }
    });
}