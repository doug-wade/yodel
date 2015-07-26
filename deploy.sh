#!/bin/bash

HOSTNAME=ubuntu@52.24.237.65
DIR=/home/yodel

ssh -i ${1} ${HOSTNAME} <<ENDSSH
    cd ${DIR}
    rm -rf *
ENDSSH

# This will generate a warning, ignore it.
# Actually this will generate a bunch of errors which you can safely ignore 

tar czf app.tar.gz --exclude="node_modules" --exclude=".git" .

scp -i ${1} app.tar.gz  ${HOSTNAME}:${DIR}

ssh -i ${1} ${HOSTNAME} <<ENDSSH
    cd ${DIR}
    tar -xvf app.tar.gz
    rm app.tar.gz
    kill $(ps aux | grep 'node' | awk '{print $2}')
    npm install
    gulp &
ENDSSH

rm app.tar.gz

