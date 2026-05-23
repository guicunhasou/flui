import type { ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

const themeColors = colors as Record<string, string>;
const themeRadius = radius as Record<string, number>;
const themeSpacing = spacing as Record<string, number>;
const themeShadows = shadows as Record<string, unknown>;

const fallbackShadow: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 4,
};

export const componentColors = {
  background: themeColors.background ?? themeColors.bg ?? '#F5F7F6',
  surface: themeColors.surface ?? themeColors.card ?? themeColors.white ?? '#FFFFFF',
  surfaceMuted: themeColors.surfaceMuted ?? themeColors.muted ?? '#EEF3F1',
  primary: themeColors.primary ?? themeColors.brand ?? '#0F5E66',
  primaryDark: themeColors.primaryDark ?? '#083F46',
  text: themeColors.text ?? themeColors.textPrimary ?? '#172322',
  textMuted: themeColors.textMuted ?? themeColors.textSecondary ?? '#667370',
  border: themeColors.border ?? '#DDE6E3',
  success: themeColors.success ?? '#2E9F6F',
  warning: themeColors.warning ?? '#F2B84B',
  danger: themeColors.danger ?? '#D95D5D',
  disabled: themeColors.disabled ?? '#B8C4C1',
  buttonText: themeColors.buttonText ?? '#FFFFFF',
};

export const componentSpacing = {
  xs: themeSpacing.xs ?? 4,
  sm: themeSpacing.sm ?? 8,
  md: themeSpacing.md ?? 16,
  lg: themeSpacing.lg ?? 24,
  xl: themeSpacing.xl ?? 32,
};

export const componentRadius = {
  sm: themeRadius.sm ?? 8,
  md: themeRadius.md ?? 14,
  lg: themeRadius.lg ?? 20,
  xl: themeRadius.xl ?? 28,
  pill: themeRadius.pill ?? 999,
};

export const componentShadows = {
  soft: (themeShadows.soft as ViewStyle) ?? (themeShadows.card as ViewStyle) ?? fallbackShadow,
};
