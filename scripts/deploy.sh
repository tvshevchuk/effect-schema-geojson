#!/bin/bash

# Effect Schema GeoJSON - Deployment Script
# This script helps deploy the library to GitHub and NPM

set -e

echo "🚀 Effect Schema GeoJSON Deployment Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a git repository. Please run 'git init' first.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment checks...${NC}"

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes.${NC}"
    read -p "Do you want to commit them first? (y/n): " commit_changes
    if [ "$commit_changes" = "y" ]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed.${NC}"
    fi
fi

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
if npm run test; then
    echo -e "${GREEN}✅ Tests passed!${NC}"
else
    echo -e "${RED}❌ Tests failed. Please fix issues before deploying.${NC}"
    exit 1
fi

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix issues before deploying.${NC}"
    exit 1
fi

# Check if package can be packed
echo -e "${BLUE}📦 Checking package...${NC}"
if npm pack --dry-run > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Package validation successful!${NC}"
else
    echo -e "${RED}❌ Package validation failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"
echo ""

# GitHub deployment
echo -e "${BLUE}📤 GitHub Deployment${NC}"
echo "===================="

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo -e "${YELLOW}ℹ️  Remote origin already configured.${NC}"
else
    echo -e "${YELLOW}⚠️  No remote origin configured.${NC}"
    echo "Please create a repository at: https://github.com/tvshevchuk/effect-schema-geojson"
    read -p "Press enter when repository is created and you want to add remote..."
    git remote add origin https://github.com/tvshevchuk/effect-schema-geojson.git
    echo -e "${GREEN}✅ Remote origin added.${NC}"
fi

read -p "Push to GitHub? (y/n): " push_github
if [ "$push_github" = "y" ]; then
    echo -e "${BLUE}🚀 Pushing to GitHub...${NC}"
    git push -u origin main
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
    echo "📍 Repository: https://github.com/tvshevchuk/effect-schema-geojson"
fi

echo ""

# NPM deployment
echo -e "${BLUE}📦 NPM Deployment${NC}"
echo "================="

# Check if logged in to NPM
if npm whoami > /dev/null 2>&1; then
    current_user=$(npm whoami)
    echo -e "${GREEN}✅ Logged in to NPM as: ${current_user}${NC}"
else
    echo -e "${YELLOW}⚠️  Not logged in to NPM.${NC}"
    echo "Please run: npm login"
    exit 1
fi

# Show what will be published
echo -e "${BLUE}📋 Package contents:${NC}"
npm pack --dry-run

echo ""
read -p "Publish to NPM? (y/n): " publish_npm
if [ "$publish_npm" = "y" ]; then
    echo -e "${BLUE}🚀 Publishing to NPM...${NC}"
    npm publish
    echo -e "${GREEN}✅ Successfully published to NPM!${NC}"
    echo "📍 Package: https://www.npmjs.com/package/effect-schema-geojson"
fi

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "======================="
echo "Your Effect Schema GeoJSON library is now available:"
echo "• GitHub: https://github.com/tvshevchuk/effect-schema-geojson"
echo "• NPM: https://www.npmjs.com/package/effect-schema-geojson"
echo ""
echo "Installation command:"
echo -e "${BLUE}npm install effect-schema-geojson effect${NC}"
echo ""
echo "Thank you for using Effect Schema GeoJSON! 🚀"
