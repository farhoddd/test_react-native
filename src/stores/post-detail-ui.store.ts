import { makeAutoObservable } from 'mobx';

class PostDetailUiStore {
  drafts = new Map<string, string>();
  submittingByPost = new Map<string, boolean>();

  constructor() {
    makeAutoObservable(this);
  }

  getDraft(postId: string) {
    return this.drafts.get(postId) ?? '';
  }

  setDraft(postId: string, value: string) {
    this.drafts.set(postId, value);
  }

  setSubmitting(postId: string, value: boolean) {
    this.submittingByPost.set(postId, value);
  }

  isSubmitting(postId: string) {
    return this.submittingByPost.get(postId) ?? false;
  }

  clearDraft(postId: string) {
    this.drafts.set(postId, '');
  }
}

export const postDetailUiStore = new PostDetailUiStore();
