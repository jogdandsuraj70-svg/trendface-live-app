import { Injectable, signal, computed, inject } from '@angular/core';
import { BlockService } from './block.service';

export interface ChatMessage {
  id: string;
  senderId: 'me' | string;
  senderName: string;
  text: string;
  timestamp: Date;
  read: boolean;
  mediaUrl?: string;
  isBookingCard?: boolean;
  bookingDetails?: {
    date: string;
    time: string;
    status: 'pending' | 'accepted' | 'declined';
  };
}

type BookingDetails = NonNullable<ChatMessage['bookingDetails']>;

export interface Conversation {
  id: string; // matches talent ID
  name: string;
  avatarUrl: string;
  role: string;
  online: boolean;
  typing: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  type: 'unread' | 'booking' | 'request' | 'normal';
  messages: ChatMessage[];
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private storageKey = 'trendface-conversations';
  private blockService = inject(BlockService);

  private conversationsList = signal<Conversation[]>(this.loadConversations());

  conversations = computed(() => {
    const list = this.conversationsList();
    const blockedIds = this.blockService.blockedUserIds();
    return list.filter((c: Conversation) => !blockedIds.includes(c.id));
  });

  constructor() {}

  private loadConversations(): Conversation[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Conversation[];
        // Map date strings back to Date objects
        return parsed.map((c: Conversation) => ({
          ...c,
          messages: c.messages.map((m: ChatMessage) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
      } catch (e) {
        console.warn('Failed parsing saved conversations, resetting', e);
      }
    }

    // Default mock data matching Figma
    return [
      {
        id: 'aarav-sharma',
        name: 'Aarav Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100',
        role: 'Fashion Model',
        online: true,
        typing: false,
        lastMessage: 'Can we schedule the bridal shoot for next week?',
        lastMessageTime: '10:30 AM',
        unreadCount: 1,
        type: 'unread',
        messages: [
          {
            id: 'm1',
            senderId: 'aarav-sharma',
            senderName: 'Aarav Sharma',
            text: 'Hey! I saw your casting list. I am extremely interested in collaborating on the high-fashion editorial.',
            timestamp: new Date(Date.now() - 3600000 * 2),
            read: true
          },
          {
            id: 'm2',
            senderId: 'me',
            senderName: 'Me',
            text: 'Hi Aarav! That sounds incredible, your portfolio matches our aesthetic perfectly.',
            timestamp: new Date(Date.now() - 3600000 * 1),
            read: true
          },
          {
            id: 'm3',
            senderId: 'aarav-sharma',
            senderName: 'Aarav Sharma',
            text: 'Can we schedule the bridal shoot for next week?',
            timestamp: new Date(Date.now() - 600000),
            read: false
          }
        ]
      },
      {
        id: 'priya-mehta',
        name: 'Priya Mehta',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100',
        role: 'Model',
        online: true,
        typing: true,
        lastMessage: 'Typing...',
        lastMessageTime: '09:45 AM',
        unreadCount: 0,
        type: 'normal',
        messages: [
          {
            id: 'p1',
            senderId: 'me',
            senderName: 'Me',
            text: 'Hi Priya, is your availability updated for the upcoming runway show?',
            timestamp: new Date(Date.now() - 3600000 * 3),
            read: true
          },
          {
            id: 'p2',
            senderId: 'priya-mehta',
            senderName: 'Priya Mehta',
            text: 'Yes! I just updated my availability calendar. Let me know if those slots work.',
            timestamp: new Date(Date.now() - 3600000 * 2),
            read: true
          }
        ]
      },
      {
        id: 'james-wilson',
        name: 'James Wilson',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100',
        role: 'Hairstylist',
        online: false,
        typing: false,
        lastMessage: 'The portfolio looks incredible, thanks for the quick feedback!',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        type: 'normal',
        messages: [
          {
            id: 'j1',
            senderId: 'james-wilson',
            senderName: 'James Wilson',
            text: 'The portfolio looks incredible, thanks for the quick feedback!',
            timestamp: new Date(Date.now() - 86400000),
            read: true
          }
        ]
      },
      {
        id: 'elena-rodriguez',
        name: 'Elena Rodriguez',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100&h=100',
        role: 'Makeup Artist',
        online: true,
        typing: false,
        lastMessage: "I've sent over the brief for the SFX makeup project",
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        type: 'request',
        messages: [
          {
            id: 'e1',
            senderId: 'elena-rodriguez',
            senderName: 'Elena Rodriguez',
            text: "I've sent over the brief for the SFX makeup project",
            timestamp: new Date(Date.now() - 86400000 - 3600000),
            read: true
          }
        ]
      },
      {
        id: 'marcus-chen',
        name: 'Marcus Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100',
        role: 'Creative Director',
        online: false,
        typing: false,
        lastMessage: 'Are you available for the runway show next month?',
        lastMessageTime: 'Oct 24',
        unreadCount: 0,
        type: 'booking',
        messages: [
          {
            id: 'ma1',
            senderId: 'marcus-chen',
            senderName: 'Marcus Chen',
            text: 'Are you available for the runway show next month?',
            timestamp: new Date(2023, 9, 24, 15, 30),
            read: true
          },
          {
            id: 'ma2',
            senderId: 'me',
            senderName: 'Me',
            text: 'Hey Marcus, yes I am! Let\'s draft a contract details card.',
            timestamp: new Date(2023, 9, 24, 16, 0),
            read: true
          },
          {
            id: 'ma3',
            senderId: 'marcus-chen',
            senderName: 'Marcus Chen',
            text: 'Awesome, sent a booking request slot.',
            timestamp: new Date(2023, 9, 24, 16, 5),
            read: true,
            isBookingCard: true,
            bookingDetails: {
              date: 'November 15, 2023',
              time: '10:00 AM',
              status: 'pending'
            }
          }
        ]
      }
    ];
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.conversationsList()));
  }

