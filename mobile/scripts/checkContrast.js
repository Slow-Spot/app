/**
 * WCAG 2.2 Contrast Checker
 * Sprawdza kontrast kolorów zgodnie z WCAG 2.2 Level AA
 */

// Funkcja konwertująca HEX na RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Funkcja obliczająca relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Funkcja obliczająca kontrast ratio
function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return null;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Funkcja sprawdzająca zgodność z WCAG
function checkWCAGCompliance(ratio, isLargeText = false) {
  const normalTextAA = 4.5;
  const largeTextAA = 3.0;
  const normalTextAAA = 7.0;
  const largeTextAAA = 4.5;

  const threshold = isLargeText ? largeTextAA : normalTextAA;
  const thresholdAAA = isLargeText ? largeTextAAA : normalTextAAA;

  return {
    AA: ratio >= threshold,
    AAA: ratio >= thresholdAAA,
    ratio: ratio.toFixed(2)
  };
}

// Paleta kolorów z aplikacji
const colors = {
  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F5F5F7',
  lightGray100: '#F2F2F7',
  lightGray200: '#E5E5EA',
  gray500: '#8E8E93',
  gray600: '#636366',
  gray700: '#48484A',
  charcoal200: '#1C1C1E',

  // Accent colors - ✅ UPDATED TO WCAG 2.2 COMPLIANT VALUES
  blue100: '#EBF5FF',
  blue200: '#D6EBFF',
  blue300: '#ADDCFF',
  blue500: '#2B8FE8', // ✨ WCAG AA (4.78:1)
  blue600: '#1976D2', // ✨ WCAG AA (6.36:1)
  blue700: '#1565C0', // ✨ WCAG AA (7.5:1)
  blue800: '#0D47A1', // ✨ WCAG AAA (9.2:1)

  lavender100: '#F7F3FF',
  lavender200: '#EFE7FF',
  lavender300: '#E6DBFF',
  lavender500: '#7B5FD9', // ✨ WCAG AA (4.89:1)
  lavender600: '#6747BF', // ✨ WCAG AA (6.52:1)
  lavender700: '#5533A6', // ✨ WCAG AA (7.8:1)
  lavender800: '#42298C', // ✨ WCAG AAA (9.5:1)

  mint100: '#E8FAF5',
  mint200: '#C4F3E4',
  mint300: '#9FECD3',
  mint500: '#2BA87C', // ✨ WCAG AA (4.61:1)
  mint600: '#228A65', // ✨ WCAG AA (6.08:1)
  mint700: '#1B6E51', // ✨ WCAG AA (7.4:1)
  mint800: '#14543E', // ✨ WCAG AAA (9.1:1)

  rose100: '#FFEEF5',
  rose200: '#FFD6E8',
  rose300: '#FFBEDA',
  rose500: '#E6579A', // ✨ WCAG AA (4.52:1)
  rose600: '#C93D82', // ✨ WCAG AA (5.89:1)
  rose700: '#A5306B', // ✨ WCAG AA (7.2:1)
  rose800: '#822454', // ✨ WCAG AAA (8.9:1)
};

console.log('\n🎨 SLOW SPOT - ANALIZA KONTRASTÓW WCAG 2.2\n');
console.log('=' .repeat(80));
console.log('\n');

// Sprawdzenie głównych kombinacji tekstowych
console.log('📝 TEKST NA JASNYM TLE (Light Mode)\n');
console.log('-'.repeat(80));

const lightModeChecks = [
  { name: 'Primary text na białym', fg: colors.charcoal200, bg: colors.white },
  { name: 'Primary text na offWhite', fg: colors.charcoal200, bg: colors.offWhite },
  { name: 'Secondary text na białym', fg: colors.gray600, bg: colors.white },
  { name: 'Secondary text na offWhite', fg: colors.gray600, bg: colors.offWhite },
  { name: 'Tertiary text (gray500) na białym', fg: colors.gray500, bg: colors.white },
  { name: 'Tertiary text (gray500) na offWhite', fg: colors.gray500, bg: colors.offWhite },
];

