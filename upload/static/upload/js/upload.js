function EncryptAndUpload() {
    // Encrypt password and any other fields that aren't empty
    var public_key = "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/+nzgNK/KbuU7vN+pJzMLLjbZ\n" +
        "stVQoVrWpEzganl5Gy+g/DHybECZxtsZBF+idqS5wkTcSs5+xWeCjweSRwIZiIhS\n" +
        "dufrN8PcNJTxfzR0nWg46BfHUA1ZE/dr91mTQRH5kudKH0wFv1Wn0Q+iYyshkscm\n" +
        "pPIusumm+ouHdpTmowIDAQAB\n" +
        "-----END PUBLIC KEY-----";

    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(public_key);
    var password = encrypt.encrypt(document.getElementById('pw').value);
    console.log("Encrypted:", password);

    if (checkform(document.getElementById('password_field'))) {

        if (checkform(document.getElementById('message_upload'))) {
            console.log("Uploading Message.")
            let string = encrypt.encrypt(document.getElementById('str').value);
            UploadText(string, password);
    }
        if (checkform(document.getElementById('file_upload'))) {
            console.write("SNA");
            //UploadFile();
    }
        } else {
            document.getElementById("msg").innerHTML = 'You must provide a password.';
    }
}

function UploadFile() {
    // I think I should turn the file into a filestream, encrypt that and send it like a string
    let cred_file = document.getElementById("input").files[0];
}

function UploadText(string, password) {
    let csrftoken = getCookie("csrftoken");
    let formdata = {"string": string,
                    "password": string};
    console.log(formdata);

    (async () => {
        const rawResponse = await fetch('http://localhost:8000/upload/', {
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(formdata)
        });
        const content = await rawResponse.json();
        console.log(content);
    })();
}

function checkform(form) {
    // Return False is form is empty
    var inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        if(inputs[i].value === ""){
            return false;
        }
    }
    return true;
}

function getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
}
