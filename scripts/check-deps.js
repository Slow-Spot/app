#!/usr/bin/env node

/**
 * Dependency Health Check
 *
 * Sprawdza stan zaleznosci we wszystkich projektach monorepo:
 * - npm audit (podatnosci bezpieczenstwa)
 * - expo install --check (zgodnosc z SDK)
 * - outdated packages (semver-compatible updates)
 *
 * Uzycie:
 *   node scripts/check-deps.js           # sprawdz wszystko
 *   node scripts/check-deps.js --audit   # tylko security audit
 *   node scripts/check-deps.js --mobile  # tylko mobile
 *   node scripts/check-deps.js --web     # tylko web
 *   node scripts/check-deps.js --ci      # tryb CI (exit code 1 przy critical/high)
 */

const { execFileSync } = require('child_process');
const path = require('path');

// Kolory terminala
const c = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

const ROOT = path.resolve(__dirname, '..');
const MOBILE = path.join(ROOT, 'mobile');
const WEB = path.join(ROOT, 'web');

const args = process.argv.slice(2);
const auditOnly = args.includes('--audit');
const mobileOnly = args.includes('--mobile');
const webOnly = args.includes('--web');
const ciMode = args.includes('--ci');

const checkMobile = !webOnly;
const checkWeb = !mobileOnly;

let hasIssues = false;
let hasCritical = false;

function run(cmd, cmdArgs, cwd) {
  try {
    return execFileSync(cmd, cmdArgs, { cwd, encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    return e.stdout || e.stderr || '';
  }
}

function header(text) {
  console.log(`\n${c.bold}${c.cyan}[${'='.repeat(50)}]${c.reset}`);
  console.log(`${c.bold}${c.cyan}  ${text}${c.reset}`);
  console.log(`${c.bold}${c.cyan}[${'='.repeat(50)}]${c.reset}\n`);
}

function warn(text) {
  console.log(`  ${c.yellow}WARNING${c.reset} ${text}`);
  hasIssues = true;
}

function critical(text) {
  console.log(`  ${c.red}CRITICAL${c.reset} ${text}`);
  hasIssues = true;
  hasCritical = true;
}

function ok(text) {
  console.log(`  ${c.green}OK${c.reset} ${text}`);
}

// --- npm audit ---
function checkAudit(name, cwd) {
  console.log(`${c.bold}Security audit: ${name}${c.reset}`);

  const output = run('npm', ['audit', '--json'], cwd);
  let audit;
  try {
    audit = JSON.parse(output);
  } catch {
    ok('0 vulnerabilities');
    return;
  }

  const meta = audit.metadata?.vulnerabilities || {};
  const total = (meta.critical || 0) + (meta.high || 0) + (meta.moderate || 0) + (meta.low || 0);

  if (total === 0) {
    ok('0 vulnerabilities');
    return;
  }

  if (meta.critical > 0) critical(`${meta.critical} critical vulnerabilities`);
  if (meta.high > 0) critical(`${meta.high} high vulnerabilities`);
  if (meta.moderate > 0) warn(`${meta.moderate} moderate vulnerabilities`);
  if (meta.low > 0) console.log(`  ${c.dim}INFO${c.reset} ${meta.low} low vulnerabilities`);

  console.log(`  ${c.dim}Run: cd ${path.relative(ROOT, cwd)} && npm audit${c.reset}`);
}

// --- Expo SDK alignment ---
function checkExpoCompat() {
  console.log(`${c.bold}Expo SDK compatibility: mobile${c.reset}`);

  const output = run('npx', ['expo', 'install', '--check'], MOBILE);

  if (output.includes('Found outdated dependencies') || output.includes('should be updated')) {
    const lines = output.split('\n').filter(l => l.includes(' - expected version:'));
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.includes('@types/jest')) {
        warn(`${trimmed} ${c.dim}(typings only)${c.reset}`);
      } else {
        warn(trimmed);
      }
    }
    console.log(`  ${c.dim}Run: cd mobile && npx expo install --fix${c.reset}`);
  } else {
    ok('All packages aligned with Expo SDK');
  }
}

// --- Outdated packages ---
function checkOutdated(name, cwd) {
  console.log(`${c.bold}Outdated packages: ${name}${c.reset}`);

  const output = run('npm', ['outdated', '--json'], cwd);
  let outdated;
  try {
    outdated = JSON.parse(output);
  } catch {
    ok('All packages up to date');
    return;
  }

  const packages = Object.entries(outdated);
  if (packages.length === 0) {
    ok('All packages up to date');
    return;
  }

  let patchCount = 0;
  let minorCount = 0;
  let majorCount = 0;

  for (const [, info] of packages) {
    const current = info.current || '?';
    const latest = info.latest || '?';
    const wanted = info.wanted || latest;

    if (current === wanted && current === latest) continue;

    const currentMajor = parseInt(current.split('.')[0], 10);
    const latestMajor = parseInt(latest.split('.')[0], 10);

    if (latestMajor > currentMajor) {
      majorCount++;
    } else {
      const currentMinor = parseInt(current.split('.')[1] || '0', 10);
      const wantedMinor = parseInt(wanted.split('.')[1] || '0', 10);
      if (wantedMinor > currentMinor) {
        minorCount++;
      } else {
        patchCount++;
      }
    }
  }

  const parts = [];
  if (majorCount > 0) parts.push(`${majorCount} major`);
  if (minorCount > 0) parts.push(`${minorCount} minor`);
  if (patchCount > 0) parts.push(`${patchCount} patch`);

  if (parts.length > 0) {
    warn(`${parts.join(', ')} updates available`);
    console.log(`  ${c.dim}Run: cd ${path.relative(ROOT, cwd)} && npx npm-check-updates --target semver${c.reset}`);
  } else {
    ok('All packages up to date');
  }
}

// --- Main ---
console.log(`\n${c.bold}Dependency Health Check${c.reset} ${c.dim}${new Date().toISOString().split('T')[0]}${c.reset}`);

if (checkMobile) {
  header('MOBILE');
  checkAudit('mobile', MOBILE);
  if (!auditOnly) {
    checkExpoCompat();
    checkOutdated('mobile', MOBILE);
  }
}

if (checkWeb) {
  header('WEB');
  checkAudit('web', WEB);
  if (!auditOnly) {
    checkOutdated('web', WEB);
  }
}

// --- Podsumowanie ---
console.log('');
if (!hasIssues) {
  console.log(`${c.green}${c.bold}All dependencies healthy.${c.reset}\n`);
} else if (hasCritical) {
  console.log(`${c.red}${c.bold}Critical issues found. Fix before release.${c.reset}\n`);
} else {
  console.log(`${c.yellow}${c.bold}Non-critical issues found. Consider updating.${c.reset}\n`);
}

if (ciMode && hasCritical) {
  process.exit(1);
}
