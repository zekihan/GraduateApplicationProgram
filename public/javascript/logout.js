FB.init({
    appId: '271875460605718',
    status: true,
    xfbml: true,
    version: 'v2.6'
});
gapi.load('auth2', function () {
    gapi.auth2.init();
});

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    FB.logout(function (response) {
        // Person is now logged out
    });
    firebase.auth().signOut().then(function () {
        window.location.href = "/login"
    }).catch(function (error) {
        console.log(error)
    });
}