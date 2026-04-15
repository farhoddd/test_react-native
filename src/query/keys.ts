import type { FeedTierFilter } from '../types/api';

export const queryKeys = {
  feed: (filter: FeedTierFilter, simulateError: boolean) => ['feed', filter, simulateError] as const,
  post: (postId: string) => ['post', postId] as const,
  comments: (postId: string) => ['post-comments', postId] as const,
};
