function adjustNumberText(inputNumber){
    if(inputNumber == 1){
        var o = document.getElementById("first-input-text");
        var i = document.getElementById("range1");
    }else{
        var o = document.getElementById("second-input-text");
        var i = document.getElementById("range2");
    }
    o.innerHTML = i.value;
    i.addEventListener('input', function () {
        o.innerHTML = i.value;
      }, false);
}


function getAssessmentPage(){
    var acceptingApplicants = document.getElementById("first-input-text").textContent;
    var substituteApplicants = document.getElementById("second-input-text").textContent;
    var queryString = "?accept=" + acceptingApplicants + "&substitute=" + substituteApplicants;
    window.location.href = "enter-assessment-results.html" + queryString;
}