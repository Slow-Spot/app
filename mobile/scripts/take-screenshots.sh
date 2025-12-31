#!/bin/bash
# Take App Store screenshots on iOS simulators
# Usage: ./scripts/take-screenshots.sh [locale] [device] [screen_name]
#
# Examples:
#   ./scripts/take-screenshots.sh en-US iphone home     # Take iPhone screenshot
#   ./scripts/take-screenshots.sh pl ipad meditation    # Take iPad screenshot
#   ./scripts/take-screenshots.sh --interactive         # Interactive mode

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$PROJECT_DIR/store/screenshots/ios"
FASTLANE_SCREENSHOTS_DIR="$PROJECT_DIR/fastlane/screenshots"

# Device configurations - REAL devices, NO scaling!
# iPhone 6.7" = 1290x2796 (iPhone 16 Pro Max)
# iPhone 6.5" = 1284x2778 (iPhone 11 Pro Max)
# iPad 12.9"  = 2048x2732 or 2064x2752 (iPad Pro 13")
IPHONE_67_NAME="iPhone 16 Pro Max"
IPHONE_65_NAME="iPhone 11 Pro Max Screenshots"
IPAD_NAME="iPad Pro 13-inch (M4)"

# Screen names and their order
SCREENS=("home" "meditation" "quotes" "settings")

# Locales
LOCALES=("en-US" "pl" "de-DE" "es-ES" "fr-FR" "zh-Hans" "hi")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📱 Slow Spot Screenshot Tool${NC}"
echo "=============================="
echo ""

# Function to get simulator UDID by name
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
        sleep 3
    fi

    echo -e "${GREEN}✓ $name is running${NC}"
}

# Function to take screenshot
take_screenshot() {
    local udid="$1"
    local output_path="$2"

    xcrun simctl io "$udid" screenshot "$output_path"
    echo -e "${GREEN}  ✓ Saved: $(basename "$output_path")${NC}"
}

# Function to show status
show_status() {
    echo -e "\n${BLUE}📊 Current Screenshot Status:${NC}"
    echo ""

    for locale in "${LOCALES[@]}"; do
        echo -e "${YELLOW}$locale:${NC}"

        # iPhone 6.7"
        local iphone_count=$(ls "$SCREENSHOTS_DIR/$locale/iPhone 6.7/"*.png 2>/dev/null | wc -l | tr -d ' ')
        if [ "$iphone_count" -ge 4 ]; then
            echo -e "  ${GREEN}✓ iPhone 6.7\" ($iphone_count screenshots)${NC}"
        else
            echo -e "  ${RED}✗ iPhone 6.7\" ($iphone_count/4 screenshots)${NC}"
        fi

        # iPhone 6.5"
        local iphone65_count=$(ls "$SCREENSHOTS_DIR/$locale/iPhone 6.5/"*.png 2>/dev/null | wc -l | tr -d ' ')
        if [ "$iphone65_count" -ge 4 ]; then
            echo -e "  ${GREEN}✓ iPhone 6.5\" ($iphone65_count screenshots)${NC}"
        else
            echo -e "  ${RED}✗ iPhone 6.5\" ($iphone65_count/4 screenshots)${NC}"
        fi

        # iPad Pro 12.9"
        local ipad_count=$(ls "$SCREENSHOTS_DIR/$locale/iPad Pro (12.9-inch) (3rd generation)/"*.png 2>/dev/null | wc -l | tr -d ' ')
        if [ "$ipad_count" -ge 4 ]; then
            echo -e "  ${GREEN}✓ iPad Pro 12.9\" ($ipad_count screenshots)${NC}"
        else
            echo -e "  ${RED}✗ iPad Pro 12.9\" ($ipad_count/4 screenshots)${NC}"
        fi
    done
}

