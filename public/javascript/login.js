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
    getLoginPage();
}
function signInWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider).then(function (result) {
      var token = result.credential.accessToken;
      var user = result.user;
      console.log(user);

    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(errorCode,errorMessage);
    });
  }
