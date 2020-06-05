firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var userId = user.uid;

        var refPath = 'users/' + userId;
        console.log(refPath);

        getCurrentPageRole();

        firebase.database().ref(refPath).once('value').then(function (snapshot) {
            role = snapshot.child('role').val();
            console.log(role);
            pageRole = getCurrentPageRole();
            console.log(pageRole);

            if(role !== pageRole){
                signOut();
            }
        });

    } else {
        window.location.href = '/login';
    }
});

function getCurrentPageRole(){
    var url = window.location.href;
    var i = url.indexOf("/users") + 7;
    url = url.slice(i, url.length)
    i = url.indexOf("/")
    var roleStr = url.slice(0, i);

    console.log(roleStr);

    var role;
    switch(roleStr) {
        case "applicant":
            role = 0;
            break;
        case "department":
            role = 1;
            break;
        case "grad-school":
            role = 2;
            break;
        default:
            console.log("invalid role from url detected");
            role = 0
            break;
      }
      return role;
}

