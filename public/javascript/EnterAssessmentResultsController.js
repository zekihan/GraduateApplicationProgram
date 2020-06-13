function getApplicants() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            
            //Get the user id
            var userId = firebase.auth().currentUser.uid;

            //Applicants array for display purposes
            var applicants = new Array();

            //Get the department user's department id.
            firebase.database().ref("users/" + userId).once("value").then(function (user) {
                var departmentId = user.child("department").val().toString();

                
                firebase.database().ref('departments/' + departmentId).once('value').then(function (department) {

                    //If applicants have already been accepted/rejected by the department user.
                    if (department.child('acceptanceDone').val() === true) {
                        displayUsabilityText();
                        return;
                    }

                    //If applicants have not been accepted/rejected yet.
                    firebase.database().ref("applications").orderByKey().limitToLast(1).once("value").then(function (term) {
                        term.forEach(function (realTerm) {

                            /* Get each application of the department. */
                            realTerm.child(departmentId).forEach(function (application) {

                                //Get only the applicants that have been verified by the grad school and interviewed by the department.
                                if (application.child("gradschoolControl/isVerified").val() &&
                                    /*application.child("departmentControl/interviewInfo").val() !== null*/
                                    true) {
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

            });
        }
    });
}


/* If the user tries to use enter-assessment which has already been done for the particular term, display warning text to the screen. */
function displayUsabilityText() {
    var text = document.createElement("P");
    text.style.marginTop = "1rem";
    text.innerHTML = "Applicants have already been interviewed and accepted.";
    document.getElementById("list-container").appendChild(text);
    document.getElementById("list-container").removeChild(document.getElementById("spinner"));
    document.getElementById("page-content-wrapper").removeChild(document.getElementById("submit-button"));
}

/* Display all applicants (Put each applicant into HTML) */
function displayApplicants(applicants) {

    var ol = document.createElement("OL");
    ol.id = "sortable";
    ol.style.listStyleType = "none";

    //Common term and department information
    var term = applicants[0].term;
    var department = applicants[0].department;

    applicants.forEach(function (applicant) {

        //Container list item element
        var li = document.createElement("LI");
        li.classList.add("ui-state-default");
        li.id = applicant.applicationId;


        //Application data row.
        var outerDiv = document.createElement('DIV');
        outerDiv.classList.add("text-muted");
        outerDiv.classList.add("pt-3");
        outerDiv.classList.add("border-bottom");
        outerDiv.classList.add("border-gray");
        outerDiv.classList.add("media");
        outerDiv.classList.add("applicant-info");
        outerDiv.style.cursor = "pointer";

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

        outerDiv.appendChild(img);


        var innerDiv = document.createElement("DIV");
        innerDiv.classList.add("media-body");
        innerDiv.classList.add("pb-3");
        innerDiv.classList.add("mb-0");
        innerDiv.classList.add("small");
        innerDiv.classList.add("lh-125");


        /* Applicant's name and lastname. */
        var innerMostDiv = document.createElement("DIV");
        innerMostDiv.classList.add("d-flex");
        innerMostDiv.classList.add("justify-content-between");
        innerMostDiv.classList.add("align-items-center");
        innerMostDiv.classList.add("w-100");

        var strong = document.createElement("STRONG");
        strong.classList.add("text-gray-dark");
        strong.innerHTML = applicant.name + ' ' + applicant.lastname;
        innerMostDiv.appendChild(strong);

        innerDiv.appendChild(innerMostDiv);

        /* Program & date information */
        var span = document.createElement("SPAN");
        span.classList.add("d-block");
        span.innerHTML = 'Created at ' + timeConverter(applicant.date) + ' For ' + prettyFormat(applicant.program);
        innerDiv.appendChild(span);

        outerDiv.appendChild(innerDiv);

        li.appendChild(outerDiv);

        /* Acceptance checkbox */
        var containerLabel = document.createElement("LABEL");
        var checkbox = document.createElement("INPUT");
        checkbox.id = "indeterminate-checkbox";
        checkbox.type = "checkbox";
        checkbox.style = "margin-right: 4px;"
        containerLabel.appendChild(checkbox);

        /* Accept text */
        var innerSpan = document.createElement("SPAN");
        innerSpan.classList.add("checkbox-label");
        innerSpan.innerHTML = "Accept";
        containerLabel.appendChild(innerSpan);

        outerDiv.appendChild(containerLabel);


        ol.appendChild(li);
    });

    document.getElementById("list-container").removeChild(document.getElementById("spinner"));
    document.getElementById("list-container").appendChild(ol);
    document.getElementById("submit-button").onclick = function () { submit(term, department); }
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

/* Degree data to a prettier format */
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

/* Whenever the submit button is clicked */
function submit(term, department) {

    /* Get all applicants */
    var orderedList = document.querySelector("ol").childNodes;
    var listItemsAsArray = Array.from(orderedList);

    /* For each applicant, check whether he/she will be accepted or not. */
    listItemsAsArray.forEach(function (listItem) {
        var checked = listItem.firstChild.lastChild.firstChild.checked;
        /* The applicant is accepted. */
        if (checked) {
            firebase.database().ref('applications/' + term + '/' + department + '/' + listItem.id + '/departmentControl').update({
                isAccepted: true
            });

        /* The applicant is rejected. */
        } else {
            firebase.database().ref('applications/' + term + '/' + department + '/' + listItem.id + '/departmentControl').update({
                isAccepted: false
            });
        }
    });

    firebase.database().ref('departments/' + department).update({
        acceptanceDone: true
    });

    window.location.href = "department-dashboard";
}