# Function for interactive mode
interactive_mode() {
    echo -e "${BLUE}🎯 Interactive Screenshot Mode - REAL Screenshots${NC}"
    echo -e "${RED}⚠️  NO SCALING - Screenshots from real device simulators only!${NC}"
    echo ""

    # Select locale
    echo "Select locale:"
    select locale in "${LOCALES[@]}" "All locales"; do
        if [ -n "$locale" ]; then
            break
        fi
    done

    # Select device
    echo ""
    echo "Select device:"
    select device in "iPhone 6.7\" (16 Pro Max)" "iPhone 6.5\" (11 Pro Max)" "iPad (13\")" "All devices"; do
        if [ -n "$device" ]; then
            break
        fi
    done

    # Get UDIDs for all devices
    local iphone_67_udid=$(get_udid "$IPHONE_67_NAME")
    local iphone_65_udid=$(get_udid "$IPHONE_65_NAME")
    local ipad_udid=$(get_udid "$IPAD_NAME")

    # Boot selected devices
    if [[ "$device" == *"6.7"* ]] || [[ "$device" == "All devices" ]]; then
        if [ -z "$iphone_67_udid" ]; then
            echo -e "${RED}❌ $IPHONE_67_NAME simulator not found${NC}"
            exit 1
        fi
        boot_simulator "$iphone_67_udid" "$IPHONE_67_NAME"
    fi

    if [[ "$device" == *"6.5"* ]] || [[ "$device" == "All devices" ]]; then
        if [ -z "$iphone_65_udid" ]; then
            echo -e "${RED}❌ $IPHONE_65_NAME simulator not found${NC}"
            echo -e "${YELLOW}Create it with: xcrun simctl create \"iPhone 11 Pro Max Screenshots\" \"com.apple.CoreSimulator.SimDeviceType.iPhone-11-Pro-Max\" \"com.apple.CoreSimulator.SimRuntime.iOS-18-4\"${NC}"
            exit 1
        fi
        boot_simulator "$iphone_65_udid" "$IPHONE_65_NAME"
    fi

    if [[ "$device" == *"iPad"* ]] || [[ "$device" == "All devices" ]]; then
        if [ -z "$ipad_udid" ]; then
            echo -e "${RED}❌ $IPAD_NAME simulator not found${NC}"
            exit 1
        fi
        boot_simulator "$ipad_udid" "$IPAD_NAME"
    fi

    echo ""
    echo -e "${YELLOW}📌 Instructions:${NC}"
    echo "1. Open Simulator.app"
    echo "2. Run: cd mobile && npx expo start --ios"
    echo "3. Press 'i' to open in the booted simulator(s)"
    echo "4. Navigate to each screen and press Enter when ready"
    echo ""
    echo -e "${RED}IMPORTANT: Each device gets REAL screenshots - NO scaling!${NC}"
    echo ""

    read -p "Press Enter when the app is running on all devices..."

    # Determine locales to process
    local process_locales=("$locale")
    if [ "$locale" == "All locales" ]; then
        process_locales=("${LOCALES[@]}")
    fi

    for current_locale in "${process_locales[@]}"; do
        echo ""
        echo -e "${BLUE}🌍 Taking screenshots for: $current_locale${NC}"

        if [ "$current_locale" != "en-US" ]; then
            echo -e "${YELLOW}⚠️  Change device language to $current_locale in Settings on ALL devices${NC}"
            read -p "Press Enter when language is changed..."
        fi

        for i in "${!SCREENS[@]}"; do
            screen="${SCREENS[$i]}"
            num=$((i + 1))
            filename=$(printf "%02d_%s.png" "$num" "$screen")

            echo ""
            echo -e "${YELLOW}📸 Screen $num: $screen${NC}"
            echo "   Navigate to the $screen screen on ALL devices"
            read -p "   Press Enter to capture from all devices..."

            # Take iPhone 6.7" screenshot
            if [[ "$device" == *"6.7"* ]] || [[ "$device" == "All devices" ]]; then
                local iphone_67_path="$SCREENSHOTS_DIR/$current_locale/iPhone 6.7/$filename"
                mkdir -p "$(dirname "$iphone_67_path")"
                take_screenshot "$iphone_67_udid" "$iphone_67_path"
            fi

            # Take iPhone 6.5" screenshot - REAL, not scaled!
            if [[ "$device" == *"6.5"* ]] || [[ "$device" == "All devices" ]]; then
                local iphone_65_path="$SCREENSHOTS_DIR/$current_locale/iPhone 6.5/$filename"
                mkdir -p "$(dirname "$iphone_65_path")"
                take_screenshot "$iphone_65_udid" "$iphone_65_path"
            fi

            # Take iPad screenshot
            if [[ "$device" == *"iPad"* ]] || [[ "$device" == "All devices" ]]; then
                local ipad_path="$SCREENSHOTS_DIR/$current_locale/iPad Pro (12.9-inch) (3rd generation)/$filename"
                mkdir -p "$(dirname "$ipad_path")"
                take_screenshot "$ipad_udid" "$ipad_path"
            fi
        done

        echo ""
        echo -e "${GREEN}✅ Completed screenshots for $current_locale${NC}"
    done

    echo ""
    echo -e "${GREEN}✅ All screenshots captured from REAL devices!${NC}"
    echo -e "${YELLOW}No scaling applied - ready for App Store submission.${NC}"
}

