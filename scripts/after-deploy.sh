#!/bin/bash
REPOSITORY=/home/ubuntu/B-E


cd $REPOSITORY
cd server
npm install
pm2 kill
pm2 start app.js


