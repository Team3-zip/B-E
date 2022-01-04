#!/bin/bash
REPOSITORY=/home/ubuntu/zip

cd $REPOSITORY
sudo cp -r dist/* /var/www/html/
sudo service nginx restart

cd $REPOSITORY
cd server
npm install
pm2 kill
npm prod
