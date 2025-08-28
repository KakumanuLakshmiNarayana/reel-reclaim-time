#!/bin/bash

# FocusGuard Development Setup Script
echo "🧠 Setting up FocusGuard development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "📥 Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required (current: $(node -v))"
    echo "📥 Please upgrade Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Capacitor CLI is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not available"
    exit 1
fi

# Install Capacitor CLI globally if not present
if ! npx cap --version &> /dev/null; then
    echo "📱 Installing Capacitor CLI..."
    npm install -g @capacitor/cli
fi

echo "✅ Capacitor CLI installed"

# Add Android platform if not present
if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
fi

# Add iOS platform if on macOS
if [[ "$OSTYPE" == "darwin"* ]] && [ ! -d "ios" ]; then
    echo "🍎 Adding iOS platform..."
    npx cap add ios
fi

# Sync project
echo "🔄 Syncing project with Capacitor..."
npx cap sync

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Available commands:"
echo "   npm run dev          - Start development server"
echo "   npm run build        - Build for production"
echo "   npm run lint         - Run linting"
echo "   ./scripts/build-android.sh - Build and open Android Studio"
echo ""
echo "📱 Mobile development:"
echo "   npx cap open android - Open in Android Studio"
echo "   npx cap open ios     - Open in Xcode (macOS only)"
echo ""
echo "🌐 Web development:"
echo "   npm run dev          - Start dev server at http://localhost:5173"
echo ""
echo "🚀 Happy coding! 🧠"