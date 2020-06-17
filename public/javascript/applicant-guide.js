function getSteps() {
    firebase.database().ref("applicantGuide").once('value').then(function (snapshot) {

        var steps = [];
        snapshot.forEach(function (s) {
            var step = s.val();
            steps.push(step);
        });

        displaySteps(steps);

    }).catch(function (error) {
        console.log(error);
    });
}

function displaySteps(steps) {

    var count = 1;

    steps.forEach(function (step) {
        var card = document.createElement('DIV');
        //Application data row.
        card.classList.add("card");

        var cardheader = document.createElement('DIV');
        cardheader.classList.add("card-header");

        card.appendChild(cardheader);

        var header = document.createElement('h2');
        header.classList.add("mb-0");

        cardheader.appendChild(header);

        var button =
            `<button class="btn btn-link" type="button" data-toggle="collapse"
            data-target="#collapse${count}" aria-expanded="true" aria-controls="collapse${count}">
            Step ${count}
        </button>`;

        header.insertAdjacentHTML("afterend", button)

        var body =
            `<div id="collapse${count}" class="collapse" aria-labelledby="heading${count} data-parent="#steps-accordion">
            <div class="card-body">
            ${step}
            </div>
        </div>`;

        cardheader.insertAdjacentHTML("afterend", body);

        document.getElementById("steps-accordion").appendChild(card);

        count++;
    });

    var element = document.getElementById("spinner");
    element.parentNode.removeChild(element);
}