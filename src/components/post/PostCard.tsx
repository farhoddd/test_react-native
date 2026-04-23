import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View, type GestureResponderEvent } from 'react-native';

import { theme } from '../../theme';
import type { Post } from '../../types/api';

type PostCardProps = {
  post: Post;
  isLikePending?: boolean;
  onLikePress?: () => void;
  onPress: () => void;
};

function formatDate(input: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(input));
}

export function PostCard({ post, isLikePending, onLikePress, onPress }: PostCardProps) {
  const isPaidPost = post.tier === 'paid';
  const canOpenPost = !isPaidPost;

  const handleLikePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onLikePress?.();
  };

  const handleDonatePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
  };

  return (
    <Pressable disabled={!canOpenPost} onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.authorRow}>
          <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
          <View style={styles.meta}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={styles.name}>{post.author.displayName}</Text>
              {post.author.isVerified ? <Text style={styles.verified}>●</Text> : null}
            </View>
            <Text numberOfLines={1} style={styles.subtitle}>@{post.author.username}</Text>
          </View>
        </View>
        <Text style={styles.handle}>{formatDate(post.createdAt)}</Text>
      </View>

      <View style={styles.coverWrap}>
        <Image source={{ uri: post.coverUrl }} style={[styles.cover, isPaidPost && styles.coverPaid]} />
        {isPaidPost ? (
          <View style={styles.paidOverlay}>
            <View style={styles.paidBlurLayer} />
            <View style={styles.paidTintLayer} />
            <View style={styles.paidBadge}>
              <View style={styles.paidBadgeInner}>
                <Feather color={theme.semantic.primary} name="dollar-sign" size={16} />
              </View>
            </View>
            <Text style={styles.paidText}>Контент скрыт пользователем.{`\n`}Доступ откроется после доната</Text>
            <Pressable onPress={handleDonatePress} style={({ pressed }) => [styles.paidButton, pressed && styles.paidButtonPressed]}>
              <Text style={styles.paidButtonLabel}>Отправить донат</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
      <View style={styles.content}>
        {!isPaidPost ? (
          <>
            <Text numberOfLines={2} style={styles.title}>{post.title}</Text>
          <Text numberOfLines={2} style={styles.preview}>{post.preview}</Text>
          </>
        ) : null}

        <View style={styles.footer}>
          <Pressable
            disabled={isLikePending || !onLikePress}
            onPress={handleLikePress}
            style={({ pressed }) => [
              styles.metricButton,
              post.isLiked && styles.metricButtonLiked,
              (pressed || isLikePending) && styles.metricButtonPressed,
            ]}
          >
            <Feather
              color={post.isLiked ? theme.colors.white : theme.semantic.textMuted}
              name="heart"
              size={16}
            />
            <Text style={[styles.metricLabel, post.isLiked && styles.metricLabelLiked]}>{post.likesCount}</Text>
          </Pressable>

          <View style={styles.metricButton}>
            <Feather color={theme.semantic.textMuted} name="message-circle" size={16} />
            <Text style={styles.metricLabel}>{post.commentsCount}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: theme.semantic.card,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    width: '100%',
    ...theme.shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: theme.spacing.sm,
  },
  meta: {
    flexShrink: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  verified: {
    color: theme.semantic.success,
    fontSize: 10,
  },
  handle: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.caption,
  },
  subtitle: {
    marginTop: 2,
    color: theme.semantic.textMuted,
    fontSize: theme.typography.caption,
  },
  cover: {
    width: '100%',
    height: 380,
    backgroundColor: theme.colors.line,
  },
  coverWrap: {
    position: 'relative',
  },
  coverPaid: {
    opacity: 0.24,
    transform: [{ scale: 1.08 }],
    filter: 'blur(10px)',
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  title: {
    color: theme.semantic.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 8,
  },
  preview: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  paidOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  paidBlurLayer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(22, 20, 26, 0.18)',
  },
  paidTintLayer: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(28, 22, 32, 0.52)',
  },
  paidBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.semantic.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  paidBadgeInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidText: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: theme.typography.subtitle,
    lineHeight: 28,
    fontWeight: '500',
    marginBottom: theme.spacing.lg,
    textShadowColor: 'rgba(0, 0, 0, 0.16)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  paidButton: {
    minWidth: 240,
    minHeight: 42,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.semantic.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  paidButtonPressed: {
    backgroundColor: theme.semantic.primaryPressed,
  },
  paidButtonLabel: {
    color: theme.colors.white,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  footer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  metricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: '#EEF1F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  metricButtonLiked: {
    backgroundColor: '#FF2E75',
  },
  metricButtonPressed: {
    opacity: 0.8,
  },
  metricLabel: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  metricLabelLiked: {
    color: theme.colors.white,
  },
});
