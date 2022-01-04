#!/bin/bash
REPOSITORY=/home/ubuntu/build


cd $REPOSITORY
cd server
sudo npm install
sudo pm2 kill
sudo pm2 start app.js


