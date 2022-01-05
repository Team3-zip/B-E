#!/bin/bash
REPOSITORY=/home/ubuntu/server
cd $REPOSITORY

sudo pm2 kill
sudo rm -rf server