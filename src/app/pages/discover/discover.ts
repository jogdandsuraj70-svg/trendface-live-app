import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { TalentService } from '../../services/talent.service';
import { AuthService } from '../../services/auth.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discover.html',
  styleUrls: ['./discover.scss']
})
export class DiscoverComponent implements OnInit {
  private searchService = inject(SearchService);
  private talentService = inject(TalentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = signal('');
  isLoading = signal(true);
  profileImage = signal('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100');

  // Categories
  categories = signal(['Makeup Artists', 'Models', 'Photographers']);
  selectedCategory = signal('Makeup Artists');

  // Trending tags
  trendingTags = signal(['#MumbaiFashion', '#BridalMakeup', '#RunwayModel', '#SFX']);

  // Filtered results
  displayedTalents = signal<Talent[]>([]);

  // Debounce timer
  private searchTimer: any;

  ngOnInit() {
    this.loadUserProfile();
    this.filterByCategory();
    this.simulateLoad();
  }

  loadUserProfile() {
    const user = this.authService.user();
    if (user?.avatarUrl) {
      this.profileImage.set(user.avatarUrl);
    }
  }

  simulateLoad() {
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 600);
  }

  // Search with debounce
  onSearchInput(event: any) {
    const query = event.target.value;
    this.searchQuery.set(query);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      if (query.trim()) {
        this.searchService.addToHistory(query.trim());
        const results = this.searchService.searchTalents(query);
        this.displayedTalents.set(this.searchService.filterTalents(results));
      } else {
        this.filterByCategory();
      }
    }, 300);
  }

  // Category filter
  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.searchQuery.set('');
    this.simulateLoad();
    this.filterByCategory();
  }

  filterByCategory() {
    const all = this.talentService.talents();
    const cat = this.selectedCategory();
    let filtered: Talent[];

    if (cat === 'Makeup Artists') {
      filtered = all.filter(t => t.role === 'Makeup Artist');
    } else if (cat === 'Models') {
      filtered = all.filter(t => t.role === 'Model');
    } else {
      filtered = all.filter(t => t.role === 'Creative Director' || t.role === 'Hairstylist');
    }

    this.displayedTalents.set(this.searchService.filterTalents(filtered));
  }

  // Trending tag click
  onTrendingClick(tag: string) {
    const cleanTag = tag.replace('#', '');
    this.searchQuery.set(cleanTag);
    this.searchService.addToHistory(cleanTag);
    const results = this.searchService.searchTalents(cleanTag);
    this.displayedTalents.set(results);
  }

  // Recent search click
  onRecentClick(term: string) {
    this.searchQuery.set(term);
    const results = this.searchService.searchTalents(term);
    this.displayedTalents.set(results);
  }

  // History
  get recentSearches() { return this.searchService.searchHistory(); }
  removeSearch(term: string) { this.searchService.removeHistoryItem(term); }
  clearAllSearches() { this.searchService.clearHistory(); }

  // Favorites
  isFavorite(id: string): boolean { return this.searchService.isFavorite(id); }
  toggleFavorite(id: string, event: Event) {
    event.stopPropagation();
    this.searchService.toggleFavorite(id);
  }

  // Navigation
  openProfile(id: string) { this.router.navigate(['/profile', id]); }
  openFilters() { this.router.navigate(['/filters']); }
  openNotifications() { this.router.navigate(['/notifications']); }
  goBack() { this.router.navigate(['/home']); }
}
