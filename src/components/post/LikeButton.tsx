import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { theme } from '../../theme';

type LikeButtonProps = {
  isLiked: boolean;
  likesCount: number;
  disabled?: boolean;
  onPress: () => void;
};

export function LikeButton({ isLiked, likesCount, disabled, onPress }: LikeButtonProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(withTiming(1.12, { duration: 120 }), withSpring(1));
  }, [likesCount, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable disabled={disabled} onPress={handlePress} style={[styles.button, disabled && styles.disabled]}>
      <Animated.View style={[styles.badge, isLiked && styles.badgeActive, animatedStyle]}>
        <Text style={styles.emoji}>{isLiked ? '♥' : '♡'}</Text>
        <Text style={[styles.count, isLiked && styles.countActive]}>{likesCount}</Text>
      </Animated.View>
      <View>
        <Text style={styles.label}>{isLiked ? 'Нравится вам' : 'Поддержать'}</Text>
        <Text style={styles.hint}>Обновляется мгновенно</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: '#E2D9F8',
    padding: theme.spacing.md,
  },
  disabled: {
    opacity: 0.6,
  },
  badge: {
    minWidth: 84,
    borderRadius: theme.radius.pill,
    backgroundColor: '#F1F1F4',
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  badgeActive: {
    backgroundColor: theme.semantic.primary,
  },
  emoji: {
    fontSize: 18,
    color: theme.colors.ink,
  },
  count: {
    fontSize: theme.typography.body,
    fontWeight: '800',
    color: theme.colors.ink,
  },
  countActive: {
    color: theme.colors.white,
  },
  label: {
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  hint: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.caption,
    marginTop: 2,
  },
});
