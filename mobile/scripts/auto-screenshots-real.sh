#!/bin/bash
# Automated screenshot capture for App Store - REAL screenshots only, NO scaling
# This script captures screenshots from real device simulators for Apple submission
#
# Requirements:
# - iPhone 16 Pro Max simulator (6.7" - 1290x2796)
# - iPhone 11 Pro Max simulator (6.5" - 1284x2778)
# - iPad Pro 13-inch (M4) simulator (12.9" - 2048x2732)
#
# Usage: ./scripts/auto-screenshots-real.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$PROJECT_DIR/store/screenshots/ios"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Device configurations
IPHONE_67="iPhone 16 Pro Max"
IPHONE_65="iPhone 11 Pro Max Screenshots"
IPAD="iPad Pro 13-inch (M4)"

# Screens to capture
SCREENS=("home" "meditation" "quotes" "settings")

# Locales with their iOS language codes
declare -A LOCALE_MAP=(
    ["en-US"]="en"
    ["pl"]="pl"
    ["de-DE"]="de"
    ["es-ES"]="es"
    ["fr-FR"]="fr"
    ["zh-Hans"]="zh-Hans"
    ["hi"]="hi"
)

LOCALES=("en-US" "pl" "de-DE" "es-ES" "fr-FR" "zh-Hans" "hi")

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    📱 App Store Screenshot Tool - REAL Devices Only         ║${NC}"
echo -e "${BLUE}║    NO SCALING - Each device gets its own screenshots        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to get simulator UDID
get_udid() {
    local name="$1"
    xcrun simctl list devices available | grep "$name" | head -1 | grep -oE "[A-F0-9-]{36}" || echo ""
}

# Function to boot simulator
boot_simulator() {
    local udid="$1"
    local name="$2"

    local state=$(xcrun simctl list devices | grep "$udid" | grep -o "(Booted)" || echo "")

    if [ -z "$state" ]; then
        echo -e "${YELLOW}⏳ Booting $name...${NC}"
        xcrun simctl boot "$udid" 2>/dev/null || true
        sleep 5
    fi
    echo -e "${GREEN}✓ $name ready${NC}"
}

# Function to take screenshot
take_screenshot() {
    local udid="$1"
    local output_path="$2"
    local device_name="$3"

    mkdir -p "$(dirname "$output_path")"
    xcrun simctl io "$udid" screenshot "$output_path" 2>/dev/null

    if [ -f "$output_path" ]; then
        echo -e "  ${GREEN}✓${NC} $device_name: $(basename "$output_path")"
    else
        echo -e "  ${RED}✗${NC} $device_name: Failed"
    fi
}

# Function to capture screenshots for current state
capture_current_screen() {
    local locale="$1"
    local screen_name="$2"
    local screen_num="$3"

    local filename=$(printf "%02d_%s.png" "$screen_num" "$screen_name")

    # iPhone 6.7"
    if [ -n "$IPHONE_67_UDID" ]; then
        take_screenshot "$IPHONE_67_UDID" "$SCREENSHOTS_DIR/$locale/iPhone 6.7/$filename" "iPhone 6.7\""
    fi

    # iPhone 6.5" - REAL, not scaled!
    if [ -n "$IPHONE_65_UDID" ]; then
        take_screenshot "$IPHONE_65_UDID" "$SCREENSHOTS_DIR/$locale/iPhone 6.5/$filename" "iPhone 6.5\""
    fi

    # iPad
    if [ -n "$IPAD_UDID" ]; then
        take_screenshot "$IPAD_UDID" "$SCREENSHOTS_DIR/$locale/iPad Pro (12.9-inch) (3rd generation)/$filename" "iPad 12.9\""
    fi
}

# Main execution
echo -e "${CYAN}Step 1: Preparing simulators${NC}"
echo ""

IPHONE_67_UDID=$(get_udid "$IPHONE_67")
IPHONE_65_UDID=$(get_udid "$IPHONE_65")
IPAD_UDID=$(get_udid "$IPAD")

if [ -z "$IPHONE_67_UDID" ]; then
    echo -e "${RED}❌ $IPHONE_67 not found!${NC}"
    exit 1
fi

if [ -z "$IPHONE_65_UDID" ]; then
    echo -e "${RED}❌ $IPHONE_65 not found!${NC}"
    echo -e "${YELLOW}Create it with:${NC}"
    echo 'xcrun simctl create "iPhone 11 Pro Max Screenshots" "com.apple.CoreSimulator.SimDeviceType.iPhone-11-Pro-Max" "com.apple.CoreSimulator.SimRuntime.iOS-18-4"'
    exit 1
fi

if [ -z "$IPAD_UDID" ]; then
    echo -e "${RED}❌ $IPAD not found!${NC}"
    exit 1
fi

# Boot all simulators
boot_simulator "$IPHONE_67_UDID" "$IPHONE_67"
boot_simulator "$IPHONE_65_UDID" "$IPHONE_65"
boot_simulator "$IPAD_UDID" "$IPAD"

# Open Simulator app
open -a Simulator

echo ""
echo -e "${CYAN}Step 2: App setup${NC}"
echo ""
echo -e "${YELLOW}Please ensure the app is running on ALL THREE simulators:${NC}"
echo "1. Open another terminal"
echo "2. cd mobile && npx expo start"
echo "3. Press 'i' to open in iOS simulators"
echo "4. Make sure app is visible on all 3 devices"
echo ""
read -p "Press Enter when the app is running on all devices..."

echo ""
echo -e "${CYAN}Step 3: Capturing screenshots${NC}"
echo ""

for locale in "${LOCALES[@]}"; do
    echo ""
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}🌍 Locale: $locale${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

    if [ "$locale" != "en-US" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  LANGUAGE CHANGE REQUIRED${NC}"
        echo -e "Change language to ${CYAN}$locale${NC} in Settings on ALL devices:"
        echo "1. Settings → General → Language & Region → iPhone/iPad Language"
        echo "2. Select the language and confirm"
        echo "3. Wait for all devices to restart"
        echo ""
        read -p "Press Enter when language is changed on all 3 devices..."
    fi

    for i in "${!SCREENS[@]}"; do
        screen="${SCREENS[$i]}"
        num=$((i + 1))

        echo ""
        echo -e "${YELLOW}📸 Screen $num/4: $screen${NC}"
        echo "   Navigate to the $screen screen on all 3 devices"
        read -p "   Press Enter to capture..."

        capture_current_screen "$locale" "$screen" "$num"
    done

    echo ""
    echo -e "${GREEN}✅ Completed: $locale${NC}"
done

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║               ✅ ALL SCREENSHOTS CAPTURED!                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Total screenshots: ${#LOCALES[@]} locales × 4 screens × 3 devices = $((${#LOCALES[@]} * 4 * 3)) files"
echo ""
echo "Screenshots saved to: $SCREENSHOTS_DIR"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Verify screenshots look correct"
echo "2. Run: cd fastlane && bundle exec fastlane ios upload_screenshots"
echo "3. Submit for App Store review"
