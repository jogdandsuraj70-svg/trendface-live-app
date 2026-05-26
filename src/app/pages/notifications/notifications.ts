import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsComponent {
  private notifService = inject(NotificationService);
  private router = inject(Router);

  isLoading = signal(true);
  acceptedIds = signal<string[]>([]);
  ignoredIds = signal<string[]>([]);

  constructor() {
    setTimeout(() => this.isLoading.set(false), 500);
  }

  get newNotifications(): Notification[] {
    return this.notifService.notifications().filter(n => n.section === 'new' && !this.ignoredIds().includes(n.id));
  }

  get earlierNotifications(): Notification[] {
    return this.notifService.notifications().filter(n => n.section === 'earlier');
  }

  acceptConnection(notifId: string) {
    this.notifService.acceptConnection(notifId);
    this.acceptedIds.update(list => [...list, notifId]);
  }

  ignoreConnection(notifId: string) {
    this.notifService.ignoreConnection(notifId);
    this.ignoredIds.update(list => [...list, notifId]);
  }

  isAccepted(notifId: string): boolean {
    return this.acceptedIds().includes(notifId) ||
           this.notifService.notifications().find(n => n.id === notifId)?.status === 'accepted';
  }

  onMessageClick(notif: Notification) {
    this.notifService.markAsRead(notif.id);
    alert('Chat feature coming soon! Message from: ' + notif.title.split(' sent')[0]);
  }

  back() {
    this.router.navigate(['/home']);
  }
}
