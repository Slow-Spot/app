#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# local-release.sh -- Lokalny build i/lub submit do App Store / Google Play
#
# Uzycie:
#   ./scripts/local-release.sh <COMMAND> [OPCJE]
#
# Komendy:
#   build       Buduje lokalnie (wymaga Xcode/Android SDK)
#   submit      Submituje do store (z EAS cloud --id lub lokalny plik --path)
#   release     Pelny flow: build + submit
#   status      Sprawdza status buildow na EAS
#
# Opcje:
#   --platform ios|android|all    Platforma (wymagane)
#   --profile  production|preview Profil EAS (domyslnie: production)
#   --build-id <ID>               EAS Build ID do submitu (pomija lokalny build)
#   --path <FILE>                 Sciezka do .ipa/.aab do submitu
#   --no-submit                   Tylko build, bez submitu (alias dla 'build')
#
# Przyklady:
#   ./scripts/local-release.sh build --platform android
#   ./scripts/local-release.sh submit --platform ios --build-id abc-123
#   ./scripts/local-release.sh release --platform all --profile production
#   ./scripts/local-release.sh status
# ---------------------------------------------------------------------------

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $*"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ---------------------------------------------------------------------------
# Parsowanie argumentow
# ---------------------------------------------------------------------------
COMMAND=""
PLATFORM=""
PROFILE="production"
BUILD_ID=""
ARTIFACT_PATH=""

parse_args() {
  if [[ $# -lt 1 ]]; then
    usage
    exit 1
  fi

  COMMAND="$1"
  if [[ "$COMMAND" == "-h" || "$COMMAND" == "--help" ]]; then
    usage
    exit 0
  fi
  shift

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --platform)   PLATFORM="$2"; shift 2 ;;
      --profile)    PROFILE="$2"; shift 2 ;;
      --build-id)   BUILD_ID="$2"; shift 2 ;;
      --path)       ARTIFACT_PATH="$2"; shift 2 ;;
      --no-submit)  COMMAND="build"; shift ;;
      -h|--help)    usage; exit 0 ;;
      *) log_error "Nieznana opcja: $1"; usage; exit 1 ;;
    esac
  done
}

usage() {
  head -28 "${BASH_SOURCE[0]}" | tail -25
}

# ---------------------------------------------------------------------------
# Walidacja srodowiska
# ---------------------------------------------------------------------------
check_eas() {
  if ! command -v eas &>/dev/null; then
    log_error "EAS CLI nie jest zainstalowane. Zainstaluj: npm install -g eas-cli"
    exit 1
  fi
  log_ok "EAS CLI $(eas --version 2>/dev/null | head -1)"
}

check_expo_token() {
  if [[ -z "${EXPO_TOKEN:-}" ]]; then
    if eas whoami &>/dev/null; then
      log_ok "Zalogowany do EAS jako: $(eas whoami 2>/dev/null)"
    else
      log_error "Nie zalogowany do EAS. Uruchom: eas login"
      exit 1
    fi
  else
    log_ok "EXPO_TOKEN ustawiony"
  fi
}

check_ios_tools() {
  if [[ "$PLATFORM" == "ios" || "$PLATFORM" == "all" ]]; then
    if ! command -v xcodebuild &>/dev/null; then
      log_error "Xcode nie jest zainstalowany (wymagany do lokalnego buildu iOS)"
      exit 1
    fi
    log_ok "Xcode $(xcodebuild -version 2>/dev/null | head -1)"
  fi
}

check_android_tools() {
  if [[ "$PLATFORM" == "android" || "$PLATFORM" == "all" ]]; then
    local sdk_path="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
    if [[ ! -d "$sdk_path" ]]; then
      log_error "Android SDK nie znaleziony. Ustaw ANDROID_HOME lub zainstaluj Android Studio."
      exit 1
    fi
    export ANDROID_HOME="$sdk_path"
    log_ok "Android SDK: $sdk_path"

    # Java 17 -- Gradle nie obsluguje Java 21+
    if [[ -z "${JAVA_HOME:-}" ]]; then
      local java17=""
      # Homebrew (Apple Silicon)
      if [[ -d "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home" ]]; then
        java17="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
      # Homebrew (Intel)
      elif [[ -d "/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home" ]]; then
        java17="/usr/local/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
      fi
      if [[ -n "$java17" ]]; then
        export JAVA_HOME="$java17"
        log_ok "JAVA_HOME ustawione na Java 17: $java17"
      else
        log_warn "Java 17 nie znaleziona. Gradle moze nie dzialac z nowszymi wersjami Java."
        log_warn "Zainstaluj: brew install openjdk@17"
      fi
    else
      log_ok "JAVA_HOME: $JAVA_HOME"
    fi

    # Gradle -- zapobieganie OutOfMemoryError: Metaspace
    if [[ -z "${GRADLE_OPTS:-}" ]]; then
      export GRADLE_OPTS="-Xmx4g -XX:MaxMetaspaceSize=1g"
      log_ok "GRADLE_OPTS ustawione: $GRADLE_OPTS"
    else
      log_ok "GRADLE_OPTS: $GRADLE_OPTS"
    fi
  fi
}

