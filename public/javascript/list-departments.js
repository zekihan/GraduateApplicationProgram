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
        var iztechLogo = document.createElement("IMG");
        iztechLogo.src = "../../images/iyte-logo.jpg";
        iztechLogo.style.width = "32px";
        iztechLogo.style.height = "32px";
        iztechLogo.style.background = "#007bff";
        iztechLogo.style.color = "#007bff";
        iztechLogo.classList.add("mr-2");
        iztechLogo.classList.add("rounded");
        departmentRow.appendChild(iztechLogo);

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
        var programText = "Programs :";

        //Get programs(degrees)
        if(department.programs[0] != null){
            programText += " " + department.programs[0].degree;
            if(department.programs[1] != null){
                programText += " & " + department.programs[1].degree;
            }
        }

        programName.innerHTML = programText;
        departmentAndProgramText.appendChild(programName);

        departmentRow.appendChild(departmentAndProgramText);

        //If applicants of that department is already confirmed
        if (department.isConfirmed) {
            //Confirmed Icon
            var confirmedIcon = document.createElement("I");
            confirmedIcon.classList.add("fas");
            confirmedIcon.classList.add("fa-check-circle");
            confirmedIcon.style.marginTop = "1rem";

            //Confirmed Text
            var confirmedText = document.createElement("P");
            confirmedText.classList.add("mb-0");
            confirmedText.classList.add("small");
            confirmedText.style.marginTop = "0.8rem";
            confirmedText.style.marginLeft = "0.4rem";
            confirmedText.innerHTML = "Confirmed";

            //Put them in the department information row
            departmentRow.appendChild(confirmedIcon);
            departmentRow.appendChild(confirmedText);

        //If applicants of that department are still waiting to be confirmed
        } else {
            var departmentLink = document.createElement("A");
            departmentLink.classList.add("details-link");
            departmentLink.innerHTML = "View Applicants";
            departmentLink.style.color = "#c81912";
            var url = "?department=" + department.departmentId;
            departmentLink.href = "list-accepted-applicants.html" + url;
            departmentRow.onclick = function () {
                getDepartment(department.departmentId);
            }
            departmentRow.appendChild(departmentLink);
        }
        departmentRow.style.marginTop = "1rem";
        document.getElementById("department-container").appendChild(departmentRow);
    });


}


function getDepartment(departmentId) {
    var queryString = "?department=" + departmentId;
    window.location.href = "list-accepted-applicants.html" + queryString;
}