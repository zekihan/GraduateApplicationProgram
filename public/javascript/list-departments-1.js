




function getDepartments() {
    firebase.database().ref('departments').once('value').then(function (departments) {
        var allDepartments = new Array();
        var departmentsPrograms = new Array();
        departments.forEach(function (department) {
            var departmentsPrograms = new Array();
            department.child("program").forEach(function (program) {
                var degree = program.key;
                program.forEach(function (programId) {
                    //If the program is accepting students
                    if (programId.child("isTaking").val() === 1) {
                        departmentsPrograms.push({
                            degree: prettyFormat(program.key),
                            id: programId.key,
                            name: programId.child("name").val()
                        });
                    }
                });
            });
            allDepartments.push({
                departmentName: department.child("name").val(),
                isConfirmed: department.child("confirmed").val(),
                departmentId: department.key,
                programs: departmentsPrograms
            });
        });
        displayDepartments(allDepartments);
    });
}


function containsDegree(departmentPrograms,degreeType) {
        result=false;
        departmentPrograms.forEach(function (program) {
                    if (program.degree == degreeType) {
                        result=true;
                        return;
                    }
        });
        return result;

}



function prettyFormat(output) {
    switch (output) {
        case "masters":
            return "M.Sc";
        case "phd":
            return "PhD";
        default:
            break;
    }
}


function displayDepartments(departments) {
    departments.forEach(function (department) {
        //Department Name for the header
        var deptHeader = document.createElement("LABEL");
        deptHeader.innerHTML = department.departmentName;

        //Create the outermost container
        var departmentRow = document.createElement("DIV");
        departmentRow.classList.add("media");
        departmentRow.classList.add("text-muted");
        departmentRow.classList.add("pt-3");
        departmentRow.classList.add("border-bottom");
        departmentRow.classList.add("border-gray");
        departmentRow.style.cursor = "pointer";

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
        departmentRow.appendChild(img);

        //Container for department name and programs below it
        var departmentAndProgramText = document.createElement("P");
        departmentAndProgramText.classList.add("media-body");
        departmentAndProgramText.classList.add("pb-3");
        departmentAndProgramText.classList.add("mb-0");
        departmentAndProgramText.classList.add("small");
        departmentAndProgramText.classList.add("lh-125");

        var departmentName = document.createElement("STRONG");
        departmentName.classList.add("d-block");
        departmentName.classList.add("text-gray-dark");
        departmentName.innerHTML = department.departmentName;
        departmentAndProgramText.appendChild(departmentName);

        var programName = document.createElement("P");
        var programText = "Programs : ";

      
        var numberDegree=0;
        var departmentPrograms=department.programs;
        if (containsDegree(departmentPrograms,"M.Sc")) {
            programText += "M.Sc";
            numberDegree++;
        }  if (containsDegree(departmentPrograms,"PhD")) {
            if (numberDegree == 1) { // if M.Sc is added
                programText +=" & ";
            }
            programText += "PhD";
            numberDegree++;
        }
        
        

        programName.innerHTML = programText;
        departmentAndProgramText.appendChild(programName);

        departmentRow.appendChild(departmentAndProgramText);

        
        var departmentLink = document.createElement("A");
        departmentLink.classList.add("details-link");
        departmentLink.innerHTML = "View Programs";
        departmentLink.style.color = "#c81912";
        var url = "?department=" + department.departmentId;
        departmentLink.href = "department-programs.html" + url;
        departmentRow.onclick = function () {
            getDepartment(department.departmentId);
        }
        departmentRow.appendChild(departmentLink);
        
        departmentRow.style.marginTop = "1rem";
        document.getElementById("department-container").appendChild(departmentRow);
    });

    var element = document.getElementById("spinner");
        element.parentNode.removeChild(element);
}


function getDepartment(departmentId) {
    var queryString = "?department=" + departmentId;
    window.location.href = "department-programs.html" + queryString;
}