check_ios_credentials() {
  if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "all" ]]; then
    return 0
  fi

  local missing=""

  if [[ -z "${ASC_API_KEY_PATH:-}" ]]; then
    # Szukaj klucza w typowych lokalizacjach
    local key_file
    key_file=$(find "$PROJECT_DIR" -maxdepth 1 -name "AuthKey_*.p8" 2>/dev/null | head -1)
    if [[ -n "$key_file" ]]; then
      export ASC_API_KEY_PATH="$key_file"
      log_ok "Znaleziono ASC API Key: $key_file"
    else
      missing="${missing}  ASC_API_KEY_PATH -- sciezka do pliku AuthKey_*.p8\n"
    fi
  else
    log_ok "ASC_API_KEY_PATH: $ASC_API_KEY_PATH"
  fi

  if [[ -z "${ASC_API_KEY_ID:-}" ]]; then
    missing="${missing}  ASC_API_KEY_ID -- Key ID z App Store Connect\n"
  fi

  if [[ -z "${ASC_API_KEY_ISSUER_ID:-}" ]]; then
    missing="${missing}  ASC_API_KEY_ISSUER_ID -- Issuer ID z App Store Connect\n"
  fi

  if [[ -n "$missing" ]]; then
    log_error "Brakujace zmienne srodowiskowe dla iOS submit:"
    echo -e "$missing"
    echo "Ustaw je w powloce lub w pliku .env.local:"
    echo "  export ASC_API_KEY_PATH=./AuthKey_XXXXXXXXXX.p8"
    echo "  export ASC_API_KEY_ID=XXXXXXXXXX"
    echo "  export ASC_API_KEY_ISSUER_ID=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
    exit 1
  fi
}

check_android_credentials() {
  if [[ "$PLATFORM" != "android" && "$PLATFORM" != "all" ]]; then
    return 0
  fi

  if [[ -z "${GOOGLE_SERVICE_ACCOUNT_KEY_PATH:-}" ]]; then
    # Szukaj klucza w typowych lokalizacjach
    local sa_file
    sa_file=$(find "$PROJECT_DIR" -maxdepth 1 -name "*service-account*.json" 2>/dev/null | head -1)
    if [[ -n "$sa_file" ]]; then
      export GOOGLE_SERVICE_ACCOUNT_KEY_PATH="$sa_file"
      log_ok "Znaleziono Google Play SA: $sa_file"
    else
      log_error "Brakujaca zmienna srodowiskowa dla Android submit:"
      echo "  GOOGLE_SERVICE_ACCOUNT_KEY_PATH -- sciezka do pliku service account JSON"
      echo ""
      echo "Ustaw ja w powloce lub w pliku .env.local:"
      echo "  export GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./android-service-account.json"
      exit 1
    fi
  else
    log_ok "GOOGLE_SERVICE_ACCOUNT_KEY_PATH: $GOOGLE_SERVICE_ACCOUNT_KEY_PATH"
  fi
}

# ---------------------------------------------------------------------------
# Operacje
# ---------------------------------------------------------------------------
get_version() {
  local version
  version=$(python3 -c "import json; print(json.load(open('$PROJECT_DIR/package.json'))['version'])")
  echo "$version"
}

do_build() {
  local platform="$1"
  local profile="$2"

  log_info "Budowanie $platform ($profile) lokalnie..."
  log_info "Wersja: $(get_version)"

  cd "$PROJECT_DIR"

  local ext="aab"
  if [[ "$platform" == "ios" ]]; then
    ext="ipa"
  fi

  local timestamp
  timestamp=$(date +%Y%m%d-%H%M%S)
  local output_name="build-${timestamp}-${platform}.${ext}"

  log_info "Output: $PROJECT_DIR/$output_name"

  eas build --platform "$platform" --profile "$profile" --local --non-interactive --output "./$output_name"

  local output_file="$PROJECT_DIR/$output_name"

  if [[ -f "$output_file" ]]; then
    log_ok "Build ukonczony: $output_file ($(du -h "$output_file" | cut -f1))"
    echo "$output_file"
  else
    # Fallback: szukaj ostatnio wygenerowanego pliku buildu
    output_file=$(find "$PROJECT_DIR" -maxdepth 1 \( -name "*.aab" -o -name "*.ipa" -o -name "*.apk" \) -newer "$PROJECT_DIR/package.json" 2>/dev/null | head -1)
    if [[ -n "$output_file" ]]; then
      log_ok "Build ukonczony: $output_file ($(du -h "$output_file" | cut -f1))"
      echo "$output_file"
    else
      log_error "Build ukonczony ale nie znaleziono pliku artefaktu."
      log_warn "Sprawdz output powyzej i podaj sciezke recznie: --path <FILE>"
      return 1
    fi
  fi
}

