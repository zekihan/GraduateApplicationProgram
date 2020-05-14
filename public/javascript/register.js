function getLoginPage() {
    location.href = "login.html";
}

function signUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var password_again = document.getElementById('password-again').value;
    var firstName = document.getElementById('firstName').value 
    var lastName = document.getElementById('lastName').value;
    var url = "/echoMessage"

    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
            console.log(anHttpRequest.response)
            switch (anHttpRequest.response) {
                case "true": //Account is already there
                    break;
                case "false": //Go to phone verification
                    document.cookie = "firstName=" + firstName;
                    document.cookie = "lastName=" + lastName;
                    location.href = "phone.html";
                    break;
                default:
                    break;
            }
        }
    };
    anHttpRequest.open("GET", url, true);
    anHttpRequest.setRequestHeader("email", email);
    anHttpRequest.send();
}

function signUpComplete() {
    if (checkPass(password, password_again)) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Signup successful.');
                var currentUser = firebase.auth().currentUser;
                currentUser.updateProfile({
                    displayName: name,
                });
                getLoginPage()
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
    }
}

function checkPass(password, password_again) {
    return true;
}