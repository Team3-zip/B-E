#!/bin/bash
REPOSITORY=/home/ubuntu/zip

cd $REPOSITORY
cd server
npm install
pm2 start app.js

