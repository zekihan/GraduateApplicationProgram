function getDepartmentPrograms() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {


            var departmentId = parseDepartmentId();

            firebase.database().ref("departments/" + departmentId).once('value').then(function (snapshot) {
                var department = snapshot.child("name").val();
                displayTitle(department);

            }).catch(function (error) {
                console.log(error);
            });


            var programArray = new Array();
            var userId = firebase.auth().currentUser.uid;
            var userRef = firebase.database().ref("users/" + userId);
            userRef.once("value").then(function (user) {
                var phDRef = firebase.database().ref('departments/' + departmentId + '/program/phd');
                var masterRef = firebase.database().ref('departments/' + departmentId + '/program/masters');
                masterRef.once("value").then(function (masterPrograms) {
                    masterPrograms.forEach(function (program) {
                        console.log("name masters: " + program.child("name").val().toString());
                        programArray.push({
                            type: "MASTER",
                            id: program.key,
                            name: program.child("name").val(),
                            isTaking: program.child("isTaking").val(),
                            explanation: program.child("explanation").val()
                        });
                    });
                    phDRef.once("value").then(function (phdPrograms) {
                        phdPrograms.forEach(function (program) {
                            console.log("name phd: " + program.child("name").val().toString());
                            programArray.push({
                                type: "PHD",
                                id: program.key,
                                name: program.child("name").val(),
                                isTaking: program.child("isTaking").val(),
                                explanation: program.child("explanation").val()
                            });
                        });
                        displayPrograms(programArray);
                    });
                });
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

function displayTitle(department) {
    document.getElementById("department-title").innerHTML = department + " Department Available Programs";
}



function displayPrograms(programs) {
    console.log(programs.toString());
    var ol = document.createElement("OL");
    ol.id = "sortable";
    ol.style.listStyleType = "none";

    //Common term and department information
    // var term = applicants[0].term;
    //var department = applicants[0].department;

    programs.forEach(function (program) {

        //Container list item element
        var li = document.createElement("LI");
        li.classList.add("ui-state-default");
        li.id = program.id; // birden fazla id sıkıntı yaratır mı?

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


        /* Program's name and type. */
        var innerMostDiv = document.createElement("DIV");
        innerMostDiv.classList.add("d-flex");
        innerMostDiv.classList.add("justify-content-between");
        innerMostDiv.classList.add("align-items-center");
        innerMostDiv.classList.add("w-100");

        var strong = document.createElement("STRONG");
        strong.classList.add("text-gray-dark");
        strong.innerHTML = program.type + " - " + program.name;
        innerMostDiv.appendChild(strong);

        innerDiv.appendChild(innerMostDiv);


        var span = document.createElement("SPAN");
        span.classList.add("d-block");
        if (program.explanation)
            span.innerHTML = program.explanation;
        else {
            span.innerHTML = "No explanation provided."
        }
        innerDiv.appendChild(span);

        outerDiv.appendChild(innerDiv);

        li.appendChild(outerDiv);



        /* Acceptance checkbox 
        var containerLabel = document.createElement("LABEL");
        var checkbox = document.createElement("INPUT");
        checkbox.id = "indeterminate-checkbox";
        checkbox.type = "checkbox";
        checkbox.style = "margin-right: 4px;"
        containerLabel.appendChild(checkbox);
        */

        /*
       var containerLabel = document.createElement("LABEL");
       var innerSpan = document.createElement("SPAN");
       innerSpan.classList.add("checkbox-label");
       innerSpan.style.color="#c81912";
       innerSpan.style.fontSize="13px";
       innerSpan.innerHTML = "Remove Program";
       containerLabel.appendChild(innerSpan);
        */
        var containerLabel = document.createElement("LABEL");

        outerDiv.appendChild(containerLabel);

        ol.appendChild(li);
    });

    document.getElementById("list-container").removeChild(document.getElementById("spinner"));
    document.getElementById("list-container").appendChild(ol);
}