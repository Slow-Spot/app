#!/bin/zsh
# Automated App Store screenshot generation
# Usage: ./scripts/auto-screenshots.sh [locale] [device]
#
# Examples:
#   ./scripts/auto-screenshots.sh en-US iphone    # iPhone screenshots for English
#   ./scripts/auto-screenshots.sh pl ipad         # iPad screenshots for Polish
#   ./scripts/auto-screenshots.sh --interactive   # Interactive mode

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$PROJECT_DIR/store/screenshots/ios"

# Device configurations
IPHONE_NAME="iPhone 16 Pro Max"
IPAD_NAME="iPad Pro 13-inch (M4)"

# Screen names
SCREENS=("home" "meditation" "quotes" "settings")

# All supported locales
LOCALES=("en-US" "pl" "de-DE" "es-ES" "fr-FR" "zh-Hans" "hi")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo "${BLUE}║    📱 Slow Spot - Automated Screenshot Generator          ║${NC}"
echo "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get simulator UDID
get_udid() {
    local name="$1"
    xcrun simctl list devices available | grep "$name" | head -1 | grep -oE "[A-F0-9-]{36}" || echo ""
}

# Boot simulator if not running
boot_simulator() {
    local udid="$1"
    local name="$2"

    local state=$(xcrun simctl list devices | grep "$udid" | grep -o "(Booted)" || echo "")

    if [[ -z "$state" ]]; then
        echo "${YELLOW}⏳ Booting $name...${NC}"
        xcrun simctl boot "$udid" 2>/dev/null || true
        sleep 5
        # Open Simulator app
        open -a Simulator
        sleep 3
    fi

    echo "${GREEN}✓ $name is ready${NC}"
}

# Take screenshot with simctl
take_screenshot() {
    local udid="$1"
    local output_path="$2"

    mkdir -p "$(dirname "$output_path")"
    xcrun simctl io "$udid" screenshot "$output_path" 2>/dev/null
    echo "${GREEN}  ✓ Saved: $(basename "$output_path")${NC}"
}

# Manual screenshot capture
manual_screenshots() {
    local udid="$1"
    local device_folder="$2"
    local locale="$3"
    local output_dir="$SCREENSHOTS_DIR/$locale/$device_folder"

    mkdir -p "$output_dir"

    echo ""
    echo "${CYAN}📸 Screenshot capture for: $locale - $device_folder${NC}"
    echo ""

    local screen_labels=("Home/Timer" "Meditation/Sessions" "Quotes/Inspirations" "Settings")

    for i in {1..4}; do
        local idx=$((i-1))
        local screen="${SCREENS[$idx+1]}"
        local label="${screen_labels[$idx+1]}"
        local filename=$(printf "%02d_%s.png" "$i" "$screen")

        echo "${YELLOW}📍 Screen $i: $label${NC}"
        echo "   Navigate to this screen in the simulator"
        read "?   Press Enter when ready to capture..."

        take_screenshot "$udid" "$output_dir/$filename"
    done

    echo ""
    echo "${GREEN}✅ Completed $locale - $device_folder${NC}"
}

# Process screenshots for a locale and device
process_locale_device() {
    local locale="$1"
    local device_type="$2"

    local device_name device_folder udid

    if [[ "$device_type" == "iphone" ]]; then
        device_name="$IPHONE_NAME"
        device_folder="iPhone 6.7"
    else
        device_name="$IPAD_NAME"
        device_folder="iPad Pro (12.9-inch) (3rd generation)"
    fi

    udid=$(get_udid "$device_name")

    if [[ -z "$udid" ]]; then
        echo "${RED}❌ $device_name simulator not found${NC}"
        return 1
    fi

    echo ""
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${BLUE}📱 Processing: $locale - $device_type${NC}"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    boot_simulator "$udid" "$device_name"

    manual_screenshots "$udid" "$device_folder" "$locale"
}

