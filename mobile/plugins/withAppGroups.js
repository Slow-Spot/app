/**
 * Expo Config Plugin - App Groups for Live Activity
 *
 * Dodaje App Group do entitlements dla glownej aplikacji i widget extension.
 * Wymagane dla prawidlowego dzialania Live Activity na iOS.
 *
 * UWAGA: Ten plugin MUSI byc dodany PO expo-live-activity w app.json
 */

const { withEntitlementsPlist, withDangerousMod } = require('@expo/config-plugins');
const plist = require('@expo/plist');
const fs = require('fs');
const path = require('path');

const APP_GROUP_IDENTIFIER = 'group.com.slowspot.app.shared';

/**
 * Dodaje App Group do glownej aplikacji
 */
const withMainAppGroup = (config) => {
  return withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.security.application-groups'] = [APP_GROUP_IDENTIFIER];
    return config;
  });
};

/**
 * Naprawia wersje we wszystkich targetach - ustawia taka sama jak glowna aplikacja
 * Problem: @bacons/apple-targets ustawia 11400 zamiast buildNumber
 */
const fixBuildVersions = (projectRoot) => {
  const pbxprojPath = path.join(projectRoot, 'SlowSpot.xcodeproj', 'project.pbxproj');

  if (!fs.existsSync(pbxprojPath)) {
    console.log('[withAppGroups] project.pbxproj not found');
    return;
  }

  let content = fs.readFileSync(pbxprojPath, 'utf8');

  // Pobierz buildNumber z EAS lub ustaw domyslna wartosc
  const targetVersion = process.env.EAS_BUILD_IOS_BUILD_NUMBER || '1';

  // Zamien 11400 na prawidlowa wersje
  if (content.includes('CURRENT_PROJECT_VERSION = 11400;')) {
    content = content.replace(/CURRENT_PROJECT_VERSION = 11400;/g, `CURRENT_PROJECT_VERSION = ${targetVersion};`);
    fs.writeFileSync(pbxprojPath, content);
    console.log(`[withAppGroups] Fixed build versions: 11400 -> ${targetVersion}`);
  } else {
    console.log('[withAppGroups] No 11400 versions found, versions OK');
  }
};

/**
 * Dodaje App Group do LiveActivity widget extension
 * Uzywa withDangerousMod ktory dziala na samym koncu procesu prebuild
 */
const withWidgetAppGroup = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.platformProjectRoot;
      const widgetEntitlementsPath = path.join(projectRoot, 'LiveActivity', 'LiveActivity.entitlements');

      // Poczekaj na zakonczenie innych pluginow
      // withDangerousMod dziala na koncu, wiec plik powinien juz istniec
      if (fs.existsSync(widgetEntitlementsPath)) {
        const entitlements = {
          'com.apple.security.application-groups': [APP_GROUP_IDENTIFIER],
        };

        fs.writeFileSync(widgetEntitlementsPath, plist.build(entitlements));
        console.log(`[withAppGroups] Added App Group to LiveActivity entitlements: ${APP_GROUP_IDENTIFIER}`);
      } else {
        // Jesli plik nie istnieje, utworz go
        const widgetDir = path.join(projectRoot, 'LiveActivity');
        if (fs.existsSync(widgetDir)) {
          const entitlements = {
            'com.apple.security.application-groups': [APP_GROUP_IDENTIFIER],
          };
          fs.writeFileSync(widgetEntitlementsPath, plist.build(entitlements));
          console.log(`[withAppGroups] Created LiveActivity entitlements with App Group: ${APP_GROUP_IDENTIFIER}`);
        } else {
          console.warn(`[withAppGroups] LiveActivity directory not found at ${widgetDir}`);
        }
      }

      // Napraw wersje po zakonczeniu wszystkich pluginow
      fixBuildVersions(projectRoot);

      return config;
    },
  ]);
};

/**
 * Glowny plugin - laczy oba
 */
const withAppGroups = (config) => {
  config = withMainAppGroup(config);
  config = withWidgetAppGroup(config);
  return config;
};

module.exports = withAppGroups;
