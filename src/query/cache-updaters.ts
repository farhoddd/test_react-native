import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { Comment, CommentsResponse, FeedTierFilter, Post, PostDetailResponse, PostsResponse } from '../types/api';
import { queryKeys } from './keys';

function patchPostsPage(page: PostsResponse, postId: string, updater: (post: Post) => Post): PostsResponse {
  return {
    ...page,
    data: {
      ...page.data,
      posts: page.data.posts.map((post) => (post.id === postId ? updater(post) : post)),
    },
  };
}

function patchInfiniteFeed(
  current: InfiniteData<PostsResponse> | undefined,
  postId: string,
  updater: (post: Post) => Post,
) {
  if (!current) {
    return current;
  }

  return {
    ...current,
    pages: current.pages.map((page) => patchPostsPage(page, postId, updater)),
  };
}

export function updatePostCaches(queryClient: QueryClient, postId: string, updater: (post: Post) => Post) {
  const filters: FeedTierFilter[] = ['all', 'free', 'paid'];

  filters.forEach((filter) => {
    [false, true].forEach((simulateError) => {
      queryClient.setQueryData<InfiniteData<PostsResponse>>(
        queryKeys.feed(filter, simulateError),
        (current) => patchInfiniteFeed(current, postId, updater),
      );
    });
  });

  queryClient.setQueryData<PostDetailResponse>(queryKeys.post(postId), (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      data: {
        ...current.data,
        post: updater(current.data.post),
      },
    };
  });
}

export function applyLikeState(
  queryClient: QueryClient,
  postId: string,
  nextState: Pick<Post, 'isLiked' | 'likesCount'>,
) {
  updatePostCaches(queryClient, postId, (post) => ({
    ...post,
    isLiked: nextState.isLiked,
    likesCount: nextState.likesCount,
  }));
}

export function updateCommentsCount(queryClient: QueryClient, postId: string, delta: number) {
  updatePostCaches(queryClient, postId, (post) => ({
    ...post,
    commentsCount: Math.max(0, post.commentsCount + delta),
  }));
}

export function prependCommentToCache(queryClient: QueryClient, postId: string, comment: Comment) {
  queryClient.setQueryData<InfiniteData<CommentsResponse>>(queryKeys.comments(postId), (current) => {
    if (!current) {
      return {
        pages: [
          {
            ok: true,
            data: {
              comments: [comment],
              nextCursor: null,
              hasMore: false,
            },
          },
        ],
        pageParams: [undefined],
      };
    }

    const alreadyExists = current.pages.some((page) => page.data.comments.some((item) => item.id === comment.id));
    if (alreadyExists) {
      return current;
    }

    const [firstPage, ...restPages] = current.pages;
    return {
      ...current,
      pages: [
        {
          ...firstPage,
          data: {
            ...firstPage.data,
            comments: [comment, ...firstPage.data.comments],
          },
        },
        ...restPages,
      ],
    };
  });
}

export function removeCommentFromCache(queryClient: QueryClient, postId: string, commentId: string) {
  queryClient.setQueryData<InfiniteData<CommentsResponse>>(queryKeys.comments(postId), (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      pages: current.pages.map((page) => ({
        ...page,
        data: {
          ...page.data,
          comments: page.data.comments.filter((comment) => comment.id !== commentId),
        },
      })),
    };
  });
}
