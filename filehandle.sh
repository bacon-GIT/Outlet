#!/bin/bash -vx

date=$(date +%s)
pw=$2
cred=$1
echo "$date"

if [ -f "ground.tar.gz.gpg" ]; then
  echo "[+] Ground exists, unpacking"

  echo "$pw" | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg
  tar -xf ground.tar.gz
  rm -f ground.tar.gz

  echo "$cred" >> "$date".txt
  mv "$date".txt ground/

  tar czf ground.tar.gz ground/
  rm -rf ground/
  echo $pw | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz
  rm -f ground.tar.gz

else
  echo "[-] Ground does not exist, creating"
  mkdir ground

  echo "$cred" >> "$date".txt
  mv "$date".txt ground/

  tar czf ground.tar.gz ground/
  rm -rf ground/
  echo $pw | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz
  rm -f ground.tar.gz

fi
