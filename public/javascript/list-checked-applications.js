function getFirstPage() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //Get firebase database instance
            var userId = firebase.auth().currentUser.uid;
            var applicants = new Array();
            var numOfApplicantsToGet = 20;

            //Get the last term's applicants' data
            firebase.database().ref('applications').orderByKey().limitToLast(1).once('value').then(function (snapshot) {
                console.log(snapshot.val());
                firebase.database().ref("applications").orderByKey().limitToLast(1).once('value').then(function (snapshot) {
                    console.log(snapshot.val());
                    snapshot.forEach(function (childSnapshot) {
                        childSnapshot.forEach(function(grandchildSnapshot){
                            var value = grandchildSnapshot.key;
                            console.log("value: " + value);
                            grandchildSnapshot.forEach(function(verygrandchildSnapshot){
                            
                               var address1 = verygrandchildSnapshot.child("address1").val();
                                console.log("address1: " + address1);
                            });
                        })
                    });
                });
            });
        } else {
            location.href = "login";
        }
    });
}