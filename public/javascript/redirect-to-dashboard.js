
window.onload = function WindowLoad(event) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          window.location.href = '/users/applicant/applicant-dashboard';
        } else {
          // window.location.href = '/login';
        }
      });
}