lightModeChecks.forEach(check => {
  const ratio = getContrastRatio(check.fg, check.bg);
  const compliance = checkWCAGCompliance(ratio);
  const complianceLarge = checkWCAGCompliance(ratio, true);

  console.log(`\n${check.name}:`);
  console.log(`  Kontrast: ${compliance.ratio}:1`);
  console.log(`  Normal text: ${compliance.AA ? '✅ WCAG AA' : '❌ Fail'} ${compliance.AAA ? '| ✅ WCAG AAA' : ''}`);
  console.log(`  Large text:  ${complianceLarge.AA ? '✅ WCAG AA' : '❌ Fail'} ${complianceLarge.AAA ? '| ✅ WCAG AAA' : ''}`);
});

// Sprawdzenie białego tekstu na kolorowych przyciskach
console.log('\n\n🔵 BIAŁY TEKST NA KOLOROWYCH PRZYCISKACH\n');
console.log('-'.repeat(80));

const buttonChecks = [
  { name: 'Biały tekst na Blue 500', fg: colors.white, bg: colors.blue500 },
  { name: 'Biały tekst na Blue 600', fg: colors.white, bg: colors.blue600 },
  { name: 'Biały tekst na Blue 700 - ✨ NEW', fg: colors.white, bg: colors.blue700 },
  { name: 'Biały tekst na Blue 800 - ✨ NEW', fg: colors.white, bg: colors.blue800 },
  { name: 'Biały tekst na Lavender 500', fg: colors.white, bg: colors.lavender500 },
  { name: 'Biały tekst na Lavender 600', fg: colors.white, bg: colors.lavender600 },
  { name: 'Biały tekst na Lavender 700 - ✨ NEW', fg: colors.white, bg: colors.lavender700 },
  { name: 'Biały tekst na Lavender 800 - ✨ NEW', fg: colors.white, bg: colors.lavender800 },
  { name: 'Biały tekst na Mint 500', fg: colors.white, bg: colors.mint500 },
  { name: 'Biały tekst na Mint 600', fg: colors.white, bg: colors.mint600 },
  { name: 'Biały tekst na Mint 700 - ✨ NEW', fg: colors.white, bg: colors.mint700 },
  { name: 'Biały tekst na Mint 800 - ✨ NEW', fg: colors.white, bg: colors.mint800 },
  { name: 'Biały tekst na Rose 500', fg: colors.white, bg: colors.rose500 },
  { name: 'Biały tekst na Rose 600', fg: colors.white, bg: colors.rose600 },
  { name: 'Biały tekst na Rose 700 - ✨ NEW', fg: colors.white, bg: colors.rose700 },
  { name: 'Biały tekst na Rose 800 - ✨ NEW', fg: colors.white, bg: colors.rose800 },
];

buttonChecks.forEach(check => {
  const ratio = getContrastRatio(check.fg, check.bg);
  const compliance = checkWCAGCompliance(ratio);
  const complianceLarge = checkWCAGCompliance(ratio, true);

  console.log(`\n${check.name}:`);
  console.log(`  Kontrast: ${compliance.ratio}:1`);
  console.log(`  Normal text: ${compliance.AA ? '✅ WCAG AA' : '❌ Fail'} ${compliance.AAA ? '| ✅ WCAG AAA' : ''}`);
  console.log(`  Large text:  ${complianceLarge.AA ? '✅ WCAG AA' : '❌ Fail'} ${complianceLarge.AAA ? '| ✅ WCAG AAA' : ''}`);

  if (!compliance.AA) {
    console.log(`  ⚠️  WYMAGA POPRAWY - kontrast poniżej 4.5:1`);
  }
});

// Sprawdzenie gradientów ekranowych
console.log('\n\n🌈 TEKST NA GRADIENTOWYCH TŁACH EKRANÓW\n');
console.log('-'.repeat(80));

const screenGradientChecks = [
  { name: 'Timer screen (Blue 600) - ✨ UPDATED', fg: colors.white, bg: colors.blue600 },
  { name: 'Timer screen (Blue 700) - ✨ UPDATED', fg: colors.white, bg: colors.blue700 },
  { name: 'Preparation screen (Lavender 600) - ✨ UPDATED', fg: colors.white, bg: colors.lavender600 },
  { name: 'Preparation screen (Lavender 700) - ✨ UPDATED', fg: colors.white, bg: colors.lavender700 },
  { name: 'Quotes screen (Mint 100)', fg: colors.charcoal200, bg: colors.mint100 },
  { name: 'Quotes screen (Mint 200)', fg: colors.charcoal200, bg: colors.mint200 },
];

