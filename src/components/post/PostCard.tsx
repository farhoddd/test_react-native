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
  const showMore = post.preview.trim().length > 72;

  const handleLikePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onLikePress?.();
  };

  return (
    <Pressable onPress={onPress} style={styles.card}>
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

      <Image source={{ uri: post.coverUrl }} style={styles.cover} />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{post.title}</Text>
        <Text numberOfLines={2} style={styles.preview}>{post.preview}</Text>

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
  moreLabel: {
    marginTop: 4,
    color: theme.semantic.primary,
    fontSize: theme.typography.body,
    fontWeight: '600',
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
