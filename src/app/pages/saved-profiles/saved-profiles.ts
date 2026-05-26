import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-saved-profiles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './saved-profiles.html',
  styleUrls: ['./saved-profiles.scss']
})
export class SavedProfilesComponent implements OnInit {
  private searchService = inject(SearchService);
  private talentService = inject(TalentService);
  private router = inject(Router);

  savedTalents = signal<Talent[]>([]);

  ngOnInit() {
    this.loadSavedProfiles();
  }

  loadSavedProfiles() {
    const list = this.talentService.talents();
    const favs = this.searchService.favorites();
    const filtered = list.filter(t => favs.includes(t.id));
    this.savedTalents.set(filtered);
  }

  removeBookmark(id: string, event: Event) {
    event.stopPropagation();
    this.searchService.toggleFavorite(id);
    this.loadSavedProfiles();
  }

  viewProfile(id: string) {
    this.router.navigate(['/profile', id]);
  }

  back() {
    this.router.navigate(['/explore']);
  }
}
