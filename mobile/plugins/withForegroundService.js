/**
 * Expo Config Plugin - Android Foreground Service
 *
 * Dodaje uprawnienia FOREGROUND_SERVICE i FOREGROUND_SERVICE_MEDIA_PLAYBACK
 * oraz konfiguruje foregroundServiceType dla serwisu Notifee.
 * Wymagane dla Android 14+ (API 34+) aby timer dzialal w tle.
 */

const { withAndroidManifest } = require('@expo/config-plugins');

const withForegroundService = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];

    // Dodaj foregroundServiceType do serwisu Notifee
    if (!mainApplication.service) {
      mainApplication.service = [];
    }

    const notifeeService = mainApplication.service.find(
      (s) => s.$['android:name'] === 'app.notifee.core.ForegroundService'
    );

    if (notifeeService) {
      notifeeService.$['android:foregroundServiceType'] = 'mediaPlayback';
    } else {
      mainApplication.service.push({
        $: {
          'android:name': 'app.notifee.core.ForegroundService',
          'android:foregroundServiceType': 'mediaPlayback',
          'android:exported': 'false',
        },
      });
    }

    // Dodaj wymagane uprawnienia
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }

    const requiredPermissions = [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
      'android.permission.WAKE_LOCK',
    ];

    for (const perm of requiredPermissions) {
      const exists = androidManifest.manifest['uses-permission'].some(
        (p) => p.$['android:name'] === perm
      );
      if (!exists) {
        androidManifest.manifest['uses-permission'].push({
          $: { 'android:name': perm },
        });
      }
    }

    console.log('[withForegroundService] Added foreground service permissions and type');
    return config;
  });
};

module.exports = withForegroundService;
