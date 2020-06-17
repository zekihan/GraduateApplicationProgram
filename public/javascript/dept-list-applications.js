function getStudentReviewPage() {
    location.href = "student-review.html";
}

var userId;
var deptId;
var term;

firebase.auth().onAuthStateChanged(async function (user) {
    //User is not signed in.
    if (user) {

        userId = user.uid;
        console.log("id: " + userId);
        firebase.database().ref("users/" + userId).once("value").then(function (user) {
            deptId = user.child("department").val().toString();
            firebase.database().ref("applications").orderByKey().limitToLast(1).once("value").then(function (term) {
                term.forEach(function (realTerm) {
                    term = realTerm.key;
                    $('#pagination-container').pagination({
                        dataSource: `/dept-pagination?term=${term}&deptId=${deptId}`,
                        locator: 'pages',
                        totalNumberLocator: function (response) {
                            return response.pages.length * 20
                        },
                        pageSize: 20,
                        autoHidePrevious: true,
                        autoHideNext: true,
                        callback: function (data, pagination) {
                            getApplicants(data[pagination.pageNumber - 1], deptId, term);
                        }
                    })
                });
            });
        });
        //User is not signed in.
    } else {

    }
});

function getApplicants(data, deptId, term) {
    var applicants = new Array();
    if (data) {
        $("#applicant-container").html(`<h6 class="border-bottom border-gray pb-2 mb-0">Applications</h6>
        <div id="spinner" class="text-center">
            <div class="spinner-border mt-5" style="width: 2rem; height: 2rem;" role="status">
                <span class="sr-only">Loading applicant's data...</span>
            </div>
        </div>`);
        Object.entries(data).forEach(function (entry) {
            var application = Object.entries(entry[1])[0][1];
            applicants.push({
                isInterviewSet: application.departmentControl !== null,
                applicationId: Object.entries(entry[1])[0][0],
                program: application.content.program,
                term: term,
                department: deptId,
                name: application.content.name,
                lastname: application.content.lastName,
                date: application.date
            });
        });
        displayApplicants(applicants);
    } else {
        $("#applicant-container").html(`<h6 class="border-bottom border-gray pb-2 mb-0">Applications</h6>
        <div id="spinner" class="text-center">
            <div class="spinner-border mt-5" style="width: 2rem; height: 2rem;" role="status">
                <span class="sr-only">Loading applicant's data...</span>
            </div>
        </div>`);
        displayApplicants(applicants);
    }
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
        img.src = "../../assets/iyte-logo.svg";
        img.style.width = "40px";
        img.style.height = "40px";
        img.style.marginBottom = "1rem";
        img.style.background = "#ffffff";
        img.style.color = "#ffffff";
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
            ' For ' + prettyFormat(applicant.program));
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

            verification.innerHTML = "Interview is set";
            var icon = document.createElement("I");
            icon.classList.add("fas");
            icon.classList.add("fa-check");
            icon.style.marginLeft = "0.3rem";
            verification.appendChild(icon);

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
    window.location.href = "student-review" + queryString;
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