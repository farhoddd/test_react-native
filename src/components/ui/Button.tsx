import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';

import { theme } from '../../theme';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function Button({ label, loading, disabled, fullWidth, ...props }: ButtonProps) {
  const isDisabled = Boolean(disabled);

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.white} size="small" />
      ) : (
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.semantic.primary,
  },
  fullWidth: {
    width: '100%',
  },
  buttonPressed: {
    backgroundColor: theme.semantic.primaryPressed,
  },
  buttonDisabled: {
    backgroundColor: '#CDB8F0',
  },
  label: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: theme.typography.body,
  },
  labelDisabled: {
    color: 'rgba(255, 255, 255, 0.95)',
  },
});