function getFirstPage() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //Get firebase database instance
            var userId = firebase.auth().currentUser.uid;
            var applicants = new Array();
            var numOfApplicantsToGet = 20;
            //Get the last term's applicants' data
            firebase.database().ref("applications").orderByKey().limitToLast(1).once('value').then(function (snapshot) {
                console.log(snapshot.val());
                snapshot.forEach(function (departments) {
                    departments.forEach(function (applications) {
                        var value = applications.key;
                        console.log("value: " + value);
                        applications.forEach(function (application) {
                            applicants.push({name: application.child("content").child("name").val(), lastname: application.child("content").child("lastName").val()});
                            numOfApplicantsToGet--;
                        });
                    })
                });
                displayApplicants(applicants);
            });
        } else {
            location.href = "/login";
        }
    });
}


function displayApplicants(applicants){
    var htmlString;
    applicants.forEach(function(applicant){
        console.log("Name: " + applicant.name);
        console.log("Lastname: " + applicant.lastname);
        var div = document.createElement('DIV');
        htmlString = "<div class=\"media text-muted pt-3 border-bottom border-gray\" onclick=\"location.href='application-details.html';\" style=\"cursor: pointer;\"><img src=\"../../images/iyte-logo.jpg\" width=\"32\" height=\"32\" background=\"#007bff\" color=\"#007bff\" class=\"mr-2 rounded\"><p class=\" media-body pb-3 mb-0 small lh-125\"><strong class=\"d-block text-gray-dark\">" + applicant.name + "</strong>" + 
            applicant.name + "&" + applicant.lastname + 
        "</p><a href=\"application-details.html\" class=\"details-link\">View Details</a></div>";
        div.classList.add("text-muted");
        div.classList.add("pt-3");
        div.classList.add("border-bottom");
        div.classList.add("border-gray");
        div.classList.add("media");
        div.onclick = function(){ location.href='application-details.html'; }
        div.style.cursor = "pointer";

        var img = document.createElement("IMG");
        img.src = "../../images/iyte-logo.jpg";
        img.style.width =  "32px";
        img.style.height="32px";
        img.style.background="#007bff";
        img.style.color="#007bff";
        img.classList.add("mr-2");
        img.classList.add("rounded");

        div.appendChild(img);

        var p = document.createElement("P");
        p.classList.add("media-body");
        p.classList.add("pb-3");
        p.classList.add("mb-0");
        p.classList.add("small");
        p.classList.add("lh-125");

        var strong = document.createElement("STRONG");
        strong.classList.add("d-block");
        strong.classList.add("text-gray-dark");

        var nameBelow = document.createTextNode(applicant.name);
        strong.appendChild(nameBelow);

        p.appendChild(strong);
        p.appendChild(nameBelow);

        var lastname = document.createTextNode('&' + applicant.lastname);
        p.appendChild(lastname);

        div.appendChild(p);

        var a = document.createElement("A");
        a.href = "application-details.html";
        a.classList.add("details-link");
        var linkText = document.createTextNode("View Details");
        a.appendChild(linkText);

        div.appendChild(a);

        document.getElementById("applicant-container").appendChild(div);
    });
}

/*
*/