# Deployment Script for Amazon Lightsail VPS (Password Authentication)
# VPS: bitnami@54.210.78.21
# Run this in PowerShell

$VPS_IP = "54.210.78.21"
$VPS_USER = "bitnami"
$VPS_PASSWORD = "Prevue77@7"
$APP_NAME = "match"
$APP_DIR = "/home/bitnami/$APP_NAME"

Write-Host "🚀 Starting deployment to Amazon Lightsail VPS..." -ForegroundColor Green

# Install plink (PuTTY) if not available - needed for password auth
if (-not (Get-Command plink -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing PuTTY (plink)..." -ForegroundColor Yellow
    winget install -e --id PuTTY.PuTTY
}

# Function to run SSH commands with password
function Invoke-SSHCommand {
    param($Command)
    echo y | plink -batch -pw "$VPS_PASSWORD" "$VPS_USER@$VPS_IP" "$Command"
}

# Test connection
Write-Host "📡 Testing SSH connection..." -ForegroundColor Cyan
Invoke-SSHCommand "echo 'SSH connection successful!'"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ SSH connection failed!" -ForegroundColor Red
    exit 1
}

# Install Node.js and PM2
Write-Host "📦 Installing Node.js and PM2..." -ForegroundColor Cyan
Invoke-SSHCommand @"
# Install NVM if not present
if [ ! -d `$HOME/.nvm ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

# Load NVM
export NVM_DIR=`$HOME/.nvm
[ -s `$NVM_DIR/nvm.sh ] && \. `$NVM_DIR/nvm.sh

# Install Node.js 18
nvm install 18 2>/dev/null || true
nvm use 18

# Install PM2
npm install -g pm2 2>/dev/null || true
"@

# Create app directory
Write-Host "📁 Creating application directory..." -ForegroundColor Cyan
Invoke-SSHCommand "mkdir -p $APP_DIR"

# Upload files using pscp (PuTTY SCP)
Write-Host "📤 Uploading project files (this may take a few minutes)..." -ForegroundColor Cyan

# Create a temporary exclude file
$excludeFile = "deploy-exclude.txt"
@"
node_modules/
.next/
.git/
*.pem
.env.local
"@ | Out-File -FilePath $excludeFile -Encoding ASCII

# Use pscp to upload files
pscp -batch -pw "$VPS_PASSWORD" -r `
    -exclude node_modules -exclude .next -exclude .git -exclude "*.pem" `
    * "$VPS_USER@${VPS_IP}:$APP_DIR/"

Remove-Item $excludeFile -ErrorAction SilentlyContinue

# Build and start application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
Invoke-SSHCommand @"
export NVM_DIR=`$HOME/.nvm
[ -s `$NVM_DIR/nvm.sh ] && \. `$NVM_DIR/nvm.sh
nvm use 18

cd $APP_DIR
npm install
npm run build
"@

# Start with PM2
Write-Host "🚀 Starting application with PM2..." -ForegroundColor Cyan
Invoke-SSHCommand @"
export NVM_DIR=`$HOME/.nvm
[ -s `$NVM_DIR/nvm.sh ] && \. `$NVM_DIR/nvm.sh
nvm use 18

cd $APP_DIR
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name `"$APP_NAME`" -- start
pm2 save
pm2 startup | tail -1 | bash
"@

Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Your application is accessible at: http://$VPS_IP:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs: plink -batch -pw `"$VPS_PASSWORD`" $VPS_USER@$VPS_IP 'pm2 logs $APP_NAME'"
Write-Host "  View status: plink -batch -pw `"$VPS_PASSWORD`" $VPS_USER@$VPS_IP 'pm2 status'"
Write-Host "  Restart app: plink -batch -pw `"$VPS_PASSWORD`" $VPS_USER@$VPS_IP 'pm2 restart $APP_NAME'"
