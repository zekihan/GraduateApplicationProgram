firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userId = user.uid;
        const refPath = 'users/' + userId;

        getCurrentPageRole();

        firebase.database().ref(refPath).once('value').then(function (snapshot) {
            const role = snapshot.child('role').val();
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
    const roleStr = url.slice(0, i);

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

