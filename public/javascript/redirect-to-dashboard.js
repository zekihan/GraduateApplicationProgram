window.onload = function WindowLoad(event) {
    firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			const userId = user.uid;
			const refPath = 'users/' + userId;
			console.log(refPath);

            firebase.database().ref(refPath).once('value').then(function (snapshot) {
                const role = snapshot.child('role').val();
                console.log(role);
                redirect(role);
            });
        }
    });
}

function redirect(role){
	switch(role) {
        case 0:
			window.location.href = '/users/applicant/applicant-dashboard';
            break;
        case 1:
			window.location.href = '/users/department/department-dashboard';
            break;
        case 2:
            window.location.href = '/users/grad-school/grad-dashboard';
            break;
        default:
            console.log("invalid role");
            role = 0
            break;
      }
}
