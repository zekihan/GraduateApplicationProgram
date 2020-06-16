function sendEmail(){
    
    var email = document.getElementById('inputEmail').value;

    

    firebase.auth().sendPasswordResetEmail(email)
    .then(function () {
        alert("A reset email has been sent to " + email + " address!");
    })
    .catch(function (error) {
        alert("No such account with given email address!");
        console.log("An error has occurred " + error);
    });

}