import { Injectable, signal } from '@angular/core';
import { TalentService } from './talent.service';
import { Talent } from '../models/talent';

export interface FilterCriteria {
  categories: string[];
  location: string;
  experienceLevel: string;
  rating: number;
  budgetMin: number;
  budgetMax: number;
  availableNow: boolean;
  availableThisWeek: boolean;
  specializations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private historyKey = 'trendface-search-history';
  private favoritesKey = 'trendface-favorites';

  searchHistory = signal<string[]>(this.loadHistory());
  favorites = signal<string[]>(this.loadFavorites());

  filters = signal<FilterCriteria>({
    categories: [],
    location: '',
    experienceLevel: '',
    rating: 0,
    budgetMin: 5000,
    budgetMax: 50000,
    availableNow: false,
    availableThisWeek: false,
    specializations: []
  });

  constructor(private talentService: TalentService) {}

  private loadHistory(): string[] {
    try {
      const raw = localStorage.getItem(this.historyKey);
      return raw ? JSON.parse(raw) : ['Bridal', 'Fashion Model', 'Editorial'];
    } catch { return ['Bridal', 'Fashion Model', 'Editorial']; }
  }

  private loadFavorites(): string[] {
    try {
      const raw = localStorage.getItem(this.favoritesKey);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  }

  addToHistory(term: string) {
    const list = this.searchHistory().filter(t => t !== term);
    list.unshift(term);
    const trimmed = list.slice(0, 10);
    this.searchHistory.set(trimmed);
    localStorage.setItem(this.historyKey, JSON.stringify(trimmed));
  }

  removeHistoryItem(term: string) {
    const list = this.searchHistory().filter(t => t !== term);
    this.searchHistory.set(list);
    localStorage.setItem(this.historyKey, JSON.stringify(list));
  }

  clearHistory() {
    this.searchHistory.set([]);
    localStorage.setItem(this.historyKey, JSON.stringify([]));
  }

  toggleFavorite(talentId: string) {
    const list = this.favorites();
    const updated = list.includes(talentId)
      ? list.filter(id => id !== talentId)
      : [...list, talentId];
    this.favorites.set(updated);
    localStorage.setItem(this.favoritesKey, JSON.stringify(updated));
  }

  isFavorite(talentId: string): boolean {
    return this.favorites().includes(talentId);
  }

  searchTalents(query: string): Talent[] {
    const all = this.talentService.talents();
    if (!query.trim()) return all;
    const q = query.toLowerCase();
    return all.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.specialty.some(s => s.toLowerCase().includes(q)) ||
      t.location.toLowerCase().includes(q) ||
      t.bio.toLowerCase().includes(q)
    );
  }

  filterTalents(talents: Talent[]): Talent[] {
    const f = this.filters();
    let result = [...talents];

    if (f.categories.length > 0) {
      result = result.filter(t => f.categories.some(c => {
        if (c === 'Makeup Artist') return t.role === 'Makeup Artist';
        if (c === 'Model') return t.role === 'Model';
        if (c === 'Photographer') return t.role === 'Creative Director'; // map for now
        if (c === 'Stylist') return t.role === 'Hairstylist';
        return false;
      }));
    }

    if (f.location) {
      result = result.filter(t => t.location.toLowerCase().includes(f.location.toLowerCase()));
    }

    if (f.experienceLevel) {
      if (f.experienceLevel === 'Beginner') {
        result = result.filter(t => t.experienceYears <= 3);
      } else if (f.experienceLevel === 'Intermediate') {
        result = result.filter(t => t.experienceYears > 3 && t.experienceYears <= 7);
      } else if (f.experienceLevel === 'Professional') {
        result = result.filter(t => t.experienceYears > 7);
      }
    }

    if (f.rating > 0) {
      result = result.filter(t => t.rating >= f.rating);
    }

    if (f.budgetMin > 5000 || f.budgetMax < 50000) {
      result = result.filter(t => t.hourlyRate * 10 >= f.budgetMin && t.hourlyRate * 10 <= f.budgetMax);
    }

    if (f.availableNow) {
      result = result.filter(t => t.isAvailable);
    }

    if (f.specializations.length > 0) {
      result = result.filter(t => f.specializations.some(s => t.specialty.some(ts => ts.toLowerCase().includes(s.toLowerCase()))));
    }

    return result;
  }

  getFilteredCount(): number {
    const all = this.talentService.talents();
    return this.filterTalents(all).length;
  }

  resetFilters() {
    this.filters.set({
      categories: [],
      location: '',
      experienceLevel: '',
      rating: 0,
      budgetMin: 5000,
      budgetMax: 50000,
      availableNow: false,
      availableThisWeek: false,
      specializations: []
    });
  }
}
