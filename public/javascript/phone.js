function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function verify() {
    $('#buttons').html(
        '<button class="btn btn-primary btn-block mt-2" onclick="verify()" type="button" disabled><span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span> Verifing...</button>'
    ).addClass('disabled');
    var phone = getCookie("phone")
    var url = '/verifyCode'
    var body = {
        phoneNumber: phone,
        verificationCode: document.getElementById('verificationCode').value
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.response)
            opener.verify(true)
        }
    };
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
}