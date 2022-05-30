#!/usr/bin/bash

sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y npm libwebp wget git

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install nodejs -y
sudo rm nodesource_setup.sh

npm install

echo "[*] Todas dependências foram instaladas, por favor inicie o bit usando: \"npm start\""