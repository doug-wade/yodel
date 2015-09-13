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

HOSTNAME=ubuntu@52.11.138.95
DIR=/home/ubuntu
FOLDER=yodel

echo "compiling local instance for deployment"
gulp clean
gulp compile-prod

# TODO: Run the tests and fail the deploy if they don't pass.
echo "ssh-ing to remote host to remove existing yodel app"

# TODO: Why do we have to use sudo to run our toolchain? And also, really, you're assuming n is installed?!?
ssh -i ${1} ${HOSTNAME} <<ENDSSH
    # Install nodejs
    curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
    sudo apt-get install nodejs

    # Install latest version of node
    sudo npm install -g n
    sudo n latest

    # Install build tool chain
    sudo apt-get install git
    sudo npm install -g bower
    sudo npm install -g forever
    sudo apt-get install build-essential
    sudo npm install -g node-gyp

    cd ${DIR}
    rm -rf ${FOLDER}
    mkdir -p ./yodel-persistent/logs

    command -v node >/dev/null 2>&1 || sudo n io latest
    command -v bower >/dev/null 2>&1 || sudo npm install -g bower
    command -v forever >/dev/null 2>&1 || sudo npm install -g forever
ENDSSH

echo "Tarring source folders"
tar czf ../app.tar.gz bower.json package.json build public README.md .bowerrc

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
    npm install --production
    bower install --production

    echo "Starting server"
    kill $(ps aux | grep 'node' | awk '{print $2}')
    forever start ./build/server.js
ENDSSH

echo "Removing local tarball"
rm ../app.tar.gz
