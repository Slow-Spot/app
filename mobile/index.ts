import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import { registerWidgetTaskHandler } from 'react-native-android-widget';

import App from './App';
import { widgetTaskHandler } from './src/widgets/widgetTaskHandler';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Rejestracja task handlera dla Android widgetów
registerWidgetTaskHandler(widgetTaskHandler);

// Rejestracja foreground service i background event handlera dla Android
// onBackgroundEvent MUSI byc na poziomie modulu (headless task via AppRegistry)
// Promise nigdy nie jest resolved - serwis dziala do wywolania stopForegroundService()
if (Platform.OS === 'android') {
  import('@notifee/react-native').then((notifee) => {
    notifee.default.registerForegroundService(() => {
      return new Promise(() => {
        // Serwis utrzymywany przez pending promise.
        // Zakonczenie przez notifee.stopForegroundService() w androidForegroundService.ts
      });
    });

    // Background event handler - obsluguje akcje z powiadomienia gdy app jest w tle
    notifee.default.onBackgroundEvent(async ({ type, detail }) => {
      if (type === notifee.EventType.ACTION_PRESS && detail.pressAction) {
        const actionId = detail.pressAction.id;
        if (actionId === 'pause' || actionId === 'resume' || actionId === 'stop') {
          // Dynamiczny import serwisu - unikamy circular dependency
          const { androidForegroundService } = await import(
            './src/services/androidForegroundService'
          );
          androidForegroundService.handleBackgroundAction(actionId);
        }
      }
    });
  }).catch(() => {
    // Notifee niedostepne - fallback na silent audio
  });
}
