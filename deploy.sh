#!/bin/bash

# This is a very light deployment script, a fully featured one should be written in the future
# TODO re: checking npm, gulp, bower &c.
# TODO Best: detect gulp, if gulp is found use gulp clean, otherwise use exclude statements.

if [ "$1" == "-h" ]; then
    echo "Run this file with the absolute path to the yodel ec2 pem file. Ex: ./deploy.sh /path/to/pem/file/pemFile.pem"
    exit 0
fi

if [ $# -eq 0 ]; then
    echo "No arguments provided. Please provide a path to a pem file. e.g. './deploy.sh /path/to/pem/file/pemFile.pem'"
    exit 1
fi

HOSTNAME=ubuntu@52.24.237.65
DIR=/home/yodel

ssh -i ${1} ${HOSTNAME} <<ENDSSH
    cd ${DIR}
    rm -rf *
ENDSSH

# This will generate a warning, ignore it.
# Actually this will generate a bunch of errors which you can safely ignore 

tar czf app.tar.gz --exclude="node_modules" --exclude=".git" --exclude "public" --exclude "build" .

scp -i ${1} app.tar.gz  ${HOSTNAME}:${DIR}

ssh -i ${1} ${HOSTNAME} <<ENDSSH
    cd ${DIR}
    tar -xvf app.tar.gz
    rm app.tar.gz
    npm install
    kill $(ps aux | grep 'node' | awk '{print $2}')
    gulp &
ENDSSH

rm app.tar.gz

