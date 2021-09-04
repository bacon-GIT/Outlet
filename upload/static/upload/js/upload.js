function EncryptAndUpload() {

    // Encrypt password and any other fields that aren't empty
    var public_key = "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/+nzgNK/KbuU7vN+pJzMLLjbZ\n" +
        "stVQoVrWpEzganl5Gy+g/DHybECZxtsZBF+idqS5wkTcSs5+xWeCjweSRwIZiIhS\n" +
        "dufrN8PcNJTxfzR0nWg46BfHUA1ZE/dr91mTQRH5kudKH0wFv1Wn0Q+iYyshkscm\n" +
        "pPIusumm+ouHdpTmowIDAQAB\n" +
        "-----END PUBLIC KEY-----"

    var password = document.getElementById('pw').value;
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(public_key);
    var password = encrypt.encrypt(password);
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
    document.write(cred_file);
    let formData = new FormData();
    formData.append("file", cred_file);


}

function UploadText(string, password) {
    var request = new XMLHttpRequest();
    let formdata = new FormData();
    formdata.append("string", string);
    formdata.append("password", password);
    request.open("POST", "http://127.0.0.1:5000/string");
    request.send(formdata);
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
