import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService, FilterCriteria } from '../../services/search.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrls: ['./filters.scss']
})
export class FiltersComponent implements OnInit {
  private searchService = inject(SearchService);
  private router = inject(Router);

  // Category chips
  categoryOptions = signal(['Makeup Artist', 'Model', 'Photographer', 'Stylist']);
  selectedCategories = signal<string[]>([]);

  // Location
  locationQuery = signal('');
  useCurrentLocation = signal(false);

  // Experience
  experienceLevels = signal(['Beginner', 'Intermediate', 'Professional']);
  selectedExperience = signal('');

  // Ratings
  ratingOptions = signal([3, 4, 4.5]);
  selectedRating = signal(0);

  // Budget Range
  budgetMin = signal(5000);
  budgetMax = signal(50000);

  // Availability
  availableNow = signal(false);
  availableThisWeek = signal(false);

  // Specialization
  specializationOptions = signal(['Bridal', 'Fashion', 'Editorial', 'Commercial', 'SFX']);
  selectedSpecializations = signal<string[]>([]);

  // Results count
  resultCount = signal(0);

  ngOnInit() {
    this.loadCurrentFilters();
    this.updateCount();
  }

  loadCurrentFilters() {
    const f = this.searchService.filters();
    this.selectedCategories.set([...f.categories]);
    this.locationQuery.set(f.location);
    this.selectedExperience.set(f.experienceLevel);
    this.selectedRating.set(f.rating);
    this.budgetMin.set(f.budgetMin);
    this.budgetMax.set(f.budgetMax);
    this.availableNow.set(f.availableNow);
    this.availableThisWeek.set(f.availableThisWeek);
    this.selectedSpecializations.set([...f.specializations]);
  }

  toggleCategory(cat: string) {
    const list = this.selectedCategories();
    if (list.includes(cat)) {
      this.selectedCategories.set(list.filter(c => c !== cat));
    } else {
      this.selectedCategories.set([...list, cat]);
    }
    this.updateCount();
  }

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories().includes(cat);
  }

  selectExperience(level: string) {
    this.selectedExperience.set(this.selectedExperience() === level ? '' : level);
    this.updateCount();
  }

  selectRating(rating: number) {
    this.selectedRating.set(this.selectedRating() === rating ? 0 : rating);
    this.updateCount();
  }

  toggleSpecialization(spec: string) {
    const list = this.selectedSpecializations();
    if (list.includes(spec)) {
      this.selectedSpecializations.set(list.filter(s => s !== spec));
    } else {
      this.selectedSpecializations.set([...list, spec]);
    }
    this.updateCount();
  }

  isSpecSelected(spec: string): boolean {
    return this.selectedSpecializations().includes(spec);
  }

  onBudgetMinChange(event: any) {
    let val = parseInt(event.target.value, 10);
    if (val >= this.budgetMax()) val = this.budgetMax() - 1000;
    this.budgetMin.set(val);
    this.updateCount();
  }

  onBudgetMaxChange(event: any) {
    let val = parseInt(event.target.value, 10);
    if (val <= this.budgetMin()) val = this.budgetMin() + 1000;
    this.budgetMax.set(val);
    this.updateCount();
  }

  toggleAvailableNow() {
    this.availableNow.set(!this.availableNow());
    this.updateCount();
  }

  toggleAvailableThisWeek() {
    this.availableThisWeek.set(!this.availableThisWeek());
    this.updateCount();
  }

  toggleCurrentLocation() {
    this.useCurrentLocation.set(!this.useCurrentLocation());
    if (this.useCurrentLocation()) {
      this.locationQuery.set('Mumbai, IN');
    } else {
      this.locationQuery.set('');
    }
    this.updateCount();
  }

  updateCount() {
    const filters: FilterCriteria = {
      categories: this.selectedCategories(),
      location: this.locationQuery(),
      experienceLevel: this.selectedExperience(),
      rating: this.selectedRating(),
      budgetMin: this.budgetMin(),
      budgetMax: this.budgetMax(),
      availableNow: this.availableNow(),
      availableThisWeek: this.availableThisWeek(),
      specializations: this.selectedSpecializations()
    };
    this.searchService.filters.set(filters);
    this.resultCount.set(this.searchService.getFilteredCount());
  }

  applyFilters() {
    this.updateCount();
    this.router.navigate(['/discover']);
  }

  clearAll() {
    this.selectedCategories.set([]);
    this.locationQuery.set('');
    this.useCurrentLocation.set(false);
    this.selectedExperience.set('');
    this.selectedRating.set(0);
    this.budgetMin.set(5000);
    this.budgetMax.set(50000);
    this.availableNow.set(false);
    this.availableThisWeek.set(false);
    this.selectedSpecializations.set([]);
    this.searchService.resetFilters();
    this.updateCount();
  }

  back() {
    this.router.navigate(['/discover']);
  }

  formatBudget(val: number): string {
    if (val >= 50000) return '₹50,000+';
    return '₹' + val.toLocaleString('en-IN');
  }
}