  getConversationById(id: string): Conversation | undefined {
    if (this.blockService.isBlocked(id)) return undefined;
    return this.conversationsList().find((c: Conversation) => c.id === id);
  }

  sendMessage(convoId: string, text: string, isBookingCard = false, bookingDetails?: BookingDetails): void {
    if (this.blockService.isBlocked(convoId)) return;

    this.conversationsList.update((list: Conversation[]) =>
      list.map((c: Conversation) => {
        if (c.id === convoId) {
          const newMsg: ChatMessage = {
            id: 'msg-' + Math.random().toString(36).substr(2, 9),
            senderId: 'me',
            senderName: 'Me',
            text: text,
            timestamp: new Date(),
            read: true,
            isBookingCard,
            bookingDetails
          };

          const updatedMsgs = [...c.messages, newMsg];
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: updatedMsgs
          };
        }
        return c;
      })
    );
    this.save();

    // Trigger mock responder simulation
    this.simulateResponse(convoId);
  }

  sendImageAttachment(convoId: string, text: string, mediaUrl: string): void {
    if (this.blockService.isBlocked(convoId)) return;

    this.conversationsList.update((list: Conversation[]) =>
      list.map((c: Conversation) => {
        if (c.id === convoId) {
          const newMsg: ChatMessage = {
            id: 'msg-' + Math.random().toString(36).substr(2, 9),
            senderId: 'me',
            senderName: 'Me',
            text,
            timestamp: new Date(),
            read: true,
            mediaUrl
          };

          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
    this.save();
    this.simulateResponse(convoId);
  }

  markAsRead(convoId: string): void {
    this.conversationsList.update((list: Conversation[]) =>
      list.map((c: Conversation) => {
        if (c.id === convoId) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m: ChatMessage) => ({ ...m, read: true }))
          };
        }
        return c;
      })
    );
    this.save();
  }

  updateBookingStatus(convoId: string, messageId: string, status: 'accepted' | 'declined'): void {
    this.conversationsList.update((list: Conversation[]) =>
      list.map((c: Conversation) => {
        if (c.id === convoId) {
          return {
            ...c,
            messages: c.messages.map((m: ChatMessage) => {
              if (m.id === messageId && m.isBookingCard && m.bookingDetails) {
                return {
                  ...m,
                  bookingDetails: {
                    ...m.bookingDetails,
                    status
                  }
                };
              }
              return m;
            })
          };
        }
        return c;
      })
    );
    this.save();
  }

  private simulateResponse(convoId: string): void {
    // Prevent automated response if blocked
    if (this.blockService.isBlocked(convoId)) return;

    // Simulate typing and response after 2 seconds
    setTimeout(() => {
      if (this.blockService.isBlocked(convoId)) return;

      this.conversationsList.update((list: Conversation[]) =>
        list.map((c: Conversation) => {
          if (c.id === convoId) {
            return { ...c, typing: true, lastMessage: 'Typing...' };
          }
          return c;
        })
      );

      setTimeout(() => {
        if (this.blockService.isBlocked(convoId)) return;

        this.conversationsList.update((list: Conversation[]) =>
          list.map((c: Conversation) => {
            if (c.id === convoId) {
              const replies: Record<string, string> = {
                'aarav-sharma': 'Perfect! I have sent over my booking availability calendar link. Let\'s make this project happen!',
                'priya-mehta': 'Awesome, works for me! Let\'s synchronize our portfolios soon.',
                'james-wilson': 'Great, will check the schedule tomorrow.',
                'elena-rodriguez': 'Sounds fantastic, let me know if you need anything else.',
                'marcus-chen': 'Super! Looking forward to working together!'
              };
              const text = replies[convoId] || 'That sounds great! I will get back to you shortly.';

              const newMsg: ChatMessage = {
                id: 'msg-' + Math.random().toString(36).substr(2, 9),
                senderId: convoId,
                senderName: c.name,
                text: text,
                timestamp: new Date(),
                read: false
              };

              return {
                ...c,
                typing: false,
                lastMessage: text,
                lastMessageTime: 'Just now',
                unreadCount: c.unreadCount + 1,
                messages: [...c.messages, newMsg]
              };
            }
            return c;
          })
        );
        this.save();
      }, 2000);
    }, 1500);
  }
}
