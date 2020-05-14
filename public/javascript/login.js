function getRegisterPage() {
    location.href = "register.html";
}
function signIn(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var password_again = document.getElementById('password-again').value;
    if(checkPass(password,password_again)){
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
    }
    getLoginPage()
}