export type FeedTierFilter = 'all' | 'free' | 'paid';

export type ApiError = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

export type Author = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
};

export type Post = {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: 'free' | 'paid';
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
};

export type PostsResponse = {
  ok: true;
  data: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export type PostDetailResponse = {
  ok: true;
  data: {
    post: Post;
  };
};

export type LikeResponse = {
  ok: true;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
};

export type CommentsResponse = {
  ok: true;
  data: {
    comments: Comment[];
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export type CommentCreatedResponse = {
  ok: true;
  data: {
    comment: Comment;
  };
};

export type FeedQueryParams = {
  cursor?: string;
  limit?: number;
  tier?: Exclude<FeedTierFilter, 'all'>;
  simulateError?: boolean;
};

export type CommentsQueryParams = {
  postId: string;
  cursor?: string;
  limit?: number;
};
