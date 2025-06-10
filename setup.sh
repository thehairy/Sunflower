#!/bin/bash

# Discord Bot Setup Script
# This script installs dependencies and creates the .env file

set -e  # Exit on any error

echo "🌻 Welcome to the Sunflower Discord Bot Setup!"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Your existing .env file was not modified."
        exit 0
    fi
fi

echo "🔧 Creating .env file..."
echo "Please provide the following information:"
echo ""

# Function to read input with default value
read_with_default() {
    local prompt="$1"
    local default="$2"
    local value
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " value
        echo "${value:-$default}"
    else
        read -p "$prompt: " value
        echo "$value"
    fi
}

# Collect Discord bot information
echo "📋 Discord Bot Configuration"
echo "----------------------------"

DISCORD_TOKEN=$(read_with_default "Discord Bot Token" "")
while [ -z "$DISCORD_TOKEN" ]; do
    echo "❌ Discord Bot Token is required!"
    DISCORD_TOKEN=$(read_with_default "Discord Bot Token" "")
done

CLIENT_ID=$(read_with_default "Client ID (Application ID)" "")
while [ -z "$CLIENT_ID" ]; do
    echo "❌ Client ID is required!"
    CLIENT_ID=$(read_with_default "Client ID (Application ID)" "")
done

GUILD_ID=$(read_with_default "Guild ID (Server ID, optional for global commands)" "")

echo ""
echo "⚙️  Bot Configuration"
echo "--------------------"

PREFIX=$(read_with_default "Command Prefix" "!")
TARGET_PHRASE=$(read_with_default "Target Phrase to track" "verified")
TARGET_EMOJI=$(read_with_default "Target Emoji for reactions" "✅")
TARGET_CHANNEL_ID=$(read_with_default "Target Channel ID (optional)" "")
TARGET_ROLE_ID=$(read_with_default "Target Role ID (optional)" "")
EXCLUDED_ROLE_IDS=$(read_with_default "Excluded Role IDs (comma-separated, optional)" "")
NEW_NICKNAME=$(read_with_default "New Nickname for verified members" "Verified Member")

# Create .env file
cat > .env << EOF
# Discord Bot Configuration
DISCORD_TOKEN=$DISCORD_TOKEN
CLIENT_ID=$CLIENT_ID
GUILD_ID=$GUILD_ID

# Bot Configuration
PREFIX=$PREFIX
TARGET_PHRASE=$TARGET_PHRASE
TARGET_EMOJI=$TARGET_EMOJI
TARGET_CHANNEL_ID=$TARGET_CHANNEL_ID
TARGET_ROLE_ID=$TARGET_ROLE_ID
EXCLUDED_ROLE_IDS=$EXCLUDED_ROLE_IDS
NEW_NICKNAME=$NEW_NICKNAME
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""

# Initialize database
echo "🗄️  Initializing database..."
if [ -f "database/init.js" ]; then
    node database/init.js
    if [ $? -eq 0 ]; then
        echo "✅ Database initialized successfully!"
    else
        echo "⚠️  Database initialization failed, but continuing..."
    fi
else
    echo "⚠️  Database initialization script not found, skipping..."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Deploy slash commands: npm run deploy"
echo "2. Start the bot: npm start"
echo ""
echo "📝 Configuration saved to .env file"
echo "📚 For more information, check the README.md file"
echo ""
echo "🌻 Happy botting!"
