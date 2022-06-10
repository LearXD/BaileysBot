#!/usr/bin/bash

sudo apt-get install -y npm libwebp wget

cd ~
curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo apt-get install nodejs -y
sudo rm nodesource_setup.sh

npm install

echo "> Todas dependências foram instaladas, por favor inicie o bot usando: \"npm start\""