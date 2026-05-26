import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardComponent } from '../../shared/components/card';
import { InputComponent } from '../../shared/components/input';
import { ButtonComponent } from '../../shared/components/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CardComponent, InputComponent, ButtonComponent],
  template: `
    <div class="space-y-8">
      
      <!-- ================= COVER HEADER BRAND ================= -->
      <app-card [variant]="'elevated'" [bodyPadding]="'p-0'">
        <!-- Stylized cover visual background -->
        <div class="h-44 w-full bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink relative overflow-hidden">
          <div class="absolute inset-0 bg-slate-900/10 dark:bg-slate-950/20 mix-blend-multiply"></div>
          <!-- Abstract waves -->
          <div class="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
          <div class="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-2xl"></div>
        </div>
        
        <!-- Info block -->
        <div class="px-6 pb-6 text-left relative flex flex-col md:flex-row items-center md:items-end gap-5 -mt-10">
          <img
            [src]="user()?.avatarUrl"
            class="h-24 w-24 rounded-3xl border-4 border-white dark:border-slate-900 object-cover shadow-lg relative z-10"
            alt="User Avatar"
          />
          <div class="flex-1 space-y-1 mb-1 text-center md:text-left">
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight font-sans">{{ user()?.name }}</h2>
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <span class="text-brand-cyan"><i class="pi pi-briefcase mr-1 text-[10px]"></i>{{ user()?.role }}</span>
              <span class="hidden sm:inline">•</span>
              <span><i class="pi pi-map-marker mr-1 text-[10px]"></i>{{ user()?.location }}</span>
              <span class="hidden sm:inline">•</span>
              <span><i class="pi pi-building mr-1 text-[10px]"></i>{{ user()?.company }}</span>
            </div>
          </div>
          <div class="w-auto flex gap-2">
            <app-button variant="outline" size="sm" icon="pi pi-share-alt">Share Profile</app-button>
          </div>
        </div>
      </app-card>

      <!-- ================= DETAIL GRID WORKSPACE ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- LEFT PANEL: EDIT FORM (2 Columns wide) -->
        <div class="lg:col-span-2 space-y-6">
          <app-card [variant]="'elevated'" [title]="'Edit Professional Details'" [subtitle]="'Update your visual resume and contact fields.'">
            
            <form [formGroup]="profileForm" (ngSubmit)="onSave()" class="space-y-4 text-left">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Name -->
                <app-input
                  formControlName="name"
                  id="profile-name"
                  label="Full Name"
                  type="text"
                  placeholder="Enter your name"
                  icon="pi pi-user"
                  [error]="getControlError('name')">
                </app-input>

                <!-- Email -->
                <app-input
                  formControlName="email"
                  id="profile-email"
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon="pi pi-envelope"
                  [error]="getControlError('email')">
                </app-input>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Role -->
                <app-input
                  formControlName="role"
                  id="profile-role"
                  label="Professional Role"
                  type="text"
                  placeholder="e.g. Art Director"
                  icon="pi pi-briefcase"
                  [error]="getControlError('role')">
                </app-input>

                <!-- Location -->
                <app-input
                  formControlName="location"
                  id="profile-location"
                  label="Studio Location"
                  type="text"
                  placeholder="e.g. Milan, IT"
                  icon="pi pi-map-marker"
                  [error]="getControlError('location')">
                </app-input>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Phone -->
                <app-input
                  formControlName="phone"
                  id="profile-phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  icon="pi pi-phone"
                  [error]="getControlError('phone')">
                </app-input>

                <!-- Company -->
                <app-input
                  formControlName="company"
                  id="profile-company"
                  label="Agency / Company"
                  type="text"
                  placeholder="e.g. Atelier Labs"
                  icon="pi pi-building"
                  [error]="getControlError('company')">
                </app-input>
              </div>

              <!-- Website -->
              <app-input
                formControlName="website"
                id="profile-website"
                label="Portfolio Link"
                type="url"
                placeholder="www.yourportfolio.com"
                icon="pi pi-link"
                [error]="getControlError('website')">
              </app-input>

              <!-- Bio TextArea -->
              <div class="relative w-full mb-4">
                <label for="profile-bio" class="block text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider font-sans">Biography</label>
                <textarea
                  id="profile-bio"
                  formControlName="bio"
                  rows="4"
                  placeholder="Write a brief intro..."
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-transparent outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/5 text-slate-850 dark:text-slate-100 transition-all font-sans leading-relaxed resize-none"
                ></textarea>
              </div>

              <!-- Actions -->
              <div class="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-850/30">
                <div class="w-auto">
                  <app-button
                    type="submit"
                    variant="gradient"
                    [loading]="isSaving()"
                    [disabled]="profileForm.invalid">
                    Save Changes
                  </app-button>
                </div>
              </div>

            </form>
          </app-card>
        </div>

        <!-- RIGHT PANEL: CASTING STATS & PORTFOLIO -->
        <div class="space-y-6">
          <!-- Casting Stats Card -->
          <app-card [variant]="'elevated'" [title]="'Atelier Casting Stats'">
            <div class="space-y-4 text-left">
              @for (stat of stats; track stat.label) {
                <div class="flex justify-between items-center py-2.5 border-b border-slate-50 dark:border-slate-850/35 last:border-none">
                  <div>
                    <h5 class="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">{{ stat.value }}</h5>
                    <p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-body">{{ stat.label }}</p>
                  </div>
                  <div [class]="'h-8 w-8 rounded-lg flex items-center justify-center ' + stat.color">
                    <i [class]="stat.icon + ' text-xs'"></i>
                  </div>
                </div>
              }
            </div>
          </app-card>

          <!-- Campaign Gallery -->
          <app-card [variant]="'elevated'" [title]="'Recent Campaign Portfolios'">
            <div class="grid grid-cols-2 gap-3.5 mt-2">
              @for (img of gallery; track img) {
                <div class="relative group rounded-xl overflow-hidden h-28 cursor-pointer shadow-sm">
                  <img
                    [src]="img"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt="Portfolio Campaign"
                  />
                  <div class="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors"></div>
                </div>
              }
            </div>
          </app-card>
        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  profileForm: FormGroup;
  user = this.authService.user;
  isSaving = signal(false);

  stats = [
    { label: 'Casted Campaigns', value: '14 Active', icon: 'pi pi-calendar-check', color: 'bg-brand-purple/10 text-brand-purple' },
    { label: 'Talents Auditioned', value: '48 Casts', icon: 'pi pi-users', color: 'bg-brand-cyan/10 text-brand-cyan' },
    { label: 'Atelier Hires', value: '9 Hired', icon: 'pi pi-star-fill', color: 'bg-brand-pink/10 text-brand-pink' },
    { label: 'Budget Utilization', value: '74.2%', icon: 'pi pi-chart-line', color: 'bg-amber-500/10 text-amber-500' }
  ];

  gallery = [
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=256&h=256',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=256&h=256',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=256&h=256',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256&h=256'
  ];

  constructor() {
    const current = this.user();
    this.profileForm = this.fb.group({
      name: [current?.name || '', [Validators.required]],
      email: [current?.email || '', [Validators.required, Validators.email]],
      role: [current?.role || '', [Validators.required]],
      location: [current?.location || '', [Validators.required]],
      phone: [current?.phone || ''],
      company: [current?.company || ''],
      website: [current?.website || ''],
      bio: [current?.bio || '']
    });
  }

  getControlError(field: string): string {
    const control = this.profileForm.get(field);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'This field is required.';
      }
      if (control.errors?.['email']) {
        return 'Please enter a valid email address.';
      }
    }
    return '';
  }

  onSave() {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      setTimeout(() => {
        this.authService.updateProfile(this.profileForm.value);
        this.isSaving.set(false);
        alert('Your TrendFace atelier profile has been updated successfully!');
      }, 1000);
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
}
