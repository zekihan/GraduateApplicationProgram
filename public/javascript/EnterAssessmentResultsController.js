function getApplicants() {

    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {

            //Get firebase database instance
            var userId = firebase.auth().currentUser.uid;

            var applicants = new Array();
            await firebase.database().ref("users/" + userId).once("value").then(function (user) {
                var departmentId = user.child("department").val().toString();
                firebase.database().ref("applications").orderByKey().limitToLast(1).once("value").then(function (term) {
                    term.forEach(function (realTerm) {
                        realTerm.child(departmentId).forEach(function (application) {
                            //Get the applicants that have been verified by the grad school and interviewed by the department
                            if (application.child("gradschoolControl/isVerified").val() &&
                                /*application.child("departmentControl/interviewInfo").val() !== null*/ true) {
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

        }
    });
}


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
        img.src = "../../images/iyte-logo.jpg";
        img.style.width = "32px";
        img.style.height = "32px";
        img.style.marginBottom = "1rem";
        img.style.background = "#007bff";
        img.style.color = "#007bff";
        img.classList.add("mr-2");
        img.classList.add("rounded");


        outerDiv.appendChild(img);


        var innerDiv = document.createElement("DIV");
        innerDiv.classList.add("media-body");
        innerDiv.classList.add("pb-3");
        innerDiv.classList.add("mb-0");
        innerDiv.classList.add("small");
        innerDiv.classList.add("lh-125");


        var innerMostDiv = document.createElement("DIV");
        innerMostDiv.classList.add("d-flex");
        innerMostDiv.classList.add("justify-content-between");
        innerMostDiv.classList.add("align-items-center");
        innerMostDiv.classList.add("w-100");



        var strong = document.createElement("STRONG");
        strong.classList.add("text-gray-dark");
        //strong.innerHTML = applicant.email
        strong.innerHTML = applicant.name + ' ' + applicant.lastname;
        innerMostDiv.appendChild(strong);

        innerDiv.appendChild(innerMostDiv);


        var span = document.createElement("SPAN");
        span.classList.add("d-block");
        span.innerHTML = 'Created at ' + timeConverter(applicant.date) + ' For ' + prettyFormat(applicant.program);
        innerDiv.appendChild(span);

        outerDiv.appendChild(innerDiv);

        li.appendChild(outerDiv);

        var containerLabel = document.createElement("LABEL");
        var checkbox = document.createElement("INPUT");
        checkbox.id = "indeterminate-checkbox";
        checkbox.type = "checkbox";
        checkbox.style = "margin-right: 4px;"
        containerLabel.appendChild(checkbox);

        var innerSpan = document.createElement("SPAN");
        innerSpan.classList.add("checkbox-label");
        innerSpan.innerHTML = "Accept";

        containerLabel.appendChild(innerSpan);

        outerDiv.appendChild(containerLabel);


        ol.appendChild(li);
    });

    document.getElementById("list-container").removeChild(document.getElementById("spinner"));
    document.getElementById("list-container").appendChild(ol);
    document.getElementById("submit-button").onclick = function(){ submit(term, department); }
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


function submit(term, department) {
    var orderedList = document.querySelector("ol").childNodes;
    var listItemsAsArray = Array.from(orderedList);
    listItemsAsArray.forEach(async function (listItem) {
        console.log(listItem.firstChild.lastChild.firstChild.checked);
        var checked = listItem.firstChild.lastChild.firstChild.checked;
        var update;

        //If applicant is checked, he/she will be accepted
        if(checked){           
            update = {
                isAccepted: true
            };

        //Applicant is rejected by the department
        }else{
            update = {
                isAccepted: false
            };
        }
        
        await firebase.database().ref('applications/' + term + '/' + department + '/' + listItem.id + '/departmentControl').update(update);
    });

    window.location.href = "department-dashboard";
}


/*
<li class="ui-state-default" value="1" draggable="true">
                            <div class="media text-muted pt-3 applicant-info border-bottom border-gray">
                                <img src="../../images/iyte-logo.jpg" width="32" height="32" background="#007bff"
                                    color="#007bff" class="mr-2 rounded">
                                <div class="media-body pb-3 mb-0 small lh-125">
                                    <div class="d-flex justify-content-between align-items-center w-100">
                                        <strong class="text-gray-dark">user@email.com</strong>
                                    </div>
                                    <span class="d-block">Name & Lastname</span>
                                </div>
                                <label>
                                    <input id="indeterminate-checkbox" type="checkbox" />
                                    <span class="checkbox-label">Accept</span>
                                </label>
                            </div>
                        </li>*/