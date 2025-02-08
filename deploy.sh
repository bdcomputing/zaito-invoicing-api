#! /bin/bash
sudo chmod 777 ./*
# Install the Packages

cp ./server-setup.sh ../

# bash ../server-setup.sh
npm i

# Stop and Remove the container and Redeploy
npm run docker:stop
npm run docker:remove
npm run docker:build
npm run docker:up
