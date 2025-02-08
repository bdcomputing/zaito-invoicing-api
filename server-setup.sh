#! /bin/bash
sudo apt update

# Next, install a few prerequisite packages which let apt use packages over HTTPS:
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Then add the GPG key for the official Docker repository to your system:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add the Docker repository to APT sources:
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update your existing list of packages again for the addition to be recognized:
sudo apt update

# Make sure you are about to install from the Docker repo instead of the default Ubuntu repo:
apt-cache policy docker-ce

# Finally, install Docker:
sudo apt install docker-ce

# Docker should now be installed, the daemon started, and the process enabled to start on boot. Check that it’s running:
# sudo systemctl status docker

# To install docker-compose tun the following commands:
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# To verify that your Docker Compose installation was successful, you can use the following command:
docker-compose --version

# Install Node JS
sudo apt update
sudo apt install nodejs
node -v
# Install npm
sudo apt install npm
#Install Nest JS
npm install -g @nestjs/cli

# # Install pm2
# npm install pm2 -g
# # copy  pm2 config file in the root directory
# cp ./bdcomputinglimited-API/.nginx/config.json ./

# Install and start Nginx
sudo apt update
sudo apt install nginx
sudo systemctl start nginx