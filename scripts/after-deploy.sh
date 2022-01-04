#!/bin/bash
REPOSITORY=/home/ubuntu/build


cd $REPOSITORY
cd server
npm install
pm2 kill
npm prod

cd $REPOSITORY
cd data
npm install
pm2 kill
npm prod