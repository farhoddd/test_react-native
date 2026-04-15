import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { createPostComment, getPostComments } from '../../src/api/comments';
import { getPostById } from '../../src/api/posts';
import { CommentComposer } from '../../src/components/comments/CommentComposer';
import { CommentList } from '../../src/components/comments/CommentList';
import { LikeButton } from '../../src/components/post/LikeButton';
import { Button } from '../../src/components/ui/Button';
import { Screen } from '../../src/components/ui/Screen';
import { useTogglePostLike } from '../../src/hooks/useTogglePostLike';
import { prependCommentToCache, removeCommentFromCache, updateCommentsCount } from '../../src/query/cache-updaters';
import { queryKeys } from '../../src/query/keys';
import { socketService } from '../../src/realtime/socket';
import { postDetailUiStore } from '../../src/stores/post-detail-ui.store';
import { theme } from '../../src/theme';
import type { Comment } from '../../src/types/api';

function formatPostDate(input: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(input));
}

const PostDetailScreen = observer(function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => socketService.subscribe(), []);

  const postQuery = useQuery({
    queryKey: queryKeys.post(postId ?? ''),
    queryFn: () => getPostById(postId ?? ''),
    enabled: Boolean(postId),
  });

  const commentsQuery = useInfiniteQuery({
    queryKey: queryKeys.comments(postId ?? ''),
    queryFn: ({ pageParam }) =>
      getPostComments({
        postId: postId ?? '',
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
        limit: 20,
      }),
    initialPageParam: undefined as string | undefined,
    enabled: Boolean(postId),
    getNextPageParam: (lastPage) => (lastPage.data.hasMore ? (lastPage.data.nextCursor ?? undefined) : undefined),
  });

  const post = postQuery.data?.data.post;
  const comments = useMemo(() => commentsQuery.data?.pages.flatMap((page) => page.data.comments) ?? [], [commentsQuery.data]);
  const draft = postId ? postDetailUiStore.getDraft(postId) : '';
  const isSubmitting = postId ? postDetailUiStore.isSubmitting(postId) : false;
  const { isLikePending, toggleLike } = useTogglePostLike();

  const commentMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!postId) {
        throw new Error('Post ID is required');
      }

      return createPostComment(postId, text);
    },
    onMutate: async (text) => {
      if (!postId || !post) {
        return undefined;
      }

      const optimisticComment: Comment = {
        id: `optimistic-${Date.now()}`,
        postId,
        text,
        createdAt: new Date().toISOString(),
        author: post.author,
      };

      prependCommentToCache(queryClient, postId, optimisticComment);
      updateCommentsCount(queryClient, postId, 1);
      return { optimisticCommentId: optimisticComment.id };
    },
    onError: (_error, _text, context) => {
      if (!postId || !context?.optimisticCommentId) {
        return;
      }

      removeCommentFromCache(queryClient, postId, context.optimisticCommentId);
      updateCommentsCount(queryClient, postId, -1);
    },
    onSuccess: (response, _text, context) => {
      if (!postId) {
        return;
      }

      if (context?.optimisticCommentId) {
        removeCommentFromCache(queryClient, postId, context.optimisticCommentId);
        updateCommentsCount(queryClient, postId, -1);
      }

      prependCommentToCache(queryClient, postId, response.data.comment);
      updateCommentsCount(queryClient, postId, 1);
      postDetailUiStore.clearDraft(postId);
    },
    onSettled: () => {
      if (postId) {
        postDetailUiStore.setSubmitting(postId, false);
      }
    },
  });

  const header = post ? (
    <View style={styles.headerContainer}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backLabel}>Назад</Text>
      </Pressable>
      <Image source={{ uri: post.coverUrl }} style={styles.cover} />
      <View style={styles.authorRow}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.authorMeta}>
          <Text style={styles.authorName}>{post.author.displayName}</Text>
          <Text style={styles.authorSecondary}>@{post.author.username} · {formatPostDate(post.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      {post.body ? (
        <Text style={styles.body}>{post.body}</Text>
      ) : (
        <View style={styles.lockedCard}>
          <Text style={styles.lockedTitle}>Платный материал</Text>
          <Text style={styles.lockedText}>Для платных публикаций API возвращает пустой body. Экран показывает корректный locked-state без ошибки загрузки.</Text>
        </View>
      )}
      <LikeButton
        isLiked={post.isLiked}
        likesCount={post.likesCount}
        disabled={isLikePending(post.id)}
        onPress={() => {
          if (post) {
            toggleLike(post);
          }
        }}
      />
      <View style={styles.commentsHeader}>
        <Text style={styles.commentsTitle}>Комментарии</Text>
        <Text style={styles.commentsCount}>{post.commentsCount}</Text>
      </View>
    </View>
  ) : null;

  if (!postId) {
    return (
      <Screen>
        <View style={styles.centerState}>
          <Text style={styles.errorTitle}>Post ID отсутствует</Text>
        </View>
      </Screen>
    );
  }

  if (postQuery.isLoading) {
    return (
      <Screen>
        <View style={styles.centerState}>
          <ActivityIndicator color={theme.semantic.primary} size="large" />
          <Text style={styles.stateText}>Загружаем публикацию...</Text>
        </View>
      </Screen>
    );
  }

  if (postQuery.isError || !post) {
    return (
      <Screen padded={false}>
        <View style={styles.errorScreen}>
          <View style={styles.errorCard}>
            <Image source={require('../../assets/illustration_sticker.png')} style={styles.errorIllustration} />
            <Text style={styles.errorTitle}>Не удалось загрузить публикацию</Text>
            <Button fullWidth label="Повторить" loading={postQuery.isRefetching} disabled={postQuery.isRefetching} onPress={() => postQuery.refetch()} />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <View style={styles.screenWrap}>
      <Screen padded={false}>
        <CommentList
          comments={comments}
          header={header}
          hasMore={Boolean(commentsQuery.hasNextPage)}
          isFetchingNextPage={commentsQuery.isFetchingNextPage}
          onLoadMore={() => void commentsQuery.fetchNextPage()}
          refreshing={commentsQuery.isRefetching && !commentsQuery.isFetchingNextPage}
        />
      </Screen>
      <CommentComposer
        value={draft}
        disabled={isSubmitting}
        onChangeText={(value) => postDetailUiStore.setDraft(postId, value)}
        onSubmit={() => {
          const trimmed = draft.trim();
          if (!trimmed) {
            return;
          }

          postDetailUiStore.setSubmitting(postId, true);
          commentMutation.mutate(trimmed);
        }}
      />
    </View>
  );
});

