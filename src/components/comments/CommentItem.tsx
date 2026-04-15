import { Image, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';
import type { Comment } from '../../types/api';

type CommentItemProps = {
  comment: Comment;
};

function formatTime(input: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  }).format(new Date(input));
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: comment.author.avatarUrl }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{comment.author.displayName}</Text>
          <Text style={styles.timestamp}>{formatTime(comment.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: 4,
  },
  name: {
    color: theme.semantic.text,
    fontWeight: '700',
    flex: 1,
  },
  timestamp: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.micro,
  },
  text: {
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    lineHeight: 20,
  },
});
