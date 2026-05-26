import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card';
import { ButtonComponent } from '../../shared/components/button';
import { EmptyStateComponent } from '../../shared/components/empty-state';
import { TalentService } from '../../services/talent.service';
import { Talent, MetricCard } from '../../models/talent';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="space-y-8">
      
      <!-- ================= SUMMARY METRIC CARDS ================= -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        @for (metric of metrics(); track metric.title) {
          <app-card [variant]="'elevated'" [hover]="true" [bodyPadding]="'p-5'">
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <p class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">{{ metric.title }}</p>
                <h3 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight font-sans">{{ metric.value }}</h3>
              </div>
              <div [class]="getMetricIconClass(metric)">
                <i [class]="metric.icon + ' text-base'"></i>
              </div>
            </div>
            
            <div class="mt-4 flex items-center gap-2">
              <span [class]="getMetricChangeClass(metric)">
                <i [class]="metric.changeType === 'increase' ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-left' + ' text-[10px]'"></i>
                {{ metric.change }}%
              </span>
              <span class="text-xs text-slate-400 dark:text-slate-500 font-body">{{ metric.description }}</span>
            </div>
          </app-card>
        }
      </div>

      <!-- ================= SEARCH AND FILTERS BAR ================= -->
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800/40 shadow-sm transition-colors duration-300">
        
        <!-- Search bar input -->
        <div class="relative w-full md:max-w-md">
          <i class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
            placeholder="Search talents by name, bio, or skills..."
            class="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-transparent outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/5 text-slate-850 dark:text-slate-100 transition-all font-sans"
          />
        </div>

        <!-- Filter Action Tags -->
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          
          <!-- Role select -->
          <div class="flex rounded-xl bg-slate-100 dark:bg-slate-800/60 p-1 transition-colors">
            @for (role of roles; track role) {
              <button
                (click)="setRole(role)"
                [class]="getActiveRoleClass(role)">
                {{ role }}
              </button>
            }
          </div>

          <!-- Availability filter -->
          <button
            (click)="toggleAvailableOnly()"
            [class]="getAvailabilityButtonClass()">
            <i class="pi pi-check-circle text-xs"></i>
            <span class="font-body select-none">Available Only</span>
          </button>

        </div>
      </div>

      <!-- ================= TALENTS DYNAMIC GRID ================= -->
      @if (isLoading()) {
        <!-- Skeleton Loader state -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="animate-pulse bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/40 p-6 space-y-6">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  <div class="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                </div>
              </div>
              <div class="h-12 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
              <div class="flex gap-2">
                <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                <div class="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        
        @if (filteredTalents().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (talent of filteredTalents(); track talent.id) {
              <app-card [variant]="'elevated'" [hover]="true" [bodyPadding]="'p-6'" class="relative flex flex-col justify-between">
                
                <!-- Availability Ring Indicator -->
                <span [class]="getAvailabilityIndicatorClass(talent.isAvailable)">
                  {{ talent.isAvailable ? 'Available' : 'Booked' }}
                </span>

                <div class="space-y-5">
                  <!-- Header: Avatar + Meta -->
                  <div class="flex items-start gap-4">
                    <img
                      [src]="talent.imageUrl"
                      class="h-16 w-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-850 shadow-inner"
                      [alt]="talent.name"
                    />
                    <div class="text-left space-y-1">
                      <h4 class="text-base font-bold text-slate-800 dark:text-white font-sans leading-none">{{ talent.name }}</h4>
                      <p class="text-xs font-semibold text-brand-cyan font-sans">{{ talent.role }}</p>
                      
                      <!-- Rating stars -->
                      <div class="flex items-center gap-1 text-amber-500 pt-0.5">
                        <i class="pi pi-star-fill text-[10px]"></i>
                        <span class="text-xs font-bold text-slate-700 dark:text-slate-350">{{ talent.rating | number:'1.1-1' }}</span>
                        <span class="text-[10px] text-slate-400">({{ talent.reviewsCount }})</span>
                      </div>
                    </div>
                  </div>

                  <!-- Bio -->
                  <p class="text-xs text-slate-400 dark:text-slate-500 font-body leading-relaxed text-left line-clamp-3">
                    {{ talent.bio }}
                  </p>

                  <!-- Skills Section -->
                  <div class="flex flex-wrap gap-1.5 justify-start">
                    @for (skill of talent.skills.slice(0, 3); track skill) {
                      <span class="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-sans">
                        {{ skill }}
                      </span>
                    }
                    @if (talent.skills.length > 3) {
                      <span class="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-brand-cyan/5 text-brand-cyan font-sans">
                        +{{ talent.skills.length - 3 }} more
                      </span>
                    }
                  </div>
                </div>

                <!-- Footer: Rates & Actions -->
                <div class="mt-6 pt-4 border-t border-slate-50 dark:border-slate-850/30 flex items-center justify-between">
                  <div class="text-left">
                    <p class="text-[10px] text-slate-400 uppercase tracking-wider font-sans">Hourly Rate</p>
                    <p class="text-base font-bold text-slate-800 dark:text-white font-sans mt-0.5">
                      \${{ talent.hourlyRate }}<span class="text-xs font-medium text-slate-400">/hr</span>
                    </p>
                  </div>
                  
                  <div class="w-auto">
                    <app-button
                      [variant]="talent.isAvailable ? 'cyan' : 'secondary'"
                      size="sm"
                      (onClick)="audition(talent)">
                      {{ talent.isAvailable ? 'Casting Call' : 'Notify Me' }}
                    </app-button>
                  </div>
                </div>

              </app-card>
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="animate-fade-in py-8">
            <app-empty-state
              icon="pi pi-users"
              title="No creatives matched"
              description="No models or makeup artists match your active search filters. Try clearing your search query or enabling availability filters."
              actionText="Reset Filters"
              actionIcon="pi pi-filter-slash"
              (onAction)="resetFilters()">
            </app-empty-state>
          </div>
        }

      }

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class DashboardComponent {
  // Signals for search and filters
  searchQuery = signal<string>('');
  selectedRole = signal<string>('All');
  availableOnly = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  roles = ['All', 'Makeup Artist', 'Model', 'Hairstylist'];

  // Computed metrics signal based on active availability counts
  metrics = computed<MetricCard[]>(() => {
    const list = this.talentService.talents();
    const available = list.filter(t => t.isAvailable).length;
    
    return [
      {
        title: 'Total Creative Talent',
        value: list.length,
        change: 14.5,
        changeType: 'increase',
        icon: 'pi pi-users',
        description: 'New signups this week'
      },
      {
        title: 'Available Now',
        value: available,
        change: 8.2,
        changeType: 'increase',
        icon: 'pi pi-check-circle',
        description: 'Ready to book instantly'
      },
      {
        title: 'Active Castings',
        value: '18 Campaigns',
        change: 12.0,
        changeType: 'increase',
        icon: 'pi pi-calendar-times',
        description: 'Across global brands'
      },
      {
        title: 'Casting Budget',
        value: '$48,250',
        change: 4.3,
        changeType: 'decrease',
        icon: 'pi pi-wallet',
        description: 'Remaining session budget'
      }
    ];
  });

  // Filtered talents computed signal
  filteredTalents = computed<Talent[]>(() => {
    const list = this.talentService.talents();
    const query = this.searchQuery().toLowerCase().trim();
    const role = this.selectedRole();
    const onlyAvailable = this.availableOnly();

    return list.filter(talent => {
      // Role match
      const roleMatch = role === 'All' || talent.role === role;
      
      // Availability match
      const availMatch = !onlyAvailable || talent.isAvailable;

      // Query match (Name, bio, skills)
      const queryMatch = !query || 
        talent.name.toLowerCase().includes(query) ||
        talent.bio.toLowerCase().includes(query) ||
        talent.skills.some(s => s.toLowerCase().includes(query)) ||
        talent.specialty.some(s => s.toLowerCase().includes(query));

      return roleMatch && availMatch && queryMatch;
    });
  });

  constructor(private talentService: TalentService) {}

  onSearchChange() {
    // Quick debounce simulation (no-op since signals evaluate instantly)
  }

  setRole(role: string) {
    this.isLoading.set(true);
    this.selectedRole.set(role);
    // Simulate brief skeleton load for realistic interaction experience
    setTimeout(() => {
      this.isLoading.set(false);
    }, 600);
  }

  toggleAvailableOnly() {
    this.availableOnly.update(v => !v);
  }

  resetFilters() {
    this.isLoading.set(true);
    this.searchQuery.set('');
    this.selectedRole.set('All');
    this.availableOnly.set(false);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  audition(talent: Talent) {
    alert(`Casting Call initiated for ${talent.name}! An automated booking invite has been compiled.`);
  }

  // Styles utility helpers
  getMetricIconClass(metric: MetricCard): string {
    const bg = {
      'pi pi-users': 'bg-brand-purple/10 text-brand-purple',
      'pi pi-check-circle': 'bg-brand-cyan/10 text-brand-cyan',
      'pi pi-calendar-times': 'bg-brand-pink/10 text-brand-pink',
      'pi pi-wallet': 'bg-amber-500/10 text-amber-550'
    }[metric.icon] || 'bg-slate-100 text-slate-500';

    return `h-10 w-10 flex items-center justify-center rounded-xl ${bg}`;
  }

  getMetricChangeClass(metric: MetricCard): string {
    const color = metric.changeType === 'increase' 
      ? 'text-green-500 bg-green-500/10' 
      : 'text-red-500 bg-red-500/10';
    return `text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${color}`;
  }

  getActiveRoleClass(role: string): string {
    const isActive = this.selectedRole() === role;
    const activeClass = 'bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-white font-bold';
    const inactiveClass = 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200';
    return `px-4 py-1.5 rounded-lg text-xs font-semibold font-sans cursor-pointer transition-all duration-200 ${isActive ? activeClass : inactiveClass}`;
  }

  getAvailabilityButtonClass(): string {
    const isActive = this.availableOnly();
    const activeClass = 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/35';
    const inactiveClass = 'border-slate-200 text-slate-400 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50';
    return `flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${isActive ? activeClass : inactiveClass}`;
  }

  getAvailabilityIndicatorClass(isAvailable: boolean): string {
    const style = isAvailable 
      ? 'bg-green-500/10 text-green-500 border border-green-500/10' 
      : 'bg-slate-150 text-slate-400 dark:bg-slate-800/40 dark:text-slate-500 border border-slate-200/20';
    return `absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-bold font-sans ${style}`;
  }
}
