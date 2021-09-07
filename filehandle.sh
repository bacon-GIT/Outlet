#!/bin/bash -vx

echo "Attempted access of filehandle.sh at $(date) by $(whoami)" >> Plug.log

# GLOBALS
BLUE='\033[0;34m'
NC='\033[0m' # No Color
date=$(date +%s)

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

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

if [ -z "$MODE" ] || [ -z "$PASSWORD" ]; then
  echo "A positional arguments is unset"
  echo "Please set a mode, cred, and password. Note: '-m man' is probably the flag you want."
  echo "Manual View Mode: filehandle.sh -m man -p <password>"
  exit 1
fi

if [ "$MODE" == 'auto' ]; then
  trap auto EXIT
elif [ "$MODE" == 'man' ]; then
  trap man EXIT
fi

function auto() {
  if [ -f "ground.tar.gz.gpg" ]; then
    echo "[+] Ground exists, unpacking"

    echo "$PASSWORD" | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg 2>/dev/null
    tar -xzvf ground.tar.gz 2>/dev/null
    rm -f ground.tar.gz

    echo "$CRED" >> "$date".txt
    mv "$date".txt ground

    tar czf ground.tar.gz ground/ 2>/dev/null
    rm -rf ground/
    echo "$PASSWORD" | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz 2>/dev/null
    rm -f ground.tar.gz
    chmod 700 ground.tar.gz.gpg

  else
    echo "[-] Ground does not exist, creating"
    mkdir ground

    echo "$CRED" >> "$date".txt
    mv "$date".txt ground

    tar czf ground.tar.gz ground/ 2>/dev/null
    rm -rf ground/
    echo "$PASSWORD" | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz 2>/dev/null
    rm -f ground.tar.gz
    chmod 700 ground.tar.gz.gpg

  fi
}

function man() {
  # Iterate through files, return unencrypted files contents seperated by Newline
  echo "$PASSWORD" | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg 2>/dev/null
  tar -xzvf ground.tar.gz 2>/dev/null
  rm -f ground.tar.gz

  if [ ! -d ground/ ]; then
    echo "Problem decrypting, probably wrong password"
    exit 1
  fi

  for FILE in ground/*;
  do
    val=$(echo "$FILE" | tr -dc '0-9')
    date=$(date -r "$val" '+%m/%d/%Y %H:%M:%S')
    creds=$(cat "$FILE")
    printf "${BLUE}%s |\t%s\n${NC}" "$date" "$creds"
  done

  tar czf ground.tar.gz ground/ 2>/dev/null
  rm -rf ground/
  echo "$PASSWORD" | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz 2>/dev/null
  rm -f ground.tar.gz
}