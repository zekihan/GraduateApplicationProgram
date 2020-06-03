function getDepartmentsApplicants() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            //Get firebase database instance
            var userId = firebase.auth().currentUser.uid;

            //Get the department id from the url
            var departmentId = parseDepartmentId();

            var applicants = new Array();

            firebase.database().ref("applications").orderByKey().limitToLast(1).once('value').then(function (term) {
                console.log("Number of children nodes: " + term.numChildren());
                console.log(term.toJSON());
                term.forEach(function (realTerm) {
                    realTerm.child(departmentId).forEach(function (application) {
                        console.log("Application date: " + application.child("date").val());
                        console.log("Term information: " + realTerm.key);
                        var termInfo = realTerm.key;
                        console.log("is accepted: " + application.child("departmentControl/isAccepted").val());
                        //Change this afterwards
                        if (/*application.child("departmentControl/isAccepted").val()*/true) {
                            applicants.push({
                                program: application.child("content").child("program").val(),
                                term: termInfo,
                                department: application.child("content").child("department").val(),
                                applicationId: application.key,
                                name: application.child("content").child("name").val(),
                                lastname: application.child("content").child("lastName").val(),
                                date: application.child("date").val()
                            });
                        }
                    });
                    displayApplicants(applicants);
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
}


function parseDepartmentId() {
    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("=");
    return queries[1];
}



function displayApplicants(applicants) {
    console.log("display mehod");
    applicants.forEach(function (applicant) {
        console.log("inside for loop");
        var div = document.createElement('DIV');
        //Application data row.
        div.classList.add("text-muted");
        div.classList.add("pt-3");
        div.classList.add("border-bottom");
        div.classList.add("border-gray");
        div.classList.add("media");
        div.style.cursor = "pointer";

        //IZTECH logo for each application.
        var img = document.createElement("IMG");
        img.src = "../../images/iyte-logo.jpg";
        img.style.width = "32px";
        img.style.height = "32px";
        img.style.marginBottom = "1rem";
        img.style.background = "#007bff";
        img.style.color = "#007bff";
        img.classList.add("mr-2");
        img.classList.add("rounded");

        div.appendChild(img);

        //Applicant info container
        var p = document.createElement("P");
        p.classList.add("media-body");
        p.classList.add("pb-3");
        p.classList.add("mb-0");
        p.classList.add("small");
        p.classList.add("lh-125");


        //Applicant's name and lastname
        var strong = document.createElement("STRONG");
        strong.classList.add("d-block");
        strong.classList.add("text-gray-dark");
        strong.innerHTML = applicant.name + ' ' + applicant.lastname;
        p.appendChild(strong);


        //Application date and department,program information
        var departmentStr = intToDepartmentStr(applicant.department);
        var psInfo = document.createTextNode('Created at: ' + timeConverter(applicant.date) +
            ' For ' + departmentStr + '  ' +
            prettyFormat(applicant.program));
        p.appendChild(psInfo);

        div.appendChild(p);

        //If the application has not been checked by the grad-school yet
        if (applicant.isVerified == null) {
            var a = document.createElement("A");
            a.classList.add("details-link");
            a.onclick = function () {
                getApplicationInfoWithId(applicant.applicationId, applicant.term, applicant.department);
            }
            a.style.color = "#c81912";
            a.innerHTML = "View Details";
            div.onclick = function () {
                getApplicationInfoWithId(applicant.applicationId, applicant.term, applicant.department);
            }
            div.appendChild(a);

            //If the application has been checked by the grad-school
        } else {
            var verification = document.createElement("P");
            console.log("isVerified: " + applicant.isVerified);
            var isVerified = applicant.isVerified;

            //Application is verified by the grad-school
            if (isVerified == true) {
                verification.innerHTML = "Accepted";
                var icon = document.createElement("I");
                icon.classList.add("fas");
                icon.classList.add("fa-check");
                icon.style.marginLeft = "0.3rem";
                verification.appendChild(icon);

                //Application is rejected by the grad-school
            } else {
                verification.innerHTML = "Denied";
                var icon = document.createElement("I");
                icon.classList.add("fas");
                icon.classList.add("fa-times");
                icon.style.marginLeft = "0.3rem";
                verification.appendChild(icon);
            }

            //Checked application divs will not be clickable
            verification.style.fontSize = "0.8rem";
            verification.style.marginTop = "0.4rem";
            div.style.cursor = "default";
            div.appendChild(verification);
        }

        document.getElementById("applicant-container").appendChild(div);
    });
}


function getApplicationInfoWithId(applicationId, term, department) {
    console.log("application id is " + applicationId);
    var id = applicationId;
    var queryString = "?id=" + id + '&term=' + term + '&department=' + department;
    window.location.href = "applicant-details.html" + queryString;
}



/* Convert timestamp to a more human-readable format.*/
function timeConverter(timestamp) {
    var a = new Date(timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}




function prettyFormat(output) {
    switch (output) {
        case "mastersDegree":   
        case "masters":
            return "M.Sc";
        case "phd":
            return "PhD";
        default:
            break;
    }
}


/* Convert department id to corresponding department name. */
function intToDepartmentStr(departmentIdentifier) {
    firebase.database().ref("departments").once('value').then(function(department){
        return (department.child(departmentIdentifier).child("name").val());
    }).catch(function(error){
        console.log(error);
    });
}


function confirmAndAnnounce() {

    if (confirm("You are about to confirm and announce the results.\nProceed?")) {
        //Confirm and Announce
    } else {

    }
}