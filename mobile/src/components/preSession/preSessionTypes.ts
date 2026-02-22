import type { TextStyle, ViewStyle } from 'react-native';

export interface PreSessionDynamicStyles {
  title: TextStyle;
  subtitle: TextStyle;
  cardTitle: TextStyle;
  cardDescription: TextStyle;
  listBullet: TextStyle;
  listText: TextStyle;
  skipButtonText: TextStyle;
  inputLabel: TextStyle;
  textInput: TextStyle & ViewStyle;
  timerText: TextStyle;
  breathingText: TextStyle;
  checklistTitle: TextStyle;
  checklistDescription: TextStyle;
  optionalBadge: TextStyle;
  skipCheckboxContainer: ViewStyle;
  skipCheckboxTitle: TextStyle;
  skipCheckboxNote: TextStyle;
  cardShadow: ViewStyle;
  cardBg: string;
  iconBoxBg: string;
  iconBoxBgCompleted: string;
  iconColor: string;
  iconColorCompleted: string;
  checkboxColor: string;
  checkboxColorUnchecked: string;
  progressActiveColor: string;
}
