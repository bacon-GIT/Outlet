from flask import Flask
from flask import jsonify
from flask import request
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import base64
import random
import time

# GLOBALS
password = 'test'

app = Flask(__name__)


@app.route('/string', methods=['POST'])
def upload_string():
    data = request.form

    # Read .key files into memory
    f = open('/Users/shibboleth/PycharmProjects/Outlet/misc/rsa_1024_priv.pem', 'rb')
    private_key = RSA.importKey(f.read())
    p = open('/Users/shibboleth/PycharmProjects/Outlet/misc/rsa_1024_pub.pem', 'rb')
    public_key = RSA.importKey(p.read())

    # Init decryptor
    decryptor = PKCS1_v1_5.new(private_key)

    # Close filestreams
    f.close()
    p.close()

    for k, v in data.items():
        print(v)
        v = base64.b64decode(v)
        print(k, decryptor.decrypt(v, random.randint(0, 256)))

    # Need to run a bash script here which attempts to decrypt the ground folder using a sha512 hash version of the password
    with open(f'ground/{str(request.remote_addr).replace(".", "")}{str(time.time()).replace(".", "")}', 'w+') as fp:
        fp.write(str(data))

    return jsonify({'message' : 'Success!!'})


if __name__ == "__main__":
    app.run(debug=True)
