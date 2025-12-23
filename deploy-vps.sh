#!/bin/bash

# Deployment Script for Amazon Lightsail VPS
# VPS IP: 54.210.78.21
# User: bitnami

set -e

echo "🚀 Starting deployment to Amazon Lightsail VPS..."

# Configuration
VPS_IP="54.210.78.21"
VPS_USER="bitnami"
SSH_KEY="LightsailDefaultKey-ap-south-1.pem"
APP_NAME="match"
APP_DIR="/home/bitnami/$APP_NAME"
PORT=3000

# Test SSH connection
echo "📡 Testing SSH connection..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$VPS_USER@$VPS_IP" "echo 'SSH connection successful!'"

# Install Node.js and PM2 if not already installed
echo "📦 Installing Node.js and PM2..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" << 'ENDSSH'
# Install NVM if not present
if [ ! -d "$HOME/.nvm" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js 18
nvm install 18
nvm use 18

# Install PM2 globally
npm install -g pm2
ENDSSH

# Create app directory
echo "📁 Creating application directory..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" "mkdir -p $APP_DIR"

# Upload project files (excluding node_modules and .next)
echo "📤 Uploading project files..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'LightsailDefaultKey-ap-south-1.pem' \
    -e "ssh -i $SSH_KEY" \
    ./ "$VPS_USER@$VPS_IP:$APP_DIR/"

# Install dependencies and build
echo "🔨 Building application..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" << ENDSSH
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
nvm use 18

cd $APP_DIR
npm install
npm run build
ENDSSH

# Start/Restart with PM2
echo "🚀 Starting application with PM2..."
ssh -i "$SSH_KEY" "$VPS_USER@$VPS_IP" << ENDSSH
export NVM_DIR="\$HOME/.nvm"
[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
nvm use 18

cd $APP_DIR

# Stop existing process if running
pm2 delete $APP_NAME || true

# Start new process
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup
ENDSSH

echo "✅ Deployment completed!"
echo "🌐 Your application should be accessible at: http://$VPS_IP:$PORT"
echo ""
echo "📊 To view logs: ssh -i $SSH_KEY $VPS_USER@$VPS_IP 'pm2 logs $APP_NAME'"
echo "📈 To view status: ssh -i $SSH_KEY $VPS_USER@$VPS_IP 'pm2 status'"
