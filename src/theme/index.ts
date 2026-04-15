import { colors, motion, radius, shadows, spacing, typography } from './tokens';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  motion,
  semantic: {
    background: colors.canvas,
    card: colors.surface,
    cardAccent: colors.surfaceElevated,
    text: colors.ink,
    textMuted: colors.inkMuted,
    border: colors.line,
    primary: colors.coral,
    primaryPressed: colors.coralPressed,
    accent: colors.gold,
    success: colors.verified,
    danger: colors.danger,
  },
} as const;
