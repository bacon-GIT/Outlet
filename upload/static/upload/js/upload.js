function EncryptAndUpload() {
    // Encrypt password and any other fields that aren't empty
    let publicKey = forge.pki.publicKeyFromPem
    (  "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/+nzgNK/KbuU7vN+pJzMLLjbZ\n" +
        "stVQoVrWpEzganl5Gy+g/DHybECZxtsZBF+idqS5wkTcSs5+xWeCjweSRwIZiIhS\n" +
        "dufrN8PcNJTxfzR0nWg46BfHUA1ZE/dr91mTQRH5kudKH0wFv1Wn0Q+iYyshkscm\n" +
        "pPIusumm+ouHdpTmowIDAQAB\n" +
        "-----END PUBLIC KEY-----");

    let encrypted_password = publicKey.encrypt(document.getElementById('pw').value, "RSA-OAEP", {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf1.create()
    });let password = forge.util.encode64(encrypted_password);

    let encrypted_string = publicKey.encrypt(document.getElementById('str').value, "RSA-OAEP", {
            md: forge.md.sha256.create(),
            mgf1: forge.mgf1.create()
    });let string = forge.util.encode64(encrypted_string);

    if (checkform(document.getElementById('password_field'))) {
        if (checkform(document.getElementById('message_upload'))) {
            UploadText(string, password);
    }
        } else {
            document.getElementById("msg").innerHTML = 'You must provide a password.';
    }
}

function UploadText(string, password) {
    let csrftoken = getCookie("csrftoken");
    let formdata = {"string": string,
                    "password": password};

    fetch('http://' + location.host.split(":")[0] + ':8000/upload/', {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(formdata)
        }).then(function(response) {
            if (response.status.toString() === '401') {
                if (PCLOADLETTER()) {
                    document.getElementById("msg").textContent = '<h1>PC LOAD LETTER</h1>';
                } else {
                    document.getElementById("msg").textContent = 'Incorrect Password!';
                }
            } else if (!response.ok) {
                document.getElementById("msg").textContent = 'Something went wrong!';
            } else {
                document.getElementById("msg").textContent = 'Success!!';
            }
        })
}

// This function might be fucking useless
function checkform(form) {
    // Return False is form is empty
    let inputs = form.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        if(inputs[i].value === ""){
            return false;
        }
    }
    return true;
}

function getCookie(name) {
    let re = new RegExp(name + "=([^;]+)");
    let value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
}

function PCLOADLETTER() {
  return Math.random() * (10000) === Math.random() * (10000);
}

