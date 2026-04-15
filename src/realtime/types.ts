import type { Comment } from '../types/api';

export type RealtimePingEvent = {
  type: 'ping';
};

export type LikeUpdatedEvent = {
  type: 'like_updated';
  postId: string;
  likesCount: number;
};

export type CommentAddedEvent = {
  type: 'comment_added';
  postId: string;
  comment: Comment;
};

export type RealtimeEvent = RealtimePingEvent | LikeUpdatedEvent | CommentAddedEvent;