do_submit() {
  local platform="$1"
  local profile="$2"
  local source_flag=""

  if [[ -n "$BUILD_ID" ]]; then
    source_flag="--id $BUILD_ID"
    log_info "Submitowanie $platform z EAS Build ID: $BUILD_ID"
  elif [[ -n "$ARTIFACT_PATH" ]]; then
    if [[ ! -f "$ARTIFACT_PATH" ]]; then
      log_error "Plik nie istnieje: $ARTIFACT_PATH"
      exit 1
    fi
    source_flag="--path $ARTIFACT_PATH"
    log_info "Submitowanie $platform z pliku: $ARTIFACT_PATH"
  else
    log_error "Podaj --build-id <ID> lub --path <FILE> dla submitu"
    exit 1
  fi

  cd "$PROJECT_DIR"

  # shellcheck disable=SC2086
  eas submit --platform "$platform" --profile "$profile" --non-interactive $source_flag

  log_ok "$platform submit ukonczony."
}

do_status() {
  cd "$PROJECT_DIR"
  log_info "Ostatnie buildy na EAS:"
  echo ""
  eas build:list --limit 5 --non-interactive 2>/dev/null || {
    log_warn "Nie udalo sie pobrac listy buildow. Sprawdz: https://expo.dev"
  }
}

# ---------------------------------------------------------------------------
# Glowny flow
# ---------------------------------------------------------------------------
run_for_platform() {
  local platform="$1"
  local cmd="$2"
  local profile="$3"

  case "$cmd" in
    build)
      do_build "$platform" "$profile"
      ;;
    submit)
      do_submit "$platform" "$profile"
      ;;
    release)
      local artifact
      artifact=$(do_build "$platform" "$profile")
      if [[ -n "$artifact" ]]; then
        ARTIFACT_PATH="$artifact"
        do_submit "$platform" "$profile"
      else
        log_error "Build nie zwrocil artefaktu, pomijam submit."
        return 1
      fi
      ;;
  esac
}

main() {
  parse_args "$@"

  echo ""
  echo "============================================"
  echo "  Slow Spot -- Local Release"
  echo "============================================"
  echo ""

  # Specjalna komenda: status
  if [[ "$COMMAND" == "status" ]]; then
    check_eas
    do_status
    exit 0
  fi

  # Walidacja platformy
  if [[ -z "$PLATFORM" ]]; then
    log_error "--platform jest wymagane (ios|android|all)"
    exit 1
  fi

  if [[ "$PLATFORM" != "ios" && "$PLATFORM" != "android" && "$PLATFORM" != "all" ]]; then
    log_error "Nieznana platforma: $PLATFORM. Uzyj: ios, android, all"
    exit 1
  fi

  # Zaladuj .env.local jesli istnieje
  if [[ -f "$PROJECT_DIR/.env.local" ]]; then
    log_info "Ladowanie zmiennych z .env.local"
    set -a
    # shellcheck disable=SC1091
    source "$PROJECT_DIR/.env.local"
    set +a
  fi

  # Walidacja srodowiska
  check_eas
  check_expo_token

  case "$COMMAND" in
    build)
      check_ios_tools
      check_android_tools
      ;;
    submit)
      check_ios_credentials
      check_android_credentials
      ;;
    release)
      check_ios_tools
      check_android_tools
      check_ios_credentials
      check_android_credentials
      ;;
    *)
      log_error "Nieznana komenda: $COMMAND. Uzyj: build, submit, release, status"
      usage
      exit 1
      ;;
  esac

  log_info "Komenda: $COMMAND | Platforma: $PLATFORM | Profil: $PROFILE"
  echo ""

  # Wykonanie
  local exit_code=0

  if [[ "$PLATFORM" == "all" ]]; then
    log_info "=== iOS ==="
    run_for_platform "ios" "$COMMAND" "$PROFILE" || exit_code=1
    echo ""
    log_info "=== Android ==="
    run_for_platform "android" "$COMMAND" "$PROFILE" || exit_code=1
  else
    run_for_platform "$PLATFORM" "$COMMAND" "$PROFILE" || exit_code=1
  fi

  echo ""
  if [[ $exit_code -eq 0 ]]; then
    log_ok "Wszystko zakonczone pomyslnie."
  else
    log_error "Niektore operacje nie powiodly sie. Sprawdz logi powyzej."
  fi

  exit $exit_code
}

main "$@"
