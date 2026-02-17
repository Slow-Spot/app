import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { brandColors } from '../../theme/colors';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const iconMap: Record<string, string> = {
  // Physical setup icons
  chair: 'chair',
  spa: 'spa',
  'praying-hands': 'praying-hands',
  eye: 'eye',
  bed: 'bed',
  walking: 'walking',
  thermometer: 'thermometer-half',
  anchor: 'anchor',
  heart: 'heart',
  smile: 'smile',
  water: 'water',
  mountain: 'mountain',
  bullseye: 'bullseye',
  // UI icons
  sunrise: 'sun',
  target: 'bullseye',
  lightbulb: 'lightbulb',
  clipboard: 'clipboard-list',
  wind: 'wind',
  sparkles: 'star',
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = brandColors.purple.primary }) => {
  const fontAwesomeName = iconMap[name] || 'question-circle';
  return <FontAwesome5 name={fontAwesomeName} size={size} color={color} solid />;
};
