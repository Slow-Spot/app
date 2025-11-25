import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface ZenLogoProps {
  size?: number;
  color?: string;
}

export const ZenLogo: React.FC<ZenLogoProps> = ({
  size = 120,
  color = '#FFFFFF'
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="lotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </LinearGradient>
        <LinearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </LinearGradient>
      </Defs>

      {/* Zen circles - enso inspired */}
      <Circle
        cx="60"
        cy="60"
        r="55"
        fill="none"
        stroke="url(#circleGrad)"
        strokeWidth="1.5"
      />
      <Circle
        cx="60"
        cy="60"
        r="45"
        fill="none"
        stroke="url(#circleGrad)"
        strokeWidth="1"
      />
      <Circle
        cx="60"
        cy="60"
        r="35"
        fill="none"
        stroke="url(#circleGrad)"
        strokeWidth="0.8"
      />

      {/* Lotus flower */}
      <G transform="translate(60, 60)">
        {/* Center petal - top */}
        <Path
          d="M0,-28 C8,-20 8,-8 0,0 C-8,-8 -8,-20 0,-28"
          fill="url(#lotusGrad)"
        />

        {/* Left petals */}
        <Path
          d="M0,0 C-6,-6 -18,-10 -26,-6 C-20,2 -8,4 0,0"
          fill="url(#lotusGrad)"
          opacity="0.9"
        />
        <Path
          d="M0,0 C-8,-2 -20,4 -24,14 C-14,10 -4,4 0,0"
          fill="url(#lotusGrad)"
          opacity="0.8"
        />

        {/* Right petals */}
        <Path
          d="M0,0 C6,-6 18,-10 26,-6 C20,2 8,4 0,0"
          fill="url(#lotusGrad)"
          opacity="0.9"
        />
        <Path
          d="M0,0 C8,-2 20,4 24,14 C14,10 4,4 0,0"
          fill="url(#lotusGrad)"
          opacity="0.8"
        />

        {/* Upper left petal */}
        <Path
          d="M0,0 C-4,-8 -14,-18 -20,-20 C-14,-10 -6,-4 0,0"
          fill="url(#lotusGrad)"
          opacity="0.85"
        />

        {/* Upper right petal */}
        <Path
          d="M0,0 C4,-8 14,-18 20,-20 C14,-10 6,-4 0,0"
          fill="url(#lotusGrad)"
          opacity="0.85"
        />

        {/* Center dot */}
        <Circle cx="0" cy="-2" r="4" fill={color} opacity="0.9" />
      </G>
    </Svg>
  );
};

export default ZenLogo;
