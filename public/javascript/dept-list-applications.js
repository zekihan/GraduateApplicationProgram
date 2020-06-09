function getStudentReviewPage() {
    location.href = "student-review.html";
}


function getApplicants() {
    firebase.auth().onAuthStateChanged(async function (user) {
        //User is not signed in.
        if (user) {

            var userId = user.uid;
            console.log("id: " + userId);
            var applicants = new Array();


            //Get the corresponding department id of the user

            firebase.database().ref("users/" + userId).once("value").then(function (user) {
                var departmentId = user.child("department").val().toString();
                firebase.database().ref("applications").orderByKey().limitToLast(1).once("value").then(function (term) {
                    term.forEach(function (realTerm) {
                        realTerm.child(departmentId).forEach(function (application) {
                            //Get the applicants that have been verified by the grad school and interviewed by the department
                            if (application.child("gradschoolControl/isVerified").val()) {
                                applicants.push({
                                    applicationId: application.key,
                                    program: application.child("content").child("program").val(),
                                    term: realTerm.key,
                                    department: application.child("content").child("department").val(),
                                    applicationId: application.key,
                                    name: application.child("content").child("name").val(),
                                    lastname: application.child("content").child("lastName").val(),
                                    date: application.child("date").val()
                                });
                            }
                        });
                    });
                    displayApplicants(applicants);
                });
            });
            //User is not signed in.
        } else {

        }
    });
}


function displayApplicants(applicants) {
    var htmlString;
    applicants.forEach(function (applicant) {
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
        var psInfo = document.createTextNode('Created at: ' + timeConverter(applicant.date) +
            ' For ' + intToDepartmentStr(applicant.department) + '  ' +
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

    var element = document.getElementById("spinner");
    if (element != null) {
        element.parentNode.removeChild(element);
    }
}

/* Called whenever 'View Details' of an application is clicked on.
 * Directs user to the selected application's details page.
 * Transfers the required data for the details page via URL
 */
function getApplicationInfoWithId(applicationId, term, department) {
    console.log("application id is " + applicationId);
    var id = applicationId;
    var queryString = "?id=" + id + '&term=' + term + '&department=' + department;
    window.location.href = "application-details.html" + queryString;
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
    switch (departmentIdentifier) {
        case "1":
            return "Computer Engineering Department";
        case "2":
            return "Mechanical Engineering Department";
        default:
            return "NaN";
    }
}