echo $2 | gpg --batch --yes --passphrase-fd 0 ground.tar.gz.gpg
tar -xf ground.tar.gz
rm -f ground.tar.gz

date=$(date +%s)
echo $1 >> 'ground/$date'

tar czf ground.tar.gz ground/
rm -rf ground/
echo {pw} | gpg -c --batch --yes --passphrase-fd 0 ground.tar.gz
rm -f ground.tar.gz