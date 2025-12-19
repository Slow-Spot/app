#!/bin/bash

# Slow Spot - Development Script
# Skrypt do uruchamiania aplikacji z czyszczeniem cache

echo "🔷 Slow Spot Dev Script"
echo "======================="

# Funkcja pełnego czyszczenia cache
clean_cache() {
    echo "🧹 Czyszczenie cache..."

    # Kill running processes
    killall -9 node 2>/dev/null
    killall -9 Simulator 2>/dev/null

    # Clear Expo cache
    rm -rf .expo 2>/dev/null
    rm -rf node_modules/.cache 2>/dev/null

    # Clear Metro bundler cache
    rm -rf $TMPDIR/metro-* 2>/dev/null
    rm -rf $TMPDIR/haste-map-* 2>/dev/null

    # Clear watchman
    watchman watch-del-all 2>/dev/null

    sleep 2
    echo "✅ Cache wyczyszczony"
}

# Funkcja czyszczenia procesów
cleanup() {
    echo "🧹 Czyszczenie procesów..."
    killall -9 node 2>/dev/null
    # Don't kill Simulator - let Expo manage it
    sleep 1
    echo "✅ Procesy wyczyszczone"
}

# Funkcja sprawdzania czy symulator jest gotowy
wait_for_simulator() {
    echo "📱 Sprawdzanie symulatora iOS..."

    # Uruchom symulator jeśli nie działa
    if ! pgrep -x "Simulator" > /dev/null; then
        echo "🔄 Uruchamianie Symulatora..."
        open -a Simulator
        sleep 5
    fi

    # Poczekaj aż symulator będzie gotowy (max 30 sekund)
    local attempts=0
    local max_attempts=15

    while [ $attempts -lt $max_attempts ]; do
        # Sprawdź czy jakieś urządzenie jest uruchomione
        if xcrun simctl list devices | grep -q "Booted"; then
            echo "✅ Symulator gotowy"
            return 0
        fi

        echo "⏳ Czekam na symulator... ($((attempts + 1))/$max_attempts)"
        sleep 2
        attempts=$((attempts + 1))
    done

    echo "⚠️  Timeout - uruchamiam domyślny symulator..."
    xcrun simctl boot "iPhone 16 Plus" 2>/dev/null || xcrun simctl boot "iPhone 15" 2>/dev/null || true
    sleep 3
}

# Funkcja uruchamiania
start() {
    echo "🚀 Uruchamianie Expo..."
    npx expo start --clear
}

# Funkcja uruchamiania z iOS
start_ios() {
    echo "🚀 Uruchamianie Expo z iOS Simulator..."
    wait_for_simulator
    npx expo start --clear --ios
}

# Funkcja uruchamiania z Android
start_android() {
    echo "🚀 Uruchamianie Expo z Android Emulator..."
    npx expo start --clear --android
}

# Pełne czyszczenie i restart
fresh_start() {
    clean_cache
    echo "🚀 Uruchamianie świeżego Expo..."
    npx expo start --clear
}

# Sprawdź argument
case "${1}" in
    clean)
        clean_cache
        ;;
    ios)
        cleanup
        start_ios
        ;;
    android)
        cleanup
        start_android
        ;;
    fresh)
        fresh_start
        ;;
    *)
        cleanup
        start
        ;;
esac
