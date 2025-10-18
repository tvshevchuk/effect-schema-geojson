# CI/CD Setup Guide

This guide explains how to set up automatic deployment to NPM using GitHub Actions.

## Overview

The CI/CD pipeline automatically:
- ✅ Runs tests and builds the project using pnpm
- ✅ Publishes to NPM when a version tag is pushed
- ✅ Creates GitHub releases
- ✅ Validates package before publishing

## Setup Instructions

### 1. Create NPM Token

1. Go to [NPM Account Settings](https://www.npmjs.com/settings/tokens)
2. Click "Generate New Token"
3. Select "Automation" token type
4. Copy the token (you won't see it again!)

### 2. Add NPM Token to GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your NPM token from step 1
6. Click "Add secret"

### 3. Verify Workflow File

The workflow file is already created at `.github/workflows/npm-publish.yml`. It will:
- Trigger on version tags (e.g., `v1.0.0`)
- Run tests and build using pnpm
- Publish to NPM
- Create GitHub releases

## How to Deploy

### Method 1: Using the Version Update Script (Recommended)

```bash
npm run version:update
```

This interactive script will:
- Show current version
- Let you choose version bump type (patch/minor/major/custom)
- Run tests and build
- Commit changes and create git tag
- Push to GitHub (triggers CI/CD)

### Method 2: Using Quick Version Commands

```bash
# Patch version (0.1.0 → 0.1.1)
npm run version:patch

# Minor version (0.1.0 → 0.2.0)
npm run version:minor

# Major version (0.1.0 → 1.0.0)
npm run version:major
```

### Method 3: Manual Process

1. Update version in `package.json`
2. Run tests: `npm run test`
3. Build project: `npm run build`
4. Commit changes: `git add . && git commit -m "chore: bump version"`
5. Create tag: `git tag v1.0.0`
6. Push: `git push origin main && git push origin v1.0.0`

## Workflow Triggers

The CI/CD pipeline triggers on:
- **Version tags**: `v*` (e.g., `v1.0.0`, `v1.2.3`)
- **Manual trigger**: Go to Actions tab → "Publish to NPM" → "Run workflow"

## What Happens During Deployment

1. **Checkout**: Gets the latest code
2. **Setup**: Installs Node.js, pnpm, and dependencies
3. **Test**: Runs `pnpm run test`
4. **Build**: Runs `pnpm run build`
5. **Verify**: Checks package with `pnpm pack --dry-run`
6. **Publish**: Publishes to NPM using your token
7. **Release**: Creates GitHub release with changelog

## Monitoring Deployments

- **GitHub Actions**: Go to "Actions" tab to see deployment status
- **NPM**: Check [your package page](https://www.npmjs.com/package/effect-schema-geojson)
- **GitHub Releases**: Check "Releases" section in your repository

## Troubleshooting

### Common Issues

1. **NPM Token Invalid**
   - Check token is correct in GitHub Secrets
   - Ensure token has "Automation" type
   - Verify token hasn't expired

2. **Tests Failing**
   - Fix test issues locally first
   - Run `pnpm run test` to verify

3. **Build Failing**
   - Check TypeScript errors
   - Run `pnpm run build` locally

4. **Package Already Exists**
   - Version already published to NPM
   - Use a different version number

### Debug Steps

1. Check GitHub Actions logs
2. Verify NPM token permissions
3. Test locally with `pnpm run test && pnpm run build`
4. Check package.json version format

## Security Notes

- NPM token is stored securely in GitHub Secrets
- Token only has access to your specific package
- Workflow only runs on version tags (not every push)
- All steps are logged for transparency

## Next Steps

After setup:
1. Test with a patch version: `npm run version:patch`
2. Verify deployment in GitHub Actions
3. Check NPM package was updated
4. Verify GitHub release was created

Your package will now automatically deploy to NPM whenever you update the version! 🚀
