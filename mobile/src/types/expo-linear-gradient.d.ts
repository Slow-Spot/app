/**
 * Type declaration override for expo-linear-gradient
 *
 * The official types have an issue where TypeScript suggests using default import,
 * but the actual export is a named export. This file augments the module declaration
 * to properly export LinearGradient as a named export.
 *
 * Also relaxes the colors/locations types to accept regular arrays.
 */
declare module 'expo-linear-gradient' {
  import { Component } from 'react';
  import { ColorValue, ViewProps } from 'react-native';

  export type LinearGradientPoint = {
    x: number;
    y: number;
  } | readonly [number, number];

  export interface LinearGradientProps extends ViewProps {
    colors: readonly ColorValue[] | ColorValue[];
    locations?: readonly number[] | number[] | null;
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
    dither?: boolean;
  }

  export class LinearGradient extends Component<LinearGradientProps> {}
}