# Quick screenshot mode
quick_screenshot() {
    local locale="$1"
    local device_type="$2"
    local screen_name="$3"

    local device_name device_folder udid

    case "$device_type" in
        iphone67|iphone)
            device_name="$IPHONE_67_NAME"
            device_folder="iPhone 6.7"
            ;;
        iphone65)
            device_name="$IPHONE_65_NAME"
            device_folder="iPhone 6.5"
            ;;
        ipad)
            device_name="$IPAD_NAME"
            device_folder="iPad Pro (12.9-inch) (3rd generation)"
            ;;
        *)
            echo -e "${RED}❌ Unknown device type: $device_type${NC}"
            echo "Available: iphone67, iphone65, ipad"
            exit 1
            ;;
    esac

    udid=$(get_udid "$device_name")

    if [ -z "$udid" ]; then
        echo -e "${RED}❌ $device_name simulator not found${NC}"
        exit 1
    fi

    boot_simulator "$udid" "$device_name"

    # Find screen index
    local index=0
    for i in "${!SCREENS[@]}"; do
        if [ "${SCREENS[$i]}" == "$screen_name" ]; then
            index=$((i + 1))
            break
        fi
    done

    if [ "$index" -eq 0 ]; then
        echo -e "${RED}❌ Unknown screen: $screen_name${NC}"
        echo "Available screens: ${SCREENS[*]}"
        exit 1
    fi

    local filename=$(printf "%02d_%s.png" "$index" "$screen_name")
    local output_path="$SCREENSHOTS_DIR/$locale/$device_folder/$filename"

    mkdir -p "$(dirname "$output_path")"
    take_screenshot "$udid" "$output_path"
}

# Main
case "${1:-}" in
    --status|-s)
        show_status
        ;;
    --interactive|-i)
        interactive_mode
        ;;
    --help|-h)
        echo "Usage: $0 [options] [locale] [device] [screen]"
        echo ""
        echo "Options:"
        echo "  --interactive, -i   Interactive mode (guided) - RECOMMENDED"
        echo "  --status, -s        Show screenshot status"
        echo "  --help, -h          Show this help"
        echo ""
        echo "Quick mode:"
        echo "  $0 en-US iphone67 home    # Take iPhone 6.7\" home screenshot"
        echo "  $0 en-US iphone65 home    # Take iPhone 6.5\" home screenshot"
        echo "  $0 pl ipad meditation     # Take iPad meditation screenshot"
        echo ""
        echo "Locales: ${LOCALES[*]}"
        echo "Devices: iphone67, iphone65, ipad"
        echo "Screens: ${SCREENS[*]}"
        echo ""
        echo -e "\033[1;31mIMPORTANT: All screenshots are taken from REAL simulators.${NC}"
        echo "NO scaling or stretching - each device size requires its own simulator!"
        ;;
    "")
        interactive_mode
        ;;
    *)
        if [ $# -eq 3 ]; then
            quick_screenshot "$1" "$2" "$3"
        else
            echo -e "${RED}❌ Invalid arguments${NC}"
            echo "Usage: $0 [locale] [device] [screen]"
            echo "Or:    $0 --interactive"
            exit 1
        fi
        ;;
esac
