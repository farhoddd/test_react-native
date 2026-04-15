export const colors = {
  ink: '#112031',
  inkMuted: '#526175',
  line: '#D7DEE7',
  canvas: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#F8F6FF',
  coral: '#6115CD',
  coralPressed: '#4C10A6',
  gold: '#F1B94A',
  teal: '#2A7F7C',
  moss: '#6C8B5E',
  verified: '#1F9D8B',
  danger: '#B74141',
  overlay: 'rgba(17, 32, 49, 0.12)',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  hero: 32,
  title: 22,
  subtitle: 18,
  body: 15,
  caption: 13,
  micro: 11,
} as const;

export const shadows = {
  card: {
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const;

export const motion = {
  quick: 140,
  medium: 220,
  slow: 320,
} as const;
