#!/bin/bash
REPOSITORY=/home/ubuntu/build
cd $REPOSITORY

sudo pm2 kill
sudo rm -rf server