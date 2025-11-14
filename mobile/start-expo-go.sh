#!/bin/bash

# Slow Spot - Start for Expo Go Testing
# This script starts Metro bundler and displays QR code for Expo Go

echo "🚀 Starting Slow Spot for Expo Go..."
echo ""
echo "📱 Make sure you have Expo Go installed:"
echo "   iOS: https://apps.apple.com/app/expo-go/id982107779"
echo "   Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""

# Start Expo with tunnel for external access
npx expo start --tunnel

# The QR code will appear in the terminal
# Scan it with Expo Go app to run the application
