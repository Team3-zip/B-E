#!/bin/bash
REPOSITORY=/home/ubuntu/build
cd $REPOSITORY

# nvm 환경변수 등록
# export NVM_DIR="/home/ubuntu/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd server
sudo pm2 kill
sudo rm -rf node_modules
sudo npm install
sudo pm2 start app.js