export default PostDetailScreen;

const styles = StyleSheet.create({
  screenWrap: {
    flex: 1,
    backgroundColor: theme.semantic.background,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  errorScreen: {
    flex: 1,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: 4,
  },
  errorCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingTop: 28,
    paddingBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  errorIllustration: {
    width: 156,
    height: 156,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  stateText: {
    color: theme.semantic.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.body,
  },
  errorTitle: {
    color: theme.semantic.text,
    fontSize: theme.typography.title,
    fontWeight: '800',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: theme.spacing.md,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(17, 32, 49, 0.08)',
  },
  backLabel: {
    color: theme.semantic.text,
    fontWeight: '700',
  },
  cover: {
    width: '100%',
    height: 240,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: theme.spacing.sm,
  },
  authorMeta: {
    flex: 1,
  },
  authorName: {
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    fontWeight: '800',
  },
  authorSecondary: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.caption,
    marginTop: 2,
  },
  title: {
    color: theme.semantic.text,
    fontSize: theme.typography.title,
    fontWeight: '900',
    marginBottom: theme.spacing.sm,
  },
  body: {
    color: theme.semantic.text,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  lockedCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(241, 185, 74, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(156, 105, 0, 0.15)',
  },
  lockedTitle: {
    color: theme.semantic.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  lockedText: {
    color: theme.semantic.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
  commentsHeader: {
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentsTitle: {
    color: theme.semantic.text,
    fontSize: theme.typography.subtitle,
    fontWeight: '800',
  },
  commentsCount: {
    color: theme.colors.white,
    backgroundColor: theme.colors.teal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
    fontWeight: '800',
  },
});
