




function getAddProgramPage() {
    location.href = "set-program.html";
    
}

function pushOperation(container,program,programType) {
    container.push({
        type: programType, //"MASTER", or "PHD"
        id:program.key,
        name: program.child("name").val(),
        isTaking: program.child("isTaking").val(),
        explanation:program.child("explanation").val()                          
      });
}


function getPrograms() {
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var programArray=new Array();
            var userId = firebase.auth().currentUser.uid;
            var userRef =firebase.database().ref("users/" + userId);
            userRef.once("value").then(function (user) {
                var departmentId = user.child("department").val().toString();
                console.log("deptId: " + departmentId);
                var phDRef =  firebase.database().ref('departments/' + departmentId + '/program/phd');
                var masterRef =  firebase.database().ref('departments/' + departmentId + '/program/masters');
                masterRef.once("value").then(function (masterPrograms) {
                      masterPrograms.forEach(function (program) {
                        pushOperation(programArray,program,"MASTER");                       
                });
                phDRef.once("value").then(function (phdPrograms) {
                    phdPrograms.forEach(function (program) {
                        pushOperation(programArray,program,"PHD"); 
              });
              displayPrograms(programArray,departmentId);
                });
            });
        });
    }
    });
}



function removeProgram(programId,deptId,programType) {
    var rootRef = firebase.database().ref();
    if (programType == "MASTER") {
        var masterRef=rootRef.child('departments/' + deptId + '/program/masters');
        masterRef.child(programId).remove();
    } else  if (programType == "PHD") {
        var masterRef=rootRef.child('departments/' + deptId + '/program/phd');
        masterRef.child(programId).remove();
    }

}



function displayPrograms(programs,deptId) {
    programs.forEach(function (program) {
        //Create the outermost container
        var programRow = document.createElement("DIV");
        programRow.classList.add("media");
        programRow.classList.add("text-muted");
        programRow.classList.add("pt-3");
        programRow.classList.add("border-bottom");
        programRow.classList.add("border-gray");
        programRow.style.cursor = "pointer";

        //Set up the logo img
        var img = document.createElement("IMG");
        img.src = "../../assets/iyte-logo.svg";
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.marginBottom = "1rem";
        img.style.background = "#ffffff";
        img.style.color = "#ffffff";
        img.classList.add("mr-2");
        img.classList.add("rounded");
        programRow.appendChild(img);

        //Container for program name and type
        var programTypeAndExplanation = document.createElement("P");
        programTypeAndExplanation.classList.add("media-body");
        programTypeAndExplanation.classList.add("pb-3");
        programTypeAndExplanation.classList.add("mb-0");
        programTypeAndExplanation.classList.add("small");
        programTypeAndExplanation.classList.add("lh-125");

        var programTitle = document.createElement("STRONG");
        programTitle.classList.add("d-block");
        programTitle.classList.add("text-gray-dark");
        programTitle.innerHTML = program.type + "-" + program.name;
        programTypeAndExplanation.appendChild(programTitle);

       
        var programExplanation = document.createElement("P");
        var programText =program.explanation;
      

        programExplanation.innerHTML = programText;
        programTypeAndExplanation.appendChild(programExplanation);
       
        programRow.appendChild(programTypeAndExplanation);

        
        var programLink = document.createElement("A");
        programLink.classList.add("details-link");
        programLink.innerHTML = "Remove Program";
        programLink.style.color = "#c81912"; 
        programLink.href = "manage-programs.html";    
        programLink.onclick = function () {
            if (confirm(program.name + " program will be deleted. Are you sure?")) {
                removeProgram(program.id,deptId,program.type);
              alert(program.name +" program is deleted!");
              
            }  else {
                alert(program.name + " program is not deleted!");
            }
        }
        programRow.appendChild(programLink);
        
        programRow.style.marginTop = "1rem";
        document.getElementById("list-container").appendChild(programRow);
    });

    var element = document.getElementById("spinner");
        element.parentNode.removeChild(element);
}










