import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const overlayColors = colors;

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(8, 10, 18, 0.26)',
  },

  card: {
    minWidth: 220,
    maxWidth: '82%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },

  loader: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderHalo: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoftStrong,
  },

  loaderCore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
  },

  loaderIcon: {
    fontSize: 19,
    lineHeight: 21,
    fontWeight: typography.weights.bold,
  },

  message: {
    flexShrink: 1,
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    lineHeight: 20,
  },
});
