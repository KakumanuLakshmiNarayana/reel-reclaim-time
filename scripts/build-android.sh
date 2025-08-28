#!/bin/bash

# FocusGuard Android Build Script
echo "🧠 Building FocusGuard for Android..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the web app
echo "🔨 Building web app..."
npm run build

# Sync with Capacitor
echo "📱 Syncing with Capacitor..."
npx cap sync android

# Open in Android Studio
echo "🚀 Opening Android Studio..."
npx cap open android

echo "✅ Build complete! Android Studio should now be open."
echo "📋 Next steps:"
echo "   1. Wait for Android Studio to finish syncing"
echo "   2. Connect your Android device or start an emulator"
echo "   3. Click the 'Run' button (green play icon)"
echo "   4. Grant accessibility permissions when prompted"