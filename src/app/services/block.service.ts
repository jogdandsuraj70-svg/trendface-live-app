import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private storageKey = 'trendface-blocked-users';

  blockedUserIds = signal<string[]>(this.loadBlockedUsers());

  constructor() {}

  private loadBlockedUsers(): string[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  blockUser(userId: string) {
    if (this.blockedUserIds().includes(userId)) return;

    this.blockedUserIds.update(list => {
      const updated = [...list, userId];
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });

    // Also remove any existing active connection requests from LocalStorage
    this.removeConnectionRequest(userId);
  }

  isBlocked(userId: string): boolean {
    return this.blockedUserIds().includes(userId);
  }

  unblockUser(userId: string) {
    this.blockedUserIds.update(list => {
      const updated = list.filter(id => id !== userId);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      return updated;
    });
  }

  private removeConnectionRequest(userId: string) {
    const saved = localStorage.getItem('trendface-connect-requests');
    if (saved) {
      try {
        const reqs = JSON.parse(saved);
        delete reqs[userId];
        localStorage.setItem('trendface-connect-requests', JSON.stringify(reqs));
      } catch (e) {
        console.warn('Failed cleaning connect requests for blocked user', e);
      }
    }
  }
}
