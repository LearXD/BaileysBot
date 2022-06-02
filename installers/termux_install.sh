#!/usr/bin/bash

apt-get update -y
apt-get upgrade -y
apt-get install -y npm libwebp wget git

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
apt-get install nodejs -y
rm nodesource_setup.sh

npm install

echo "[*] Todas dependências foram instaladas, por favor inicie o bit usando: \"npm start\""