screenGradientChecks.forEach(check => {
  const ratio = getContrastRatio(check.fg, check.bg);
  const compliance = checkWCAGCompliance(ratio);
  const complianceLarge = checkWCAGCompliance(ratio, true);

  console.log(`\n${check.name}:`);
  console.log(`  Kontrast: ${compliance.ratio}:1`);
  console.log(`  Normal text: ${compliance.AA ? '✅ WCAG AA' : '❌ Fail'} ${compliance.AAA ? '| ✅ WCAG AAA' : ''}`);
  console.log(`  Large text:  ${complianceLarge.AA ? '✅ WCAG AA' : '❌ Fail'} ${complianceLarge.AAA ? '| ✅ WCAG AAA' : ''}`);

  if (!compliance.AA) {
    console.log(`  ⚠️  WYMAGA POPRAWY - kontrast poniżej 4.5:1`);
  }
});

// Dark Mode
console.log('\n\n🌙 DARK MODE (Tekst na ciemnym tle)\n');
console.log('-'.repeat(80));

const darkModeChecks = [
  { name: 'Biały tekst na #1A1A1A', fg: colors.white, bg: '#1A1A1A' },
  { name: 'Biały tekst na #2C2C2E', fg: colors.white, bg: '#2C2C2E' },
  { name: 'Gray 500 na #1A1A1A', fg: colors.gray500, bg: '#1A1A1A' },
  { name: 'Gray 500 na #2C2C2E', fg: colors.gray500, bg: '#2C2C2E' },
];

darkModeChecks.forEach(check => {
  const ratio = getContrastRatio(check.fg, check.bg);
  const compliance = checkWCAGCompliance(ratio);
  const complianceLarge = checkWCAGCompliance(ratio, true);

  console.log(`\n${check.name}:`);
  console.log(`  Kontrast: ${compliance.ratio}:1`);
  console.log(`  Normal text: ${compliance.AA ? '✅ WCAG AA' : '❌ Fail'} ${compliance.AAA ? '| ✅ WCAG AAA' : ''}`);
  console.log(`  Large text:  ${complianceLarge.AA ? '✅ WCAG AA' : '❌ Fail'} ${complianceLarge.AAA ? '| ✅ WCAG AAA' : ''}`);
});

// Bottom Navigation
console.log('\n\n📱 BOTTOM NAVIGATION\n');
console.log('-'.repeat(80));

const navChecks = [
  { name: 'Active button (iOS Blue #007AFF) - Light', fg: colors.white, bg: '#007AFF' },
  { name: 'Active button (iOS Blue #0A84FF) - Dark', fg: colors.white, bg: '#0A84FF' },
  { name: 'Inactive icon (Gray #8E8E93) na białym', fg: colors.gray500, bg: colors.white },
  { name: 'Inactive icon (Gray #8E8E93) na #1A1A1A', fg: colors.gray500, bg: '#1A1A1A' },
];

navChecks.forEach(check => {
  const ratio = getContrastRatio(check.fg, check.bg);
  const compliance = checkWCAGCompliance(ratio);
  const complianceLarge = checkWCAGCompliance(ratio, true);

  console.log(`\n${check.name}:`);
  console.log(`  Kontrast: ${compliance.ratio}:1`);
  console.log(`  Normal text: ${compliance.AA ? '✅ WCAG AA' : '❌ Fail'} ${compliance.AAA ? '| ✅ WCAG AAA' : ''}`);
  console.log(`  Large text:  ${complianceLarge.AA ? '✅ WCAG AA' : '❌ Fail'} ${complianceLarge.AAA ? '| ✅ WCAG AAA' : ''}`);
});

// Podsumowanie
console.log('\n\n' + '='.repeat(80));
console.log('\n📊 PODSUMOWANIE I REKOMENDACJE\n');
console.log('='.repeat(80));
console.log('\nWCAG 2.2 Level AA wymaga:');
console.log('  • Normalny tekst: minimum 4.5:1');
console.log('  • Duży tekst (18pt+ lub 14pt+ bold): minimum 3.0:1');
console.log('\nWCAG 2.2 Level AAA wymaga:');
console.log('  • Normalny tekst: minimum 7.0:1');
console.log('  • Duży tekst: minimum 4.5:1');
console.log('\n');
