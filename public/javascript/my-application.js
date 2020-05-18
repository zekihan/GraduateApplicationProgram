function getApplicationData() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //Get firebase database instance
      var userId = firebase.auth().currentUser.uid;
      var userEmail = user.email;
      var applicationDataPath = "";
      var applicationProperties = new Map();
      firebase.database().ref('users/' + userId + '/applications').once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          //Get the application id (Check this later)
          var applicationId = childSnapshot.val();

          //application path is something like 'applications/2020-1/ceng/uTMJFggaAcSi5xYQ4o6kpkvifh4
          //Add the term first
          applicationDataPath = applicationDataPath + childSnapshot.child('term').val() + '/';

          //Then add the department 
          applicationDataPath = applicationDataPath + childSnapshot.child('department').val();

          //Get the interview data.
          firebase.database.ref('applications/' + applicationDataPath + applicationId).once('value').then(function (snapshot) {
            var date = snapshot.child('departmentControl/interviewInfo/date').val();
            var place = snapshot.child('departmentControl/interviewInfo/place').val();
            var time = snapshot.child('departmentControl/interviewInfo/time').val();
            var isAccepted = snapshot.child('departmentControl/isAccepted').val();

            applicationProperties.set('date', date);
            applicationProperties.set('place', place);
            applicationProperties.set('time', time);
            applicationProperties.set('isAccepted', isAccepted);

            //Get the application's acceptance data
            var isVerified = snapshot.child('gradschoolControl/isVerified').val();
            var result = snapshot.child('gradschoolControl/result').val();

            applicationProperties.set('isVerified', isVerified);
            applicationProperties.set('result', result);

            //Display each application's data on the my-application.html page
            addDataToApplicationTable(applicationProperties, userEmail);
          });
        });
      });
    } else {
      // No user is signed in.
      console.log("Authentication failed!");
    }
  });

}

//applicationData is a map that contains date, place, time, isAccepted, isVerified and result data.
function addDataToApplicationTable(applicationData, userEmail) {
  var date = applicationData.get('date');
  var place = applicationData.get('place');
  var time = applicationData.get('time');
  var isAccepted = applicationData.get('isAccepted');
  var isVerified = applicationData.get('isVerified');
  var result = applicationData.get('result');

  var currentStatus = 'Application not verified';

  if (isVerified == 'true') {
    if (isAccepted == 'true') {
      if (result == 'true') {
        currentStatus = 'Your application has been accepted';
      } else {
        currentStatus = 'Waiting for announcements';
      }
    } else {
      currentStatus = 'Waiting for department response';
    }
  }else{
    currentStatus = 'Application has been rejected';
  }

  var applicationTableData = '<tr>' + 
                                '<td>' + userEmail + '</td>' +
                                '<td>' + currentStatus + '</td>' + 
                                '<td>'+ 'someDate' + '</td>'
                            '</tr>';


  var interviewTableData = '<tr>' + 
                              '<td>'+ place +'</td>' +            
                              '<td>'+ date + '</td>' +
                              '<td>'+ time + '</td>' +  
                            '</tr>';

  document.querySelector('#applicationEntries').appendChild(applicationTableData);
  document.querySelector('#interviewEntries').appendChild(interviewTableData);
}