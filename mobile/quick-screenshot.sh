#!/bin/bash
# Szybki screenshot dla App Store
# Użycie: ./quick-screenshot.sh [ipad|iphone] [1|2|3|4]

DEVICE=${1:-ipad}
SCREEN=${2:-1}

IPHONE_UDID="3CE158E1-3DF7-42E5-951E-3B5DE8263F89"
IPAD_UDID="BFF3F487-F3B8-4A6F-A5AF-CB1A7C970F6B"

SCREENS=("home" "meditation" "quotes" "settings")
SCREEN_NAME=${SCREENS[$((SCREEN-1))]}
FILENAME=$(printf "%02d_%s.png" "$SCREEN" "$SCREEN_NAME")

if [ "$DEVICE" = "iphone" ]; then
    UDID="$IPHONE_UDID"
    FOLDER="iPhone 6.7"
else
    UDID="$IPAD_UDID"
    FOLDER="iPad Pro 13"
fi

OUTPUT="store/screenshots/ios/en-US/$FOLDER/$FILENAME"
mkdir -p "$(dirname "$OUTPUT")"

echo "📸 Robię screenshot: $OUTPUT"
xcrun simctl io "$UDID" screenshot "$OUTPUT"
echo "✅ Zapisano: $OUTPUT"
echo "   Wymiary: $(file "$OUTPUT" | grep -o '[0-9]* x [0-9]*')"
