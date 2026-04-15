import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../theme';

type ScreenProps = PropsWithChildren<{
  header?: ReactNode;
  padded?: boolean;
}>;

export function Screen({ children, header, padded = true }: ScreenProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      {header ? <View style={styles.header}>{header}</View> : null}
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.semantic.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.spacing.lg,
  },
});
