import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService, Conversation } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrls: ['./messages.scss']
})
export class MessagesComponent implements OnInit {
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = signal('');
  selectedTab = signal<'all' | 'unread' | 'booking' | 'request'>('all');
  profileImage = signal('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100');

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const user = this.authService.user();
    if (user?.avatarUrl) {
      this.profileImage.set(user.avatarUrl);
    }
  }

  getFilteredConversations(): Conversation[] {
    const list = this.chatService.conversations();
    const tab = this.selectedTab();
    const query = this.searchQuery().trim().toLowerCase();

    let filtered = list;

    // Apply Tab Filter
    if (tab === 'unread') {
      filtered = list.filter(c => c.unreadCount > 0);
    } else if (tab === 'booking') {
      filtered = list.filter(c => c.type === 'booking');
    } else if (tab === 'request') {
      filtered = list.filter(c => c.type === 'request');
    }

    // Apply Search Query Filter
    if (query) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.role.toLowerCase().includes(query) ||
        c.lastMessage.toLowerCase().includes(query)
      );
    }

    return filtered;
  }

  selectTab(tab: 'all' | 'unread' | 'booking' | 'request') {
    this.selectedTab.set(tab);
  }

  openChat(id: string) {
    this.router.navigate(['/chat', id]);
  }

  openProfile() {
    this.router.navigate(['/creator-profile']);
  }

  triggerNewChat() {
    // Navigates to Explore to find new talents to chat
    this.router.navigate(['/explore']);
  }

  back() {
    this.router.navigate(['/home']);
  }
}
