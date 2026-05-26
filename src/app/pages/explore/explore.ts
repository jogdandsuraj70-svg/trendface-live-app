import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TalentService } from '../../services/talent.service';
import { SearchService } from '../../services/search.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './explore.html',
  styleUrls: ['./explore.scss']
})
export class ExploreComponent implements OnInit {
  private talentService = inject(TalentService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  // Top Selected chips
  activeChips = signal<string[]>(['Model', 'Mumbai', '4★+']);
  allTalents = signal<Talent[]>([]);
  displayedTalents = signal<Talent[]>([]);

  // Bookmark Saved Notification
  savedToastName = signal('');
  showSavedToast = signal(false);

  ngOnInit() {
    this.loadTalents();
  }

  loadTalents() {
    // Expose registry from TalentService
    const all = this.talentService.talents();
    this.allTalents.set(all);
    this.applyFilterChips();
  }

  removeChip(chip: string) {
    this.activeChips.update(chips => chips.filter(c => c !== chip));
    this.applyFilterChips();
  }

  clearAll() {
    this.activeChips.set([]);
    this.applyFilterChips();
  }

  applyFilterChips() {
    const chips = this.activeChips();
    let list = this.allTalents();

    if (chips.includes('Model')) {
      list = list.filter(t => t.role === 'Model');
    }
    if (chips.includes('Mumbai')) {
      list = list.filter(t => t.location.toLowerCase().includes('mumbai'));
    }
    if (chips.includes('4★+')) {
      list = list.filter(t => t.rating >= 4.0);
    }

    this.displayedTalents.set(list);
  }

  isSaved(id: string): boolean {
    return this.searchService.isFavorite(id);
  }

  toggleSave(talent: Talent, event: Event) {
    event.stopPropagation();
    this.searchService.toggleFavorite(talent.id);

    if (this.isSaved(talent.id)) {
      this.savedToastName.set(talent.name);
      this.showSavedToast.set(true);
      setTimeout(() => this.showSavedToast.set(false), 3000);
    }
  }

  viewProfile(id: string) {
    this.router.navigate(['/profile', id]);
  }

  openSavedList() {
    this.router.navigate(['/saved-profiles']);
  }

  back() {
    this.router.navigate(['/home']);
  }

  openAdvancedFilters() {
    this.router.navigate(['/filters']);
  }
}
