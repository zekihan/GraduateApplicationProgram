function getRegisterPage() {
    location.href = "register.html";
}

function signInWithEmail() {
    // showSpinner();
    var email = document.getElementById('inputEmail').value;
    console.log('Email: ' + email);
    var password = document.getElementById('inputPassword').value;
    console.log('Password: ' + password);
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        console.log("No such account!");
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        location.href = "register.html";
    });
    console.log("Successful authentication");
    // hideSpinner();
}

function phoneVerify(credential, email, firstName, lastName) {
    var url = "/checkUserExists"
    var body = {
        email: email
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            switch (xhr.response) {
                case "true": //Account is already there
                    firebase.auth().signInWithCredential(credential).catch(function (error) {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorCode, errorMessage)
                        return false;
                    });
                    break;
                case "false": //Go to phone verification
                    var myWindow = window.open("phone", "myWindow", "width=800,height=450"); // Opens a new window
                    var phone;
                    window.phone = function (value) {
                        phone = value;
                        myWindow.location.href = 'phoneVerify';
                    }
                    window.verify = function (value) {
                        if (value) {
                            myWindow.close();
                            authWithCredentials(credential, firstName, lastName, phone);
                        } else {
                            myWindow.close();
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
}

function authWithCredentials(credential, firstName, lastName, phone) {
    firebase.auth().signInWithCredential(credential).then(() => {
        console.log('Signup successful.');
        var currentUser = firebase.auth().currentUser;
        populateUser(currentUser.uid, firstName, lastName, phone);
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
        return false;
    });
}

function populateUser(uid, firstName, lastName, phone) {

    var url = "/populateUser"
    var body = {
        uid,
        firstName,
        lastName,
        phone
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            window.location.href = "/users/applicant/applicant-dashboard"
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
}

function onSignIn(googleUser) {
    console.log('Google Auth Response', googleUser);
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        if (!isUserEqualGoogle(googleUser, firebaseUser)) {
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.getAuthResponse().id_token);
            var profile = googleUser.getBasicProfile();
            phoneVerify(credential, profile.getEmail(), profile.getGivenName(), profile.getFamilyName());
            console.log("Successful authentication");
        } else {
            console.log('User already signed-in Firebase.');
        }
    });
}

FB.init({
    appId: '271875460605718',
    status: true,
    xfbml: true,
    version: 'v2.6'
});

FB.Event.subscribe('auth.authResponseChange', checkLoginState);

function checkLoginState(event) {
    if (event.authResponse) {
        var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
            unsubscribe();
            if (!isUserEqualFacebook(event.authResponse, firebaseUser)) {
                var credential = firebase.auth.FacebookAuthProvider.credential(
                    event.authResponse.accessToken);
                FB.api('/me', {
                        locale: 'tr_TR',
                        fields: 'name, email'
                    },
                    function (response) {
                        phoneVerify(credential, response.email, response.name, "");
                    });
                console.log("Successful authentication");
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    } else {
        firebase.auth().signOut();
    }
}

function isUserEqualGoogle(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getEmail()) {
                return true;
            }
        }
    }
    return false;
}

function isUserEqualFacebook(facebookAuthResponse, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
                providerData[i].uid === facebookAuthResponse.userID) {
                return true;
            }
        }
    }
    return false;
}