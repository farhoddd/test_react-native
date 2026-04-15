import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../theme';
import type { Comment } from '../../types/api';
import { CommentItem } from './CommentItem';

type CommentListProps = {
  comments: Comment[];
  header: ReactElement | null;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  refreshing?: boolean;
};

export function CommentList({ comments, header, hasMore, isFetchingNextPage, onLoadMore, refreshing }: CommentListProps) {
  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.itemWrap}>
          <CommentItem comment={item} />
        </View>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Пока без комментариев</Text>
          <Text style={styles.emptyText}>Станьте первым, кто оставит отклик на публикацию.</Text>
        </View>
      }
      onEndReached={() => {
        if (hasMore && !isFetchingNextPage) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.35}
      contentContainerStyle={styles.content}
      refreshing={refreshing}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator color={theme.semantic.primary} />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 140,
  },
  itemWrap: {
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
  },
  emptyState: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    color: theme.semantic.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
  emptyText: {
    color: theme.semantic.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.body,
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
  },
});
