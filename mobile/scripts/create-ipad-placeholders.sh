#!/bin/bash
# Create iPad screenshots from iPhone screenshots (properly scaled with letterboxing)
# This is a temporary workaround until proper iPad screenshots are taken
#
# iPad Pro 13" requires: 2064 x 2752 pixels (portrait)
# iPhone 6.7": 1290 x 2796 pixels
#
# We scale to fit iPad width and add padding (app background color) for height

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SCREENSHOTS_DIR="$PROJECT_DIR/store/screenshots/ios"

LOCALES=("en-US" "pl" "de-DE" "es-ES" "fr-FR" "zh-Hans" "hi")

# iPad Pro 13" dimensions
IPAD_WIDTH=2064
IPAD_HEIGHT=2752

# App background color (purple from app.json splash)
BG_COLOR="#8B5CF6"

echo "📱 Creating iPad screenshots from iPhone screenshots..."
echo ""

# Check if ImageMagick is available
if command -v magick &> /dev/null; then
    USE_MAGICK=true
    echo "Using ImageMagick for high-quality compositing"
elif command -v convert &> /dev/null; then
    USE_MAGICK=true
    MAGICK_CMD="convert"
    echo "Using ImageMagick (legacy) for compositing"
else
    USE_MAGICK=false
    echo "⚠️  ImageMagick not found, using sips (lower quality)"
    echo "   Install with: brew install imagemagick"
fi
echo ""

for locale in "${LOCALES[@]}"; do
    echo "🌍 Processing $locale..."

    SOURCE_DIR="$SCREENSHOTS_DIR/$locale/iPhone 6.7"
    TARGET_DIR="$SCREENSHOTS_DIR/$locale/iPad Pro 13"

    if [ ! -d "$SOURCE_DIR" ]; then
        echo "  ⚠️  No iPhone 6.7 screenshots found"
        continue
    fi

    mkdir -p "$TARGET_DIR"

    for img in "$SOURCE_DIR"/*.png; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            target_path="$TARGET_DIR/$filename"

            if [ "$USE_MAGICK" = true ]; then
                # Create iPad canvas with background color and composite iPhone screenshot centered
                # Scale iPhone to fit iPad width (2064) while maintaining aspect ratio
                # iPhone 6.7": 1290 x 2796 → scaled: 2064 x 4474 (too tall, will be cropped)
                # We scale to fit height instead: 2752 height → width = 1272
                # Then center horizontally on 2064 width canvas

                magick "$img" \
                    -resize x${IPAD_HEIGHT} \
                    -gravity center \
                    -background "$BG_COLOR" \
                    -extent ${IPAD_WIDTH}x${IPAD_HEIGHT} \
                    "$target_path" 2>/dev/null || \
                convert "$img" \
                    -resize x${IPAD_HEIGHT} \
                    -gravity center \
                    -background "$BG_COLOR" \
                    -extent ${IPAD_WIDTH}x${IPAD_HEIGHT} \
                    "$target_path"
            else
                # Fallback: simple resize with sips (distorted but works)
                cp "$img" "$target_path"
                sips -z $IPAD_HEIGHT $IPAD_WIDTH "$target_path" > /dev/null 2>&1
            fi

            echo "  ✓ $filename → ${IPAD_WIDTH}x${IPAD_HEIGHT}"
        fi
    done
done

echo ""
echo "✅ iPad placeholder screenshots created!"
echo ""
if [ "$USE_MAGICK" = true ]; then
    echo "Screenshots were properly scaled and centered with letterboxing."
else
    echo "⚠️  Screenshots were stretched (not ideal)."
    echo "   Install ImageMagick for better results: brew install imagemagick"
fi
echo ""
echo "For best quality, take proper iPad screenshots on simulator:"
echo "   ./scripts/take-screenshots.sh --interactive"
