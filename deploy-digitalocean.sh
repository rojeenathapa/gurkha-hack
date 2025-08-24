#!/bin/bash

echo "🌊 DigitalOcean App Platform Deployment Script"
echo "=============================================="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please navigate to your project directory."
    exit 1
fi

# Check git status
echo "📋 Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    echo "⚠️  You have uncommitted changes. Committing them now..."
    git add .
    git commit -m "Prepare for DigitalOcean deployment - $(date)"
fi

# Push to remote
echo "🚀 Pushing to remote repository..."
git push origin main

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "🌊 Next steps for DigitalOcean deployment:"
echo "1. Go to https://cloud.digitalocean.com"
echo "2. Click 'Apps' → 'Create App'"
echo "3. Connect your GitHub repository"
echo "4. Use the configuration from .do/app.yaml"
echo "5. Deploy your app!"
echo ""
echo "📖 For detailed instructions, see DIGITALOCEAN_DEPLOYMENT.md"
echo ""
echo "🎯 Your app will be available at: https://litterly-waste-classification.ondigitalocean.app"
