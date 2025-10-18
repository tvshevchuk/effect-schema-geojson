#!/bin/bash

# Effect Schema GeoJSON - Version Update Script
# This script helps update the version and create a git tag for CI/CD

set -e

echo "🚀 Effect Schema GeoJSON - Version Update"
echo "========================================"

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

# Get current version
current_version=$(node -p "require('./package.json').version")
echo -e "${BLUE}📋 Current version: ${current_version}${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes.${NC}"
    read -p "Do you want to commit them first? (y/n): " commit_changes
    if [ "$commit_changes" = "y" ]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}✅ Changes committed.${NC}"
    else
        echo -e "${RED}❌ Please commit your changes before updating version.${NC}"
        exit 1
    fi
fi

echo ""
echo "Select version update type:"
echo "1) patch (0.0.1 -> 0.0.2)"
echo "2) minor (0.0.1 -> 0.1.0)"
echo "3) major (0.0.1 -> 1.0.0)"
echo "4) custom version"
echo "5) cancel"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        version_type="patch"
        ;;
    2)
        version_type="minor"
        ;;
    3)
        version_type="major"
        ;;
    4)
        read -p "Enter custom version (e.g., 1.2.3): " custom_version
        if [[ ! $custom_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo -e "${RED}❌ Invalid version format. Please use semantic versioning (e.g., 1.2.3)${NC}"
            exit 1
        fi
        version_type="$custom_version"
        ;;
    5)
        echo -e "${YELLOW}❌ Version update cancelled.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Please run the script again.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}🔨 Updating version...${NC}"

# Update version in package.json
if [ "$choice" = "4" ]; then
    npm version "$version_type" --no-git-tag-version
else
    npm version "$version_type" --no-git-tag-version
fi

# Get new version
new_version=$(node -p "require('./package.json').version")
echo -e "${GREEN}✅ Version updated to: ${new_version}${NC}"

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
if npm run test; then
    echo -e "${GREEN}✅ Tests passed!${NC}"
else
    echo -e "${RED}❌ Tests failed. Please fix issues before proceeding.${NC}"
    # Revert version change
    git checkout -- package.json
    exit 1
fi

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix issues before proceeding.${NC}"
    # Revert version change
    git checkout -- package.json
    exit 1
fi

# Commit version change
echo -e "${BLUE}📝 Committing version change...${NC}"
git add package.json
git commit -m "chore: bump version to ${new_version}"

# Create and push tag
echo -e "${BLUE}🏷️  Creating git tag...${NC}"
git tag "v${new_version}"
echo -e "${GREEN}✅ Tag v${new_version} created.${NC}"

# Push changes and tag
echo -e "${BLUE}📤 Pushing changes and tag...${NC}"
git push origin main
git push origin "v${new_version}"

echo ""
echo -e "${GREEN}🎉 Version Update Complete!${NC}"
echo "=============================="
echo -e "Version: ${BLUE}${new_version}${NC}"
echo -e "Tag: ${BLUE}v${new_version}${NC}"
echo ""
echo "The CI/CD pipeline will now:"
echo "• Run tests and build"
echo "• Publish to NPM automatically"
echo "• Create a GitHub release"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Check the GitHub Actions tab for deployment status"
echo "2. Verify the package was published to NPM"
echo "3. Check the GitHub release was created"
echo ""
echo "Thank you for using Effect Schema GeoJSON! 🚀"
