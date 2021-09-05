#!/bin/bash -vx

# Gimme the epoch, I need it
date=$(date +%s)

# PARSE ARGS
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -m|--mode)
      MODE="$2"
      shift
      shift
      ;;
    -c|--cred)
      CRED="$2"
      shift
      shift
      ;;
    -p|--pass)
      PASSWORD="$2"
      shift
      shift
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

if [ -z $MODE ] || [ -z $PASSWORD ]; then
  echo "A positional arguments is unset"
  echo "Please set a mode, cred, and password. Note: '-m man' is probably the flag you want."
  echo "Manual View Mode: filehandle.sh -m man -p <password>"
  exit 1
fi

if [ $MODE == 'auto' ]; then
  if [ -f "ground.tar.gz.gpg" ]; then
    echo "[+] Ground exists, unpacking"

    echo "$PASSWORD" | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg
    tar -xzvf ground.tar.gz
    rm -f ground.tar.gz

    echo "$CRED" >> "$date".txt
    mv "$date".txt ground

    tar czf ground.tar.gz ground/
    rm -rf ground/
    echo "$PASSWORD" | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz
    rm -f ground.tar.gz

  else
    echo "[-] Ground does not exist, creating"
    mkdir ground

    echo "$CRED" >> "$date".txt
    mv "$date".txt ground

    tar czf ground.tar.gz ground/
    rm -rf ground/
    echo "$PASSWORD" | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz
    rm -f ground.tar.gz

  fi

elif [ $MODE == 'man' ]; then
  # Iterate through files, return unencrypted files contents seperated by Newline
  echo "$PASSWORD" | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg
  tar -xzvf ground.tar.gz
  rm -f ground.tar.gz

  cat ground/*.txt

  tar czf ground.tar.gz ground/
  rm -rf ground/
  echo "$PASSWORD" | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz
  rm -f ground.tar.gz

fi