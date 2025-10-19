#!/bin/bash

# Effect Schema GeoJSON - Version Update Script
# This script helps update the version and create a git tag for CI/CD

set -euo pipefail

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

# Check for uncommitted changes (handle the case with no commits yet)
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes.${NC}"
        git status --short
        echo ""
        read -p "Do you want to commit all changes first? (y/n): " commit_changes
        if [ "$commit_changes" = "y" ]; then
            read -p "Enter commit message: " commit_msg
            git add -A
            git commit -m "$commit_msg"
            echo -e "${GREEN}✅ All changes committed.${NC}"
        else
            echo -e "${RED}❌ Please commit your changes before updating version.${NC}"
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}ℹ️  No commits yet in this repository. Skipping uncommitted changes check.${NC}"
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

# Update version in package.json using npm to modify package.json reliably
npm version "$version_type" --no-git-tag-version

# Get new version
new_version=$(node -p "require('./package.json').version")
echo -e "${GREEN}✅ Version updated to: ${new_version}${NC}"

# Ensure pnpm is available (try corepack, then npm install -g), otherwise fall back to npm
PM=""
ensure_pnpm() {
    if command -v pnpm >/dev/null 2>&1; then
        PM="pnpm"
        return 0
    fi

    if command -v corepack >/dev/null 2>&1; then
        echo -e "${BLUE}🔧 Enabling corepack and preparing pnpm...${NC}"
        corepack enable || true
        corepack prepare pnpm@latest --activate || true
        if command -v pnpm >/dev/null 2>&1; then
            PM="pnpm"
            return 0
        fi
    fi

    if command -v npm >/dev/null 2>&1; then
        echo -e "${BLUE}🔧 Installing pnpm globally via npm...${NC}"
        npm install -g pnpm || true
        if command -v pnpm >/dev/null 2>&1; then
            PM="pnpm"
            return 0
        fi
    fi

    # Fallback to npm if pnpm cannot be made available
    if command -v npm >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  pnpm not available — falling back to npm.${NC}"
        PM="npm"
        return 0
    fi

    echo -e "${RED}❌ Neither pnpm nor npm are available. Please install pnpm or npm and retry.${NC}"
    exit 1
}

ensure_pnpm

echo -e "${BLUE}🧪 Running tests with ${PM}...${NC}"
if $PM run test; then
    echo -e "${GREEN}✅ Tests passed!${NC}"
else
    echo -e "${RED}❌ Tests failed. Please fix issues before proceeding.${NC}"
    # Revert version change
    git checkout -- package.json || true
    exit 1
fi

# Build the project
echo -e "${BLUE}🔨 Building project with ${PM}...${NC}"
if $PM run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix issues before proceeding.${NC}"
    # Revert version change
    git checkout -- package.json || true
    exit 1
fi

# Commit all changes including version change and any build artifacts
echo -e "${BLUE}📝 Committing all changes...${NC}"
git add -A
git commit -m "chore: bump version to ${new_version}" || echo -e "${YELLOW}⚠️  No changes to commit${NC}"

# Create and push tag
echo -e "${BLUE}🏷️  Creating git tag...${NC}"
git tag "v${new_version}"
echo -e "${GREEN}✅ Tag v${new_version} created.${NC}"

# Determine current branch and push changes and tag
current_branch=$(git rev-parse --abbrev-ref HEAD || echo "main")
echo -e "${BLUE}📤 Pushing all changes and tag to origin/${current_branch}...${NC}"
git push origin "$current_branch"
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