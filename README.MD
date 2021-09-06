# _Outlet_

#### Requirements
*   Django
*   GPG
*   CryptoDome

---
#### Purpose
To share credentials with an absolutely unnecessary level of security, 
and to continuously update the security of this app until we reach a 
balance of totally instability and complete unusability.

---
#### How does it work?
When a user enters a credential, the credential is encrypted with the _public key_ 
of the server. The user is then also prompted to enter a password, which is also encrypted
with the _public key_. The credentials are sent to the server, where the credentials and password are
decrypted, and the password checked. If the password matches, it's used to decrypt the **ground** folder,
the folder which stores all of our shared credentials. The folder is then reencrypted using the same password.

---
### filehandle.sh
This is the main script that handles encryption/decryption of the **ground** folder.
To view currently stored passwords:
_/bin/bash filehandle.sh -m man -p <password>_

---
#### TO ADD
*   ~~Move to the PKCS#1 OAEP RSA standard~~
*   XSS Testing
*   Move to AWS and add HTTPS
*   Atomic clocks
*   Fingerprint / Eyescanner

---
### Appendix
_https://www.openssl.org/docs/manmaster/man3/RSA_public_encrypt.html_

_https://crypto.stackexchange.com/questions/12688/can-you-explain-bleichenbachers-cca-attack-on-pkcs1-v1-5_