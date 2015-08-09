#!/bin/bash

# This is a very light deployment script, a fully featured one should be written in the future
if [ "$1" == "-h" ]; then
    echo "Run this file with the absolute path to the yodel ec2 pem file. Ex: ./deploy.sh /path/to/pem/file/pemFile.pem"
    exit 0
fi

if [ $# -eq 0 ]; then
    echo "No arguments provided. Please provide a path to a pem file. e.g. './deploy.sh /path/to/pem/file/pemFile.pem'"
    exit 1
fi

command -v node >/dev/null 2>&1 || n io latest
command -v bower >/dev/null 2>&1 || npm install -g bower
command -v gulp >/dev/null 2>&1 || npm install -g gulp

HOSTNAME=ubuntu@52.24.237.65
DIR=/home/ubuntu
FOLDER=yodel

# TODO: Run the tests and fail the deploy if they don't pass.
echo "ssh-ing to remote host to remove existing yodel app"

# TODO: Don't blow away the logs...
# TODO: Why do we have to use sudo to run our toolchain? And also, really, you're assuming n is installed?!?
ssh -i ${1} ${HOSTNAME} <<ENDSSH
    npm install -g node-gyp
    cd ${DIR}
    rm -rf ${FOLDER}

    command -v node >/dev/null 2>&1 || sudo n io latest
    command -v bower >/dev/null 2>&1 || sudo npm install -g bower
    command -v gulp >/dev/null 2>&1 || sudo npm install -g gulp
    command -v forever >/dev/null 2>&1 || sudo npm install -g forever
ENDSSH

echo "Tarring source folders"
gulp clean
tar czf ../app.tar.gz --exclude=".git" --exclude="logs" --exclude="node_modules" .

echo "SCPing app tarball"
scp -i ${1} ../app.tar.gz  ${HOSTNAME}:${DIR}

echo "ssh-ing to remote host to install and start yodel"
ssh -i ${1} ${HOSTNAME} <<ENDSSH
    echo "sshed into remote host"
    cd ${DIR}
    mkdir ${FOLDER}

    echo "Untarring source directory on server"
    tar -xvf app.tar.gz --directory ${FOLDER}
    rm app.tar.gz
    cd ${FOLDER}

    echo "Installing dependencies on remote server; please be patient"
    npm install
    bower install

    echo "Compiling webapp"
    gulp compile
    kill $(ps aux | grep 'node' | awk '{print $2}')

    echo "Starting server"
    forever start ./build/server.js
ENDSSH

echo "Removing local tarball"
rm ../app.tar.gz