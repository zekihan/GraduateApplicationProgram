//If an interview has already been set, disable the 'Set an interview' button, if not then disable 'Cancel the interview' button.
function setVisibilityOfInterviewButtons() {
    var isInterviewSet = document.getElementById("interview-info").innerHTML;

    if (isInterviewSet == "No") {
        document.getElementById("cancel-interview-btn").disabled = true;
        document.getElementById("set-interview-btn").disabled = false;

    } else if (isInterviewSet == "Yes") {
        document.getElementById("set-interview-btn").disabled = true;
        document.getElementById("cancel-interview-btn").disabled = false;

    } else {
        //throw exception
    }
}