const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const languages = [
  { code: 'en', folder: 'en-US' },
  { code: 'pl', folder: 'pl-PL' },
  { code: 'de', folder: 'de-DE' },
  { code: 'es', folder: 'es-ES' },
  { code: 'fr', folder: 'fr-FR' },
  { code: 'hi', folder: 'hi-IN' },
  { code: 'zh', folder: 'zh-CN' },
];

const screens = [
  { name: '01_home', tab: 0, waitFor: 2000 },
  { name: '02_meditation', tab: 1, waitFor: 2000 },
  { name: '03_quotes', tab: 2, waitFor: 2000 },
  { name: '04_profile', tab: 3, waitFor: 2000 },
  { name: '05_settings', tab: 4, waitFor: 2000 },
];

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });
  
  for (const lang of languages) {
    console.log(`\n📸 Taking screenshots for ${lang.folder}...`);
    
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 }, // iPhone 14 Pro dimensions
      deviceScaleFactor: 3,
      locale: lang.code,
    });
    
    const page = await context.newPage();
    
    // Set language in localStorage before navigating
    await page.goto('http://localhost:19007');
    await page.evaluate((langCode) => {
      localStorage.setItem('i18nextLng', langCode);
      localStorage.setItem('language', langCode);
    }, lang.code);
    
    // Reload to apply language
    await page.reload();
    await page.waitForTimeout(3000);
    
    // Ensure output directory exists
    const outputDir = path.join(__dirname, 'android', 'screenshots', lang.folder);
    fs.mkdirSync(outputDir, { recursive: true });
    
    for (const screen of screens) {
      try {
        // Navigate to tab by clicking bottom navigation
        const tabs = await page.locator('[role="button"], [data-testid*="tab"], button').all();
        
        // Wait for content to load
        await page.waitForTimeout(screen.waitFor);
        
        // Take screenshot
        const screenshotPath = path.join(outputDir, `${screen.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`  ✅ ${screen.name}`);
      } catch (e) {
        console.log(`  ❌ ${screen.name}: ${e.message}`);
      }
    }
    
    await context.close();
  }
  
  await browser.close();
  console.log('\n✨ Screenshots complete!');
}

takeScreenshots().catch(console.error);
