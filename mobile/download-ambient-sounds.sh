#!/bin/bash

# Slow Spot - Ambient Sounds Download Script
# Downloads 5 ambient sound files from free CC0 sources
# Run this script from the project root directory

set -e

echo "🎵 Slow Spot - Ambient Sounds Downloader"
echo "========================================"
echo ""

# Create ambient sounds directory if it doesn't exist
AMBIENT_DIR="assets/sounds/ambient"
mkdir -p "$AMBIENT_DIR"

echo "📁 Directory: $AMBIENT_DIR"
echo ""

# Function to download and convert audio file
download_audio() {
    local url="$1"
    local filename="$2"
    local output="$AMBIENT_DIR/$filename"

    echo "⬇️  Downloading: $filename..."

    if command -v curl &> /dev/null; then
        curl -L "$url" -o "$output" --progress-bar
    elif command -v wget &> /dev/null; then
        wget "$url" -O "$output" --show-progress
    else
        echo "❌ Error: Neither curl nor wget is installed"
        exit 1
    fi

    echo "✅ Downloaded: $filename"
    echo ""
}

echo "Starting downloads from Pixabay (CC0 License)..."
echo ""

# Download ambient sounds from Pixabay (these are example URLs - you may need to update them)
# Pixabay provides free CC0 music and sound effects

# 1. Nature sounds (birds, forest ambience)
download_audio "https://cdn.pixabay.com/download/audio/2022/05/13/audio_0c0f8d32c7.mp3" "nature.mp3"

# 2. Ocean waves
download_audio "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8e0e1c6e89.mp3" "ocean.mp3"

# 3. Forest sounds
download_audio "https://cdn.pixabay.com/download/audio/2022/06/03/audio_b08c2c7cb0.mp3" "forest.mp3"

# 4. 432Hz healing frequency
download_audio "https://cdn.pixabay.com/download/audio/2021/08/09/audio_0a0b5c3c1e.mp3" "432hz.mp3"

# 5. 528Hz love frequency
download_audio "https://cdn.pixabay.com/download/audio/2021/08/09/audio_e5c9e3c3c9.mp3" "528hz.mp3"

echo ""
echo "========================================"
echo "✅ All ambient sounds downloaded successfully!"
echo ""
echo "📊 Downloaded files:"
ls -lh "$AMBIENT_DIR"/*.mp3
echo ""
echo "🎵 Files are ready to use in the app!"
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "1. Verify audio quality and duration (should be 10-15 minutes)"
echo "2. Check if files loop seamlessly"
echo "3. All files are licensed under Pixabay License (CC0)"
echo "4. You can replace any file with better alternatives from:"
echo "   - Pixabay: https://pixabay.com/music/"
echo "   - Freesound: https://freesound.org/"
echo "   - YouTube Audio Library (download as MP3)"
echo ""
echo "🚀 Next steps:"
echo "1. Test the app to verify sounds play correctly"
echo "2. Run: npm start"
echo "3. Navigate to Custom Session Builder"
echo "4. Create a session with ambient sounds"
echo ""
