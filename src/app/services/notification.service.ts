import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'connection_request' | 'message' | 'match' | 'engagement';
  section: 'new' | 'earlier';
  title: string;
  subtitle: string;
  avatarUrl: string;
  avatarUrl2?: string;
  timestamp: string;
  isRead: boolean;
  status: 'pending' | 'accepted' | 'ignored' | 'none';
  senderId?: string;
  senderRole?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private storageKey = 'trendface-notifications';
  private connectionsKey = 'trendface-user-connections';

  notifications = signal<Notification[]>(this.loadNotifications());
  connections = signal<string[]>(this.loadConnections());

  private loadNotifications(): Notification[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return this.getDefaultNotifications();
  }

  private loadConnections(): string[] {
    try {
      const raw = localStorage.getItem(this.connectionsKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  }

  private getDefaultNotifications(): Notification[] {
    return [
      {
        id: 'notif-1',
        type: 'connection_request',
        section: 'new',
        title: 'Aarav Sharma wants to connect with you.',
        subtitle: '2m ago • Digital Artist',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
        timestamp: '2m ago',
        isRead: false,
        status: 'pending',
        senderId: 'aarav-sharma',
        senderRole: 'Digital Artist'
      },
      {
        id: 'notif-2',
        type: 'message',
        section: 'new',
        title: 'Elena Rossi sent you a message.',
        subtitle: '"Hey! I saw your portfolio and..."',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100',
        timestamp: '15m ago',
        isRead: false,
        status: 'none',
        senderId: 'elena-rossi'
      },
      {
        id: 'notif-3',
        type: 'match',
        section: 'earlier',
        title: 'TrendFace Match',
        subtitle: 'New project matching your Urban profile: Fashion Week 24',
        avatarUrl: '',
        timestamp: '2h ago',
        isRead: true,
        status: 'none'
      },
      {
        id: 'notif-4',
        type: 'engagement',
        section: 'earlier',
        title: 'Marcus & 3 others liked your latest post.',
        subtitle: '',
        avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=100&h=100',
        avatarUrl2: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
        timestamp: '5h ago',
        isRead: true,
        status: 'none'
      }
    ];
  }

  private persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications()));
    localStorage.setItem(this.connectionsKey, JSON.stringify(this.connections()));
  }

  acceptConnection(notifId: string) {
    this.notifications.update(list =>
      list.map(n => n.id === notifId ? { ...n, status: 'accepted' as const, isRead: true } : n)
    );
    const notif = this.notifications().find(n => n.id === notifId);
    if (notif?.senderId) {
      this.connections.update(list => [...new Set([...list, notif.senderId!])]);
    }
    this.persist();
  }

  ignoreConnection(notifId: string) {
    this.notifications.update(list =>
      list.map(n => n.id === notifId ? { ...n, status: 'ignored' as const, isRead: true } : n)
    );
    this.persist();
  }

  markAsRead(notifId: string) {
    this.notifications.update(list =>
      list.map(n => n.id === notifId ? { ...n, isRead: true } : n)
    );
    this.persist();
  }

  getUnreadCount(): number {
    return this.notifications().filter(n => !n.isRead).length;
  }

  isConnected(senderId: string): boolean {
    return this.connections().includes(senderId);
  }

  resetNotifications() {
    const defaults = this.getDefaultNotifications();
    this.notifications.set(defaults);
    this.connections.set([]);
    this.persist();
  }
}
