#!/bin/bash
# Generate App Store screenshots for all required device sizes
# Usage: ./scripts/generate-screenshots.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$PROJECT_DIR/store/screenshots/ios"
LOCALES=("en-US" "pl" "de-DE" "es-ES" "fr-FR" "zh-Hans" "hi")

# Device configurations
# Format: "folder_name:width:height"
IPHONE_65="iPhone 6.5:1284:2778"
IPHONE_67="iPhone 6.7:1290:2796"
IPAD_13="iPad Pro (12.9-inch) (3rd generation):2064:2752"

echo "📱 App Store Screenshot Generator"
echo "=================================="
echo ""

# Function to resize screenshots
resize_screenshots() {
    local source_folder="$1"
    local target_folder="$2"
    local target_width="$3"
    local target_height="$4"

    if [ ! -d "$source_folder" ]; then
        echo "  ⚠️  Source folder not found: $source_folder"
        return
    fi

    mkdir -p "$target_folder"

    for img in "$source_folder"/*.png; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            target_path="$target_folder/$filename"

            # Resize using sips
            cp "$img" "$target_path"
            sips -z "$target_height" "$target_width" "$target_path" > /dev/null 2>&1
            echo "    ✓ $filename → ${target_width}x${target_height}"
        fi
    done
}

# Function to take iPad screenshots using simulator
take_ipad_screenshots() {
    local locale="$1"
    local target_folder="$2"

    echo "  📸 Taking iPad screenshots for $locale..."
    echo "     (This requires the app to be running in simulator)"

    # Boot iPad Pro 13-inch simulator
    IPAD_UDID=$(xcrun simctl list devices available | grep "iPad Pro 13-inch (M4)" | head -1 | grep -oE "[A-F0-9-]{36}")

    if [ -z "$IPAD_UDID" ]; then
        echo "  ⚠️  iPad Pro 13-inch simulator not found"
        return 1
    fi

    echo "     Using iPad: $IPAD_UDID"

    # Boot if not running
    xcrun simctl boot "$IPAD_UDID" 2>/dev/null || true

    # Wait for boot
    sleep 3

    mkdir -p "$target_folder"

    echo ""
    echo "  ⚡ Simulator is ready!"
    echo "  📌 Please:"
    echo "     1. Open Simulator.app"
    echo "     2. Run the app: npx expo start --ios --simulator \"iPad Pro 13-inch (M4)\""
    echo "     3. Navigate to each screen and take screenshots manually"
    echo "        (Cmd+S in Simulator to save screenshot to Desktop)"
    echo "     4. Move screenshots to: $target_folder"
    echo ""
}

# Main execution
echo "Step 1: Generating iPhone 6.5\" screenshots (resized from 6.7\")"
echo "================================================================"

for locale in "${LOCALES[@]}"; do
    echo ""
    echo "🌍 Processing $locale..."

    source_67="$SCREENSHOTS_DIR/$locale/iPhone 6.7"
    source_65="$SCREENSHOTS_DIR/$locale/iPhone 6.5"
    target_65="$SCREENSHOTS_DIR/$locale/iPhone 6.5"

    # Use 6.7" as source if 6.5" doesn't exist or is same size
    if [ -d "$source_67" ]; then
        echo "  Resizing from iPhone 6.7\" → iPhone 6.5\"..."
        resize_screenshots "$source_67" "$target_65" 1284 2778
    elif [ -d "$source_65" ]; then
        # Check if 6.5" needs resizing
        first_img=$(ls "$source_65"/*.png 2>/dev/null | head -1)
        if [ -f "$first_img" ]; then
            width=$(sips -g pixelWidth "$first_img" | tail -1 | awk '{print $2}')
            if [ "$width" != "1284" ]; then
                echo "  Resizing iPhone 6.5\" to correct dimensions..."
                resize_screenshots "$source_65" "$target_65" 1284 2778
            else
                echo "  ✓ iPhone 6.5\" already correct size"
            fi
        fi
    else
        echo "  ⚠️  No source screenshots found"
    fi
done

echo ""
echo "Step 2: iPad Pro 13\" Screenshots"
echo "================================="
echo ""
echo "⚠️  iPad screenshots need to be taken manually on simulator."
echo ""

for locale in "${LOCALES[@]}"; do
    target_ipad="$SCREENSHOTS_DIR/$locale/iPad Pro (12.9-inch) (3rd generation)"

    if [ -d "$target_ipad" ] && [ "$(ls -A "$target_ipad" 2>/dev/null)" ]; then
        echo "✓ $locale: iPad screenshots exist"
    else
        echo "✗ $locale: iPad screenshots missing → $target_ipad"
    fi
done

echo ""
echo "To take iPad screenshots:"
echo "1. Run: open -a Simulator"
echo "2. Select iPad Pro 13-inch (M4) from File → Open Simulator"
echo "3. Run: cd mobile && npx expo start"
echo "4. Press 'i' to open in iOS simulator"
echo "5. Take screenshots with Cmd+S"
echo "6. Save to: store/screenshots/ios/{locale}/iPad Pro (12.9-inch) (3rd generation)/"
echo ""
echo "Screenshot names should be: 01_home.png, 02_meditation.png, etc."
echo ""
echo "✅ Done! Run 'bundle exec fastlane ios upload_metadata' when ready."
