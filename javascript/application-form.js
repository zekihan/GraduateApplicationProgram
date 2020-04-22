
//If the applicant is foreign, make the passport input field visible, invisible if otherwise.
function setVisibilityOfPassportInput(element){
    document.getElementById("passport-input-field").style.display = element.value == 'foreign' ? 'block' : 'none';
}

//If the applicant currently has a job, make the permission letters input field visible, invisible if otherwise.
function setVisibilityOfPermissionLetterInput(element){
    document.getElementById("permission-letters-input").style.display = element.value == 'yes' ? 'block' : 'none';
}

//If the applicant is applying for a PhD program, then ask for his/her Master's Degree transcript.
function setVisibilityOfGradTranscriptInput(element){
    document.getElementById("grad-transcript-input").style.display = element.value == 'phd' ? 'block' : 'none';
}

//Function will be used whenever the user completes the first part of the application and presses 'Next' button.
function storeAndGetNextPage(){
    //Store personal info first, display spinner while doing it.
    location.href = "application-app-info.html"; //Then direct the user to the next application page.
}