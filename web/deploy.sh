#!/bin/bash

# Slow Spot Web - FTP Deployment Script
# Usage: ./deploy.sh [--build-only | --upload-only]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load .env file if exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# FTP Configuration
FTP_HOST="s14.mydevil.net"
FTP_USER="f1204_slowspot"
FTP_REMOTE_DIR="."

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Slow Spot Web - Deploy Script      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo -e "${RED}Error: lftp is not installed.${NC}"
    echo "Install it with: brew install lftp"
    exit 1
fi

# Function to build
build() {
    echo -e "${YELLOW}📦 Building Next.js application...${NC}"
    npm run build
    echo -e "${GREEN}✅ Build complete!${NC}"
}

# Function to upload
upload() {
    echo -e "${YELLOW}🚀 Uploading to FTP server...${NC}"

    # Check for password in environment or prompt
    if [ -z "$FTP_PASS" ]; then
        echo -n "Enter FTP password for $FTP_USER@$FTP_HOST: "
        read -s FTP_PASS
        echo ""
    fi

    lftp -c "
        set ssl:verify-certificate yes
        set ftp:ssl-allow yes
        set ftp:ssl-force yes
        set ftp:ssl-protect-data yes
        set net:timeout 60
        open -u $FTP_USER,'$FTP_PASS' ftp://$FTP_HOST
        cd $FTP_REMOTE_DIR
        mirror -R --verbose --only-newer --exclude-glob *.txt ./out .
        bye
    "

    echo -e "${GREEN}✅ Upload complete!${NC}"
    echo -e "${GREEN}🌐 Site deployed to: https://slowspot.me${NC}"
}

# Parse arguments
case "$1" in
    --build-only)
        build
        ;;
    --upload-only)
        upload
        ;;
    *)
        build
        upload
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment finished successfully!${NC}"
