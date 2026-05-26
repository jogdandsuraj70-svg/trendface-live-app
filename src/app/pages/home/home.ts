import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TalentService } from '../../services/talent.service';

interface FeaturedTalent {
  id: string;
  name: string;
  profession: string;
  rating: number;
  imageUrl: string;
  connectState: 'Connect' | 'Requested' | 'Connected';
}

interface TrendingProject {
  id: string;
  title: string;
  budget: string;
  bgImage: string;
  avatars: string[];
}

interface RecommendedCard {
  id: string;
  type: 'PORTFOLIO' | 'NEW PROJECT';
  title: string;
  subtitle: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private talentService = inject(TalentService);
  private router = inject(Router);

  // Dynamic user data signals
  username = signal<string>('Shekhar');
  profileImage = signal<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150');

  // Categories list
  categories = signal<string[]>(['Makeup Artists', 'Models', 'Photographers']);
  selectedCategory = signal<string>('Makeup Artists');

  // Skeleton Loaders
  isLoading = signal<boolean>(true);

  // Connection states
  private connectRequests = signal<Record<string, 'Requested' | 'Connected'>>({});

  // Dynamic Data Lists
  featuredTalents = signal<FeaturedTalent[]>([
    {
      id: '7',
      name: 'Zara Ahmed',
      profession: 'Makeup Artist',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=250',
      connectState: 'Connect'
    },
    {
      id: '1',
      name: 'Sofia Vercara',
      profession: 'Makeup Artist',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=250',
      connectState: 'Connect'
    },
    {
      id: '2',
      name: 'Julian Thorne',
      profession: 'Runway Model',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=250',
      connectState: 'Connect'
    }
  ]);

  trendingProjects = signal<TrendingProject[]>([
    {
      id: 'tp-1',
      title: 'Bridal Shoot in Mumbai',
      budget: '₹50,000+',
      bgImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=500&h=300',
      avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=80&h=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80'
      ]
    },
    {
      id: 'tp-2',
      title: 'Couture Editorial Runway',
      budget: '₹1,20,000+',
      bgImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=500&h=300',
      avatars: [
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=80&h=80',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80'
      ]
    }
  ]);

  recommendedItems = signal<RecommendedCard[]>([
    {
      id: 'rc-1',
      type: 'PORTFOLIO',
      title: 'Sasha Grey',
      subtitle: 'Editorial Model',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      id: 'rc-2',
      type: 'NEW PROJECT',
      title: 'Sneaker Dr.',
      subtitle: 'Product Styling',
      imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ]);

  ngOnInit() {
    this.loadUserContext();
    this.loadConnectRequests();
    this.simulateSkeletonLoader();
  }

  // Load username & profile photo dynamically
  loadUserContext() {
    const current = this.authService.user();
    if (current) {
      // Split full name to get first name
      const firstName = current.name ? current.name.split(' ')[0] : 'Shekhar';
      this.username.set(firstName);

      if (current.avatarUrl) {
        this.profileImage.set(current.avatarUrl);
      }
    }

    // Secondary local storage backup
    const extraProfileJson = localStorage.getItem('trendface-extra-profile');
    if (extraProfileJson) {
      try {
        const extra = JSON.parse(extraProfileJson);
        if (extra.username) {
          // If username exists but name wasn't formatted
          if (!current || !current.name) {
            this.username.set(extra.username);
          }
        }
        if (extra.photo) {
          this.profileImage.set(extra.photo);
        }
      } catch (e) {
        console.warn('Failed parsing local storage user details', e);
      }
    }
  }

  // Load and apply persistent connect requests from LocalStorage
  loadConnectRequests() {
    const saved = localStorage.getItem('trendface-connect-requests');
    if (saved) {
      try {
        const reqs = JSON.parse(saved);
        this.connectRequests.set(reqs);
        
        // Sync states with signals list
        this.featuredTalents.update(talents => 
          talents.map(t => ({
            ...t,
            connectState: reqs[t.id] || 'Connect'
          }))
        );
      } catch (e) {
        console.warn('Failed sync connect requests database', e);
      }
    }
  }

  // Simulate skeleton loaders
  simulateSkeletonLoader() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 900);
  }

  // Handle Dynamic Category Switching
  selectCategory(category: string) {
    if (this.selectedCategory() !== category) {
      this.selectedCategory.set(category);
      this.simulateSkeletonLoader();
    }
  }

  // Connect request sender mechanism
  sendConnectRequest(talentId: string, event: Event) {
    event.stopPropagation();

    const currentMap = this.connectRequests();
    const currentState = (currentMap[talentId] || 'Connect') as 'Connect' | 'Requested' | 'Connected';

    // Prevent duplicate triggers if already connected/requested
    if (currentState === 'Connected') return;

    let newState: 'Requested' | 'Connected' = 'Requested';

    if (currentState === 'Connect') {
      newState = 'Requested';
      
      // Simulate confirmation and move to connected after 1.5 seconds automatically
      setTimeout(() => {
        this.updateConnectState(talentId, 'Connected');
      }, 1500);
    }

    this.updateConnectState(talentId, newState);
  }

  // Core helper to update connections database
  private updateConnectState(talentId: string, state: 'Requested' | 'Connected') {
    this.connectRequests.update(map => {
      const updated = { ...map, [talentId]: state };
      localStorage.setItem('trendface-connect-requests', JSON.stringify(updated));
      return updated;
    });

    // Update list signals
    this.featuredTalents.update(talents =>
      talents.map(t => t.id === talentId ? { ...t, connectState: state } : t)
    );
  }

  // Get dynamic button styling classes
  getConnectButtonClass(state: 'Connect' | 'Requested' | 'Connected'): string {
    const base = 'w-full py-2.5 rounded-xl font-extrabold text-[10px] uppercase tracking-wider transition-all duration-300 active-tap';
    if (state === 'Connect') {
      return `${base} bg-brand-cyan hover:bg-opacity-92 text-slate-800 cursor-pointer`;
    } else if (state === 'Requested') {
      return `${base} bg-brand-purple/10 border border-brand-purple text-brand-purple cursor-wait`;
    } else {
      return `${base} bg-brand-purple text-white shadow-sm shadow-brand-purple/15 cursor-default`;
    }
  }

  // Navigation utilities
  openProfile() {
    this.router.navigate(['/creator-profile']);
  }

  triggerNotifications() {
    this.router.navigate(['/notifications']);
  }

  viewAllFeatured() {
    this.router.navigate(['/explore']);
  }

  openMessages() {
    this.router.navigate(['/messages']);
  }

  openSearch() {
    this.router.navigate(['/discover']);
  }

  openFilters() {
    this.router.navigate(['/filters']);
  }

  openTalentProfile(id: string) {
    this.router.navigate(['/profile', id]);
  }
}
