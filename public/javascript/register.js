function getLoginPage() {
    location.href = "login.html";
}


function isPasswordValid(password){
    return (password.length >= 6);
}

function signUp() {
    $('.error-msg').text("");
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var password_again = document.getElementById('password-again').value;
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    if (firstName === "") {
        $("#firstName-error").text("This field cannot be empty.");
        return false;
    }

    if(!isPasswordValid(password)){
        $("#password-error").text("Password must be at least 6 characters long.");
        return false;
    }

    if (lastName === "") {
        $("#lastName-error").text("This field cannot be empty.");
        return false;
    }
    if (email === "") {
        $("#email-error").text("This field cannot be empty.");
        return false;
    }
    if (password === "") {
        $("#password-error").text("This field cannot be empty.");
        return false;
    }
    if (password_again === "") {
        $("#password-again-error").text("This field cannot be empty.");
        return false;
    }
    if (password != password_again) {
        $("#password-again-error").text("Passwords do not match.");
        return false;
    }

    var url = "/checkUserExists"
    var body = {
        email: email
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            switch (xhr.response) {
                case "true": //Account is already there
                    $("#email-error").text("This email is already in use.");
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
                            createAccount(email, password, firstName, lastName, phone);
                        } else {
                            myWindow.close();
                            $("#phone-error").text("Phone verification failed.");
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

function createAccount(email, password, firstName, lastName, phone) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log('Signup successful.');
            var currentUser = firebase.auth().currentUser;
            currentUser.updateProfile({
                displayName: firstName + " " + lastName,
                phoneNumber: phone,
                photoURL: "#",
            });
            populateUser(currentUser.uid, firstName, lastName, phone);
        })
        .catch((error) => {
            console.log(error.code);
            console.log(error.message);
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
            
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
}
