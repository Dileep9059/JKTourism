#!/bin/bash

# Author: Akshay Kumar
# Script to build Spring Boot WAR & React build for production
# Prerequisites:
#   - If you get permission denied error, ensure script is executable
#     by running `chmod +x build.sh`
# Usage:
#   - To make Spring Boot WAR:
#       ./build.sh server staging|prod
#   - To make React build & zip it:
#       ./build.sh client staging|prod
#   - Both together (note that order of arguments does not matter):
#       ./build.sh both staging|prod

set -e  # exit on first error

ARGS="$@"

if [[ $ARGS != *"client"* && $ARGS != *"server"* && $ARGS != *"both"* ]]; then
  echo "❌ Usage: ./build.sh <client|server|both> <staging|prod>"
  echo "   Example: ./build.sh client staging"
  echo "            ./build.sh server prod"
  echo "            ./build.sh both staging"
  exit 1
fi

if [[ $ARGS != *"staging"* && $ARGS != *"prod"* ]]; then
  echo "❌ Must specify environment: staging | prod"
  exit 1
fi

echo "🚀 Starting build with args: $ARGS"

# --- Build Client ---
if [[ $ARGS == *"client"* || $ARGS == *"both"* ]]; then
  echo "📦 Building React client..."
  cd client
  # npm install

  if [[ $ARGS == *"staging"* ]]; then
    npm run build:staging
  else
    npm run build
  fi

  cd ..
  echo "✅ Client build finished $([[ $ARGS == *"staging"* ]] && echo '(staging)' || echo '(prod)')"
fi

# --- Build Server ---
if [[ $ARGS == *"server"* || $ARGS == *"both"* ]]; then
  echo "⚙️  Building Spring Boot server..."
  cd server

  if [[ $ARGS == *"staging"* ]]; then
    mvn clean install -Dspring.profiles.active=staging
  else
    mvn clean install -Dspring.profiles.active=prod
  fi

  cd ..
  echo "✅ Server build finished $([[ $ARGS == *"staging"* ]] && echo '(staging)' || echo '(prod)')"
fi

echo "🎉 Build completed successfully: $ARGS"
