import type { CommentCreatedResponse, CommentsQueryParams, CommentsResponse } from '../types/api';
import { apiClient } from './client';

export async function getPostComments(params: CommentsQueryParams) {
  const { data } = await apiClient.get<CommentsResponse>(`/posts/${params.postId}/comments`, {
    params: {
      limit: params.limit ?? 20,
      cursor: params.cursor,
    },
  });

  return data;
}

export async function createPostComment(postId: string, text: string) {
  const { data } = await apiClient.post<CommentCreatedResponse>(`/posts/${postId}/comments`, {
    text,
  });

  return data;
}
