function getRegisterPage() {
    location.href = "register.html";
}

function signInWithEmail() {
    showSpinner();
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
    hideSpinner();
}
