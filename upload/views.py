from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
import base64
import random
import json
import os

# Logging config
import logging
logging.basicConfig(level=logging.INFO,
                    filename="Plug.log",
                    filemode="a",
                    format='%(asctime)s %(levelname)-8s %(message)s',
                    datefmt='%Y-%m-%d %H:%M:%S')

# GLOBALS
password = '123'


def index(request):
    return render(request, template_name='index.html')


@api_view(['POST'])
def uploadPassword(request):
    if request.method == 'POST':
        try:
            logging.info(request.body.decode('utf-8'))
            body_decoded = request.body.decode('utf-8')
            data = json.loads(body_decoded)

            # Read .key files into memory
            f = open('/Users/shibboleth/PycharmProjects/Outlet/misc/rsa_1024_priv.pem', 'rb')
            private_key = RSA.importKey(f.read())

            # Init decryptor
            decryptor = PKCS1_v1_5.new(private_key)

            # Close filestream
            f.close()

            for k, v in data.items():
                if k == 'password':
                    if decryptor.decrypt(base64.b64decode(v), random.randint(0, 256)).decode().rstrip() == password:
                        cred = decryptor.decrypt(base64.b64decode(data['string']), random.randint(0, 256)).decode()
                        pw = decryptor.decrypt(base64.b64decode(data['password']), random.randint(0, 256)).decode()
                        logging.info("Successfully logged in, decrypting local ground folder.")
                        error = 0
                        error += os.system(f'/bin/bash /Users/shibboleth/PycharmProjects/Outlet/filehandle.sh {cred} {pw}')
                        if error > 0:
                            logging.error("Something went wrong during the encryption stage.")
                        return Response("Success", 200)
                    else:
                        return Response("Wrong Password", 401)

        except Exception as x:
            logging.error(f"An exception occurred: {x}")
            return Response("PC LOAD LETTER", 400)