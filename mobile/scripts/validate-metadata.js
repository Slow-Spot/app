const fs = require("fs");
const data = JSON.parse(fs.readFileSync("mobile/store/metadata.json", "utf8"));

console.log("=== GOOGLE PLAY METADATA VALIDATION ===\n");

const limits = {
  name: 30,
  shortDescription: 80,
  description: 4000,
  whatsNew: 500
};

let hasErrors = false;
let issues = [];

console.log("--- LENGTH VALIDATION ---\n");
console.log("Limits: Title=30, ShortDesc=80, FullDesc=4000, WhatsNew=500\n");

for (const [locale, content] of Object.entries(data.locales)) {
  console.log(`[${locale}]`);

  for (const [field, limit] of Object.entries(limits)) {
    if (content[field]) {
      const len = content[field].length;
      const status = len <= limit ? "OK" : "EXCEED";
      const icon = len <= limit ? "v" : "X";

      if (len > limit) hasErrors = true;

      console.log(`  ${field}: ${len}/${limit} [${icon}] ${status}`);
    }
  }
}

console.log("\n--- ADDITIONAL CHECKS ---\n");

for (const [locale, content] of Object.entries(data.locales)) {
  // Check for emojis in title
  if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/u.test(content.name)) {
    issues.push(`[${locale}] Title contains emoji - may be rejected`);
  }

  // Check for excessive punctuation in title
  if ((content.name.match(/[!?]/g) || []).length > 1) {
    issues.push(`[${locale}] Title has excessive punctuation`);
  }

  // Check short description does not start with app name
  if (content.shortDescription.toLowerCase().startsWith("slow spot")) {
    issues.push(`[${locale}] Short description starts with app name (repetitive)`);
  }

  // Check URLs are valid
  if (content.supportUrl && content.supportUrl.indexOf("https://") !== 0) {
    issues.push(`[${locale}] Support URL not HTTPS`);
  }
}

// Check android contact info
if (!data.android.contactEmail || data.android.contactEmail.indexOf("@") === -1) {
  issues.push("[android] Invalid contact email");
}
if (!data.android.contactWebsite || data.android.contactWebsite.indexOf("https://") !== 0) {
  issues.push("[android] Contact website not HTTPS");
}

console.log("Checking: Emojis, punctuation, URL validity, repetitive content...\n");

if (issues.length === 0) {
  console.log("NO ISSUES FOUND\n");
} else {
  console.log("ISSUES FOUND:");
  issues.forEach(i => console.log("  - " + i));
  console.log("");
  hasErrors = true;
}

console.log("=== SUMMARY TABLE ===\n");
console.log("| Locale  | Title                           | TitleLen | ShortDescLen |");
console.log("|---------|--------------------------------|----------|--------------|");
for (const [locale, content] of Object.entries(data.locales)) {
  const title = content.name.padEnd(32).substring(0, 32);
  const titleLen = String(content.name.length).padStart(8);
  const shortLen = String(content.shortDescription.length).padStart(12);
  console.log(`| ${locale.padEnd(7)} | ${title} | ${titleLen} | ${shortLen} |`);
}

console.log("\n=== FINAL RESULT ===");
if (hasErrors) {
  console.log("ERRORS FOUND - Fix before uploading!");
  process.exit(1);
} else {
  console.log("ALL VALIDATIONS PASSED - Ready to upload!");
  process.exit(0);
}
