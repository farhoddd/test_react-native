import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { getPosts } from '../../src/api/posts';
import { PostCard } from '../../src/components/post/PostCard';
import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { useTogglePostLike } from '../../src/hooks/useTogglePostLike';
import { queryKeys } from '../../src/query/keys';
import { socketService } from '../../src/realtime/socket';
import { theme } from '../../src/theme';
import type { Post } from '../../src/types/api';

const FeedScreen = observer(function FeedScreen() {
  const router = useRouter();
  const { isLikePending, toggleLike } = useTogglePostLike();

  useEffect(() => socketService.subscribe(), []);

  const feedQuery = useInfiniteQuery({
    queryKey: queryKeys.feed('all', false),
    queryFn: ({ pageParam }) =>
      getPosts({
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
        limit: 10,
        tier: undefined,
        simulateError: false,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.data.hasMore ? (lastPage.data.nextCursor ?? undefined) : undefined),
  });

  const posts: Post[] = feedQuery.data?.pages.flatMap((page) => page.data.posts) ?? [];

  return (
    <Screen padded={false}>
      {feedQuery.isLoading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={theme.semantic.primary} size="large" />
          <Text style={styles.stateText}>Загружаем публикации...</Text>
        </View>
      ) : feedQuery.isError ? (
        <View style={styles.stateBox}>
          <Text style={styles.errorTitle}>Лента сейчас недоступна</Text>
          <Text style={styles.stateText}>{feedQuery.error instanceof Error ? feedQuery.error.message : 'Попробуйте обновить экран'}</Text>
          <Button fullWidth label="Повторить" loading={feedQuery.isRefetching} disabled={feedQuery.isRefetching} onPress={() => feedQuery.refetch()} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isLikePending={isLikePending(item.id)}
              onLikePress={() => toggleLike(item)}
              onPress={() => router.push({ pathname: '/post/[id]', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.stateBox}>
              <Text style={styles.errorTitle}>Публикаций пока нет</Text>
              <Text style={styles.stateText}>Обновите экран позже.</Text>
            </View>
          }
          contentContainerStyle={styles.content}
          onEndReached={() => {
            if (feedQuery.hasNextPage && !feedQuery.isFetchingNextPage) {
              void feedQuery.fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.45}
          ListFooterComponent={
            feedQuery.isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={theme.semantic.primary} />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={feedQuery.isRefetching && !feedQuery.isFetchingNextPage} onRefresh={() => feedQuery.refetch()} tintColor={theme.semantic.primary} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
});

export default FeedScreen;

const styles = StyleSheet.create({
  content: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
  },
  stateBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: 120,
  },
  stateText: {
    color: theme.semantic.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body,
  },
  errorTitle: {
    color: theme.semantic.text,
    fontWeight: '800',
    fontSize: theme.typography.title,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
  },
});
