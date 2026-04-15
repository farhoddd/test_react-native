import type { FeedQueryParams, LikeResponse, PostDetailResponse, PostsResponse } from '../types/api';
import { apiClient } from './client';

export async function getPosts(params: FeedQueryParams = {}) {
  const { data } = await apiClient.get<PostsResponse>('/posts', {
    params: {
      limit: params.limit ?? 10,
      cursor: params.cursor,
      tier: params.tier,
      simulate_error: params.simulateError,
    },
  });

  return data;
}

export async function getPostById(id: string) {
  const { data } = await apiClient.get<PostDetailResponse>(`/posts/${id}`);
  return data;
}

export async function togglePostLike(id: string) {
  const { data } = await apiClient.post<LikeResponse>(`/posts/${id}/like`);
  return data;
}
