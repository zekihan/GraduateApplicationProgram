function getApplicationData(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
    } else {
      // No user is signed in.
      console.log("Authentication failed!");
    }
  });
  
  
}