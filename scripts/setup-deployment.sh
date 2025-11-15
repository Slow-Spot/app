#!/bin/bash

# Setup Deployment Pipelines - Slow Spot App
# Automatycznie konfiguruje wszystko co potrzebne do deployment

set -e

echo "🚀 Setup Deployment Pipelines dla Slow Spot"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "mobile/package.json" ]; then
    echo -e "${RED}❌ Error: Uruchom skrypt z root directory projektu${NC}"
    exit 1
fi

cd mobile

echo "📦 Sprawdzam zależności..."

# Check if expo-cli is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ Node.js nie jest zainstalowany${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js znaleziony${NC}"

# Check if logged in to Expo
echo ""
echo "🔐 Sprawdzam login do Expo..."

if npx expo whoami &> /dev/null; then
    EXPO_USER=$(npx expo whoami 2>/dev/null)
    echo -e "${GREEN}✅ Zalogowany jako: $EXPO_USER${NC}"
else
    echo -e "${YELLOW}⚠️  Nie jesteś zalogowany do Expo${NC}"
    echo "Zaloguj się teraz:"
    npx expo login

    if npx expo whoami &> /dev/null; then
        EXPO_USER=$(npx expo whoami 2>/dev/null)
        echo -e "${GREEN}✅ Zalogowany jako: $EXPO_USER${NC}"
    else
        echo -e "${RED}❌ Login nie powiódł się${NC}"
        exit 1
    fi
fi

# Generate EXPO_TOKEN
echo ""
echo "🔑 Generuję EXPO_TOKEN dla GitHub Actions..."
echo ""
echo -e "${YELLOW}WAŻNE: Skopiuj ten token i dodaj go do GitHub Secrets${NC}"
echo "1. Idź do: GitHub → Settings → Secrets and variables → Actions"
echo "2. Kliknij 'New repository secret'"
echo "3. Name: EXPO_TOKEN"
echo "4. Value: [wklej token poniżej]"
echo ""
echo "Generuję token..."
echo ""

# Create token with error handling
if EXPO_TOKEN=$(npx expo token:create 2>&1); then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}Token (skopiuj to):${NC}"
    echo ""
    echo "$EXPO_TOKEN"
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Nie udało się wygenerować nowego tokena${NC}"
    echo "Możesz spróbować ręcznie: npx expo token:create"
    echo "Lub użyj istniejącego tokena"
fi

# Check EAS project
echo ""
echo "📱 Sprawdzam projekt EAS..."

if grep -q "projectId" app.json; then
    PROJECT_ID=$(grep -o '"projectId": "[^"]*"' app.json | cut -d'"' -f4)
    echo -e "${GREEN}✅ EAS Project ID: $PROJECT_ID${NC}"
else
    echo -e "${YELLOW}⚠️  Brak EAS Project ID${NC}"
    echo "Inicjalizuję projekt EAS..."
    npx eas init
fi

# Verify eas.json
echo ""
echo "⚙️  Sprawdzam konfigurację buildów..."

if [ -f "eas.json" ]; then
    echo -e "${GREEN}✅ eas.json istnieje${NC}"

    # Check if preview profile exists
    if grep -q '"preview"' eas.json; then
        echo -e "${GREEN}✅ Preview profile skonfigurowany${NC}"
    else
        echo -e "${YELLOW}⚠️  Brak preview profile w eas.json${NC}"
    fi
else
    echo -e "${RED}❌ eas.json nie istnieje${NC}"
    echo "Tworzę podstawową konfigurację..."
    npx eas build:configure
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Setup zakończony!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Następne kroki:"
echo ""
echo "1. Dodaj EXPO_TOKEN do GitHub Secrets (instrukcja powyżej)"
echo ""
echo "2. Test lokalny:"
echo "   cd mobile"
echo "   eas build --platform android --profile preview"
echo ""
echo "3. Test automatyczny:"
echo "   git checkout develop"
echo "   git push"
echo "   → GitHub Actions automatycznie zbuduje!"
echo ""
echo "4. Sprawdź buildy:"
echo "   https://expo.dev/accounts/$EXPO_USER/projects/slow-spot/builds"
echo ""
echo "📖 Pełna dokumentacja: ../DEPLOYMENT_PIPELINES.md"
echo ""
