


function createProgram(newProgram,nameIn,explanationIn) {
    newProgram.set ({
        isTaking: 1,
        name : nameIn,
        explanation : explanationIn
    });
}




function setProgram(){
    
    //console.log('setProgram içinde');
    /*
    //Decode the URL and get the parameters
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    //Get the application id from the url
    var applicationId = (queries[0].split("="))[1];
    var termInfo = (queries[1].split("="))[1];
    var department = (queries[2].split("="))[1];
    */

   var e = document.getElementById("type-field");
   var typeIn = e.options[e.selectedIndex].text;
   var nameIn = $('#name-field').val();
   var explanationIn = $('#explanation-field').val();


    if (!areInputsValid(e,typeIn,nameIn,explanationIn)) {
        return;
    }

    var userId = firebase.auth().currentUser.uid;
    var userRef =firebase.database().ref("users/" + userId);
    
    userRef.once("value").then(function (user) {
        var departmentId = user.child("department").val().toString();
        var rootRef = firebase.database().ref();
        var masterRef = rootRef.child('departments/' + departmentId + '/program/masters');
        var newMasterRef = masterRef.push();
        var phdRef = rootRef.child('departments/' + departmentId + '/program/phd');
        var newPhdRef = phdRef.push();
    
        if(typeIn == "Master") {          
            createProgram(newMasterRef,nameIn,explanationIn);
            
        }
        else if(typeIn == "Phd") {
            createProgram(newPhdRef,nameIn,explanationIn);
            
        }
        
        location.href = "manage-programs.html";  
    
    });

}



function areInputsValid(e,type,name,explanation) {
    $('.error-msg').text("");
    var isValid=true;
    console.log(type);
    if (name == "") {
        $("#name-error").text("Please enter a name.");
        isValid=false;
    } 
           
    if (explanation == "" ) {
        $("#explanation-error").text("Please enter a explanation.");
        isValid=false;
    }  
    
    if (type == "Choose...") {
        $("#type-error").text("Please choose a type.");
        isValid=false;
    } 
    return isValid;
   
}


/*
function getApplicationInfoWithId(applicationId, term, department) {
    console.log("application id is " + applicationId);
    var id = applicationId;
    var queryString = "?id=" + id + '&term=' + term + '&department=' + department;
    window.location.href = "student-review.html" + queryString;
}
*/