// Type wideners and missing module declarations for third-party packages

declare module 'react-native-app-intro-slider' {
  import * as React from 'react';
  const AppIntroSlider: React.ComponentType<any>;
  export default AppIntroSlider;
}

declare module 'uuid';

declare module 'expo-linear-gradient' {
  import * as React from 'react';
  import { StyleProp, ViewStyle } from 'react-native';
  interface LinearGradientProps {
    colors: (string | number)[];
    locations?: number[] | null;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
    [key: string]: any;
  }
  const LinearGradient: React.ComponentType<LinearGradientProps>;
  export default LinearGradient;
}