# Generate iPhone 6.5" from 6.7"
generate_65_from_67() {
    echo ""
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${BLUE}📐 Generating iPhone 6.5\" screenshots from 6.7\"${NC}"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    for locale in "${LOCALES[@]}"; do
        local source_dir="$SCREENSHOTS_DIR/$locale/iPhone 6.7"
        local target_dir="$SCREENSHOTS_DIR/$locale/iPhone 6.5"

        if [[ ! -d "$source_dir" ]]; then
            echo "${YELLOW}  ⚠️ $locale: No iPhone 6.7\" source${NC}"
            continue
        fi

        mkdir -p "$target_dir"

        for img in "$source_dir"/*.png(N); do
            if [[ -f "$img" ]]; then
                local filename=$(basename "$img")
                local target_path="$target_dir/$filename"

                cp "$img" "$target_path"
                sips -z 2778 1284 "$target_path" > /dev/null 2>&1
                echo "${GREEN}  ✓ $locale: $filename → iPhone 6.5\"${NC}"
            fi
        done
    done
}

# Show current status
show_status() {
    echo ""
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "${BLUE}📊 Screenshot Status${NC}"
    echo "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    printf "%-10s | %-12s | %-12s | %-12s\n" "Locale" "iPhone 6.7\"" "iPhone 6.5\"" "iPad 12.9\""
    echo "-----------|--------------|--------------|-------------"

    for locale in "${LOCALES[@]}"; do
        local iphone67=$(find "$SCREENSHOTS_DIR/$locale/iPhone 6.7" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
        local iphone65=$(find "$SCREENSHOTS_DIR/$locale/iPhone 6.5" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')
        local ipad=$(find "$SCREENSHOTS_DIR/$locale/iPad Pro (12.9-inch) (3rd generation)" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')

        local status67=$([[ $iphone67 -ge 4 ]] && echo "✓ $iphone67/4" || echo "✗ $iphone67/4")
        local status65=$([[ $iphone65 -ge 4 ]] && echo "✓ $iphone65/4" || echo "✗ $iphone65/4")
        local statusipad=$([[ $ipad -ge 4 ]] && echo "✓ $ipad/4" || echo "✗ $ipad/4")

        printf "%-10s | %-12s | %-12s | %-12s\n" "$locale" "$status67" "$status65" "$statusipad"
    done
}

# Interactive mode
interactive_mode() {
    echo "${CYAN}🎯 Interactive Screenshot Mode${NC}"
    echo ""

    echo "Select locale:"
    local i=1
    for locale in "${LOCALES[@]}"; do
        echo "  $i) $locale"
        ((i++))
    done
    echo "  $i) All locales"
    echo ""
    read "locale_choice?Enter choice (1-$i): "

    local selected_locale
    if [[ "$locale_choice" == "$i" ]]; then
        selected_locale="all"
    else
        selected_locale="${LOCALES[$locale_choice]}"
    fi

    echo ""
    echo "Select device:"
    echo "  1) iPhone (6.7\")"
    echo "  2) iPad (12.9\")"
    echo "  3) Both"
    echo ""
    read "device_choice?Enter choice (1-3): "

    local device
    case "$device_choice" in
        1) device="iphone" ;;
        2) device="ipad" ;;
        3) device="both" ;;
        *) device="both" ;;
    esac

    local process_locales=()
    if [[ "$selected_locale" == "all" ]]; then
        process_locales=("${LOCALES[@]}")
    else
        process_locales=("$selected_locale")
    fi

    echo ""
    echo "${YELLOW}⚠️  Before starting:${NC}"
    echo "1. Make sure Expo dev server is running: cd mobile && npx expo start"
    echo "2. The simulator will be booted automatically"
    echo "3. Load the app in the simulator (press 'i' in Expo)"
    echo ""
    read "?Press Enter when the app is running..."

    for current_locale in "${process_locales[@]}"; do
        if [[ "$current_locale" != "en-US" ]]; then
            echo ""
            echo "${YELLOW}🌍 Change simulator language to: $current_locale${NC}"
            echo "   Settings → General → Language & Region → Add Language"
            read "?   Press Enter when language is changed and app restarted..."
        fi

        if [[ "$device" == "iphone" ]] || [[ "$device" == "both" ]]; then
            process_locale_device "$current_locale" "iphone"
        fi

        if [[ "$device" == "ipad" ]] || [[ "$device" == "both" ]]; then
            process_locale_device "$current_locale" "ipad"
        fi
    done

    # Generate 6.5" screenshots
    if [[ "$device" == "iphone" ]] || [[ "$device" == "both" ]]; then
        generate_65_from_67
    fi

    show_status
}

# Main
case "${1:-}" in
    --status|-s)
        show_status
        ;;
    --help|-h)
        echo "Usage: $0 [options] [locale] [device]"
        echo ""
        echo "Options:"
        echo "  --interactive, -i   Interactive mode (recommended)"
        echo "  --status, -s        Show screenshot status"
        echo "  --generate-65       Generate 6.5\" from 6.7\""
        echo "  --help, -h          Show this help"
        echo ""
        echo "Quick mode:"
        echo "  $0 en-US iphone     Take iPhone screenshots for English"
        echo "  $0 pl ipad          Take iPad screenshots for Polish"
        echo ""
        echo "Locales: ${LOCALES[*]}"
        echo "Devices: iphone, ipad, both"
        ;;
    --generate-65)
        generate_65_from_67
        ;;
    --interactive|-i|"")
        interactive_mode
        ;;
    *)
        locale="$1"
        device="${2:-both}"

        if [[ "$locale" == "all" ]]; then
            for l in "${LOCALES[@]}"; do
                if [[ "$device" == "iphone" ]] || [[ "$device" == "both" ]]; then
                    process_locale_device "$l" "iphone"
                fi
                if [[ "$device" == "ipad" ]] || [[ "$device" == "both" ]]; then
                    process_locale_device "$l" "ipad"
                fi
            done
            generate_65_from_67
        else
            if [[ "$device" == "iphone" ]] || [[ "$device" == "both" ]]; then
                process_locale_device "$locale" "iphone"
            fi
            if [[ "$device" == "ipad" ]] || [[ "$device" == "both" ]]; then
                process_locale_device "$locale" "ipad"
            fi
            if [[ "$device" == "iphone" ]] || [[ "$device" == "both" ]]; then
                generate_65_from_67
            fi
        fi

        show_status
        ;;
esac

echo ""
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo "${GREEN}📱 Screenshot process complete!${NC}"
echo "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "1. Review screenshots in: store/screenshots/ios/"
echo "2. Run: node scripts/generate-ios-metadata.js"
echo "3. Run: cd fastlane && bundle exec fastlane ios upload_metadata"
