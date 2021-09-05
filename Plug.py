from flask import Flask
from flask import jsonify
from flask import request
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import base64
import random
import time
import os

# Logging config
import logging
logging.basicConfig(level=logging.INFO,
                    filename="Plug.log",
                    filemode="a",
                    format='%(asctime)s %(levelname)-8s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

# GLOBALS
password = 'test'
app = Flask(__name__)


@app.route('/string', methods=['POST'])
def upload_string():
    data = request.form

    # Read .key files into memory
    f = open('/Users/shibboleth/PycharmProjects/Outlet/misc/rsa_1024_priv.pem', 'rb')
    private_key = RSA.importKey(f.read())

    # Init decryptor
    decryptor = PKCS1_v1_5.new(private_key)

    # Close filestreams
    f.close()

    pw = data['string']
    for k, v in data.items():
        v = base64.b64decode(v)
        if decryptor.decrypt(v, random.randint(0, 256)).decode() == password:
            logging.info("Successfully logged in, decrypting local ground folder.")

            # Decrypt folder
            os.system(f"echo {pw} | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg")
            os.system("tar -xf ground.tar.gz")
            os.system("rm -f ground.tar*")

            # Write contents of string to now unencrypted folder
            with open(f'ground/{str(request.remote_addr).replace(".", "")}{str(time.time()).replace(".", "")}', 'w+') as fp:
                fp.write(str(data))

            # Re-encrypt folder with GPG
            os.system("tar czf ground.tar.gz ground/")
            os.system("rm -rf ground/")
            os.system(f"echo {pw} | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz")
            os.system("rm -f ground.tar.gz")

        else:
            return jsonify({'message' : 'Failure!! Password is incorrect'})


if __name__ == "__main__":
    app.run(debug=True)
