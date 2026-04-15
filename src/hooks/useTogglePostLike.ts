import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { togglePostLike } from '../api/posts';
import { applyLikeState } from '../query/cache-updaters';
import type { Post } from '../types/api';

export function useTogglePostLike() {
  const queryClient = useQueryClient();
  const [pendingPostIds, setPendingPostIds] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async (currentPost: Post) => togglePostLike(currentPost.id),
    onMutate: async (currentPost) => {
      setPendingPostIds((current) => (current.includes(currentPost.id) ? current : [...current, currentPost.id]));

      await Promise.all([
        queryClient.cancelQueries({ queryKey: ['feed'] }),
        queryClient.cancelQueries({ queryKey: ['post', currentPost.id] }),
      ]);

      const previousState = {
        isLiked: currentPost.isLiked,
        likesCount: currentPost.likesCount,
      };

      applyLikeState(queryClient, currentPost.id, {
        isLiked: !currentPost.isLiked,
        likesCount: Math.max(0, currentPost.likesCount + (currentPost.isLiked ? -1 : 1)),
      });

      return { previousState, postId: currentPost.id };
    },
    onError: (_error, currentPost, context) => {
      if (context?.previousState) {
        applyLikeState(queryClient, currentPost.id, context.previousState);
      }
    },
    onSuccess: (response, currentPost) => {
      applyLikeState(queryClient, currentPost.id, response.data);
    },
    onSettled: (_data, _error, currentPost) => {
      setPendingPostIds((current) => current.filter((postId) => postId !== currentPost.id));
    },
  });

  return {
    toggleLike: mutation.mutate,
    isLikePending: (postId: string) => pendingPostIds.includes(postId),
  };
}