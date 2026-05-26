import { Component, signal, inject, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatService, Conversation } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('chatFeed') private chatFeed?: ElementRef<HTMLElement>;

  convoId = signal('');
  conversation = signal<Conversation | null>(null);
  newMessageText = signal('');
  showAttachMenu = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.convoId.set(id);
      const found = this.chatService.getConversationById(id);
      if (found) {
        this.conversation.set(found);
        this.chatService.markAsRead(id);
      }
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (!this.chatFeed) return;

      this.chatFeed.nativeElement.scrollTop = this.chatFeed.nativeElement.scrollHeight;
    } catch {
      // The feed may not exist while Angular is switching routes.
    }
  }

  sendMessage(): void {
    const text = this.newMessageText().trim();
    if (!text || !this.convoId()) return;

    this.chatService.sendMessage(this.convoId(), text);
    this.newMessageText.set('');

    // Re-sync conversation signal
    this.refreshConversation();
  }

  refreshConversation(): void {
    const found = this.chatService.getConversationById(this.convoId());
    if (found) {
      this.conversation.set(found);
    }
  }

  toggleAttachMenu(): void {
    this.showAttachMenu.set(!this.showAttachMenu());
  }

  attachImage(): void {
    // Simulates image upload attachment
    if (!this.convoId()) return;
    this.showAttachMenu.set(false);
    this.chatService.sendImageAttachment(
      this.convoId(),
      'Sent a photo attachment',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400&h=300'
    );
    this.refreshConversation();
  }

  attachBookingRequest(): void {
    // Navigates to `/availability/:id` so they can schedule a booking!
    this.showAttachMenu.set(false);
    this.router.navigate(['/availability', this.convoId()]);
  }

  acceptBooking(msgId: string): void {
    this.chatService.updateBookingStatus(this.convoId(), msgId, 'accepted');
    this.refreshConversation();
  }

  declineBooking(msgId: string): void {
    this.chatService.updateBookingStatus(this.convoId(), msgId, 'declined');
    this.refreshConversation();
  }

  reportUser(): void {
    this.router.navigate(['/report-user', this.convoId()]);
  }

  viewProfile(): void {
    this.router.navigate(['/profile', this.convoId()]);
  }

  back(): void {
    this.router.navigate(['/messages']);
  }
}
