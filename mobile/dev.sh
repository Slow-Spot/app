#!/bin/bash

# Slow Spot - Development Script
# Prosty skrypt do uruchamiania aplikacji

echo "🔷 Slow Spot Dev Script"
echo "======================="

# Funkcja czyszczenia
cleanup() {
    echo "🧹 Czyszczenie procesów..."
    killall -9 node 2>/dev/null
    killall -9 Simulator 2>/dev/null
    sleep 2
    echo "✅ Procesy wyczyszczone"
}

# Funkcja uruchamiania
start() {
    echo "🚀 Uruchamianie Expo..."
    npx expo start --clear
}

# Funkcja uruchamiania z iOS
start_ios() {
    echo "🚀 Uruchamianie Expo z iOS Simulator..."
    npx expo start --clear --ios
}

# Sprawdź argument
case "${1}" in
    clean)
        cleanup
        ;;
    ios)
        cleanup
        start_ios
        ;;
    *)
        cleanup
        start
        ;;
esac
