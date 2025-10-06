#!/bin/bash

# Budj App - Local Build Script
# This script provides multiple options for building and testing the app locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Budj App - Local Build Script${NC}"
echo "==========================================="

# Function to display usage
show_usage() {
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./scripts/build-local.sh [option]"
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "  dev-android    - Build development APK for Android (installable)"
    echo "  dev-ios        - Build development IPA for iOS (requires macOS)"
    echo "  preview-android- Build preview APK for Android (production-like)"
    echo "  preview-ios    - Build preview IPA for iOS (production-like)"
    echo "  start          - Start development server with QR code"
    echo "  web            - Start web version"
    echo "  clean          - Clean and reinstall dependencies"
    echo "  help           - Show this help message"
    echo ""
    echo -e "${YELLOW}Development Build (Recommended):${NC}"
    echo "  • Includes all native dependencies (maps, gestures, etc.)"
    echo "  • Can be installed directly on device"
    echo "  • Supports hot reloading and debugging"
    echo "  • Perfect for internal testing"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}Checking prerequisites...${NC}"
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    
    # Check if pnpm is available
    if ! command -v pnpm &> /dev/null; then
        echo -e "${YELLOW}⚠️  pnpm not found, using npm instead${NC}"
        PACKAGE_MANAGER="npm"
    else
        PACKAGE_MANAGER="pnpm"
    fi
    
    # Check if Expo CLI is available
    if ! command -v expo &> /dev/null; then
        echo -e "${YELLOW}Installing Expo CLI...${NC}"
        npm install -g expo-cli
    fi
    
    echo -e "${GREEN}✅ Prerequisites checked${NC}"
}

# Function to install/update dependencies
install_dependencies() {
    echo -e "${BLUE}Installing dependencies...${NC}"
    $PACKAGE_MANAGER install
    
    echo -e "${BLUE}Fixing Expo SDK compatibility...${NC}"
    npx expo install --fix
    
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Function to build development version
build_dev_android() {
    echo -e "${BLUE}Building development APK for Android...${NC}"
    echo -e "${YELLOW}This will create an installable APK with all native features${NC}"
    
    # Create local build
    npx eas build --platform android --profile development --local
    
    echo -e "${GREEN}✅ Development build completed!${NC}"
    echo -e "${YELLOW}📱 The APK file will be saved in the current directory${NC}"
    echo -e "${YELLOW}📋 You can install it on your Android device by:${NC}"
    echo "   1. Transfer the APK to your device"
    echo "   2. Enable 'Install unknown apps' in Settings"
    echo "   3. Open the APK file to install"
}

build_dev_ios() {
    echo -e "${BLUE}Building development IPA for iOS...${NC}"
    echo -e "${YELLOW}Note: This requires macOS and Xcode${NC}"
    
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo -e "${RED}❌ iOS builds require macOS${NC}"
        exit 1
    fi
    
    npx eas build --platform ios --profile development --local
    
    echo -e "${GREEN}✅ Development build completed!${NC}"
    echo -e "${YELLOW}📱 Install on device using Xcode or Apple Configurator${NC}"
}

# Function to build preview version (production-like)
build_preview_android() {
    echo -e "${BLUE}Building preview APK for Android...${NC}"
    echo -e "${YELLOW}This creates a production-like build for testing${NC}"
    
    npx eas build --platform android --profile preview --local
    
    echo -e "${GREEN}✅ Preview build completed!${NC}"
}

# Function to start development server
start_dev_server() {
    echo -e "${BLUE}Starting development server...${NC}"
    echo -e "${YELLOW}📱 Scan the QR code with Expo Go or development build${NC}"
    echo -e "${YELLOW}💻 Web version will be available at http://localhost:8081${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    
    $PACKAGE_MANAGER start
}

# Function to start web version
start_web() {
    echo -e "${BLUE}Starting web version...${NC}"
    echo -e "${YELLOW}Opening http://localhost:8081${NC}"
    
    $PACKAGE_MANAGER web
}

# Function to clean project
clean_project() {
    echo -e "${BLUE}Cleaning project...${NC}"
    
    # Remove node_modules
    rm -rf node_modules
    
    # Remove lock files
    rm -f package-lock.json yarn.lock pnpm-lock.yaml
    
    # Clear Expo cache
    npx expo r -c
    
    # Reinstall dependencies
    install_dependencies
    
    echo -e "${GREEN}✅ Project cleaned and dependencies reinstalled${NC}"
}

# Main script logic
case "${1:-help}" in
    "dev-android")
        check_prerequisites
        build_dev_android
        ;;
    "dev-ios")
        check_prerequisites
        build_dev_ios
        ;;
    "preview-android")
        check_prerequisites
        build_preview_android
        ;;
    "preview-ios")
        check_prerequisites
        npx eas build --platform ios --profile preview --local
        ;;
    "start")
        check_prerequisites
        start_dev_server
        ;;
    "web")
        check_prerequisites
        start_web
        ;;
    "clean")
        clean_project
        ;;
    "help"|*)
        show_usage
        ;;
esac