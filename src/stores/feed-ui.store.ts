import { makeAutoObservable } from 'mobx';

import type { FeedTierFilter } from '../types/api';

class FeedUiStore {
  activeFilter: FeedTierFilter = 'all';
  simulateError = false;

  constructor() {
    makeAutoObservable(this);
  }

  setFilter(value: FeedTierFilter) {
    this.activeFilter = value;
  }

  toggleSimulateError() {
    this.simulateError = !this.simulateError;
  }
}

export const feedUiStore = new FeedUiStore();
