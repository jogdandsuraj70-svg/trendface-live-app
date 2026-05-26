import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card';
import { ButtonComponent } from '../../shared/components/button';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- ================= LEFT: CONFIG NAVIGATION ================= -->
      <div class="space-y-4 lg:col-span-1 text-left">
        <div class="space-y-1">
          <h2 class="text-xl font-bold text-slate-800 dark:text-white tracking-tight font-sans">Settings & Control</h2>
          <p class="text-xs text-slate-400 dark:text-slate-500 font-body">Manage workspace parameters and styling variables.</p>
        </div>

        <nav class="space-y-1 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="activeTab.set(tab.id)"
              [class]="getTabClass(tab.id)">
              <i [class]="tab.icon + ' text-base'"></i>
              <span class="font-body">{{ tab.label }}</span>
            </button>
          }
        </nav>
      </div>

      <!-- ================= RIGHT: CONFIG WORKSPACE ================= -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- SECTION 1: THEME & COSMETICS -->
        @if (activeTab() === 'appearance') {
          <app-card [variant]="'elevated'" [title]="'Visual Theme Settings'" [subtitle]="'Switch between light and dark modes.'" class="animate-fade-in">
            <div class="space-y-6 text-left">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <!-- Light Theme Selector -->
                <div
                  (click)="themeService.setTheme('light')"
                  [class]="getThemeCardClass('light')">
                  <div class="h-24 w-full bg-slate-100 rounded-lg p-3 flex flex-col justify-between border border-slate-200/50 shadow-inner">
                    <div class="flex gap-1.5">
                      <span class="h-3 w-3 rounded-full bg-slate-350"></span>
                      <span class="h-3 w-3 rounded-full bg-slate-300"></span>
                    </div>
                    <div class="h-6 w-full bg-white rounded border border-slate-200/30"></div>
                  </div>
                  <div class="flex items-center justify-between mt-3 font-sans font-bold text-sm text-slate-800 dark:text-slate-200">
                    <span class="flex items-center gap-2"><i class="pi pi-sun text-yellow-500 text-xs"></i>Atelier Light</span>
                    <i *ngIf="themeService.theme() === 'light'" class="pi pi-check-circle text-brand-cyan"></i>
                  </div>
                </div>

                <!-- Dark Theme Selector -->
                <div
                  (click)="themeService.setTheme('dark')"
                  [class]="getThemeCardClass('dark')">
                  <div class="h-24 w-full bg-slate-950 rounded-lg p-3 flex flex-col justify-between border border-slate-800/50 shadow-inner">
                    <div class="flex gap-1.5">
                      <span class="h-3 w-3 rounded-full bg-slate-800"></span>
                      <span class="h-3 w-3 rounded-full bg-slate-700"></span>
                    </div>
                    <div class="h-6 w-full bg-slate-900 rounded border border-slate-800/30"></div>
                  </div>
                  <div class="flex items-center justify-between mt-3 font-sans font-bold text-sm text-slate-800 dark:text-slate-200">
                    <span class="flex items-center gap-2"><i class="pi pi-moon text-indigo-400 text-xs"></i>Atelier Obsidian</span>
                    <i *ngIf="themeService.theme() === 'dark'" class="pi pi-check-circle text-brand-cyan"></i>
                  </div>
                </div>

              </div>
            </div>
          </app-card>
        }

        <!-- SECTION 2: NOTIFICATIONS -->
        @if (activeTab() === 'notifications') {
          <app-card [variant]="'elevated'" [title]="'Notification Configuration'" [subtitle]="'Select which communication types you want to enable.'" class="animate-fade-in">
            <div class="space-y-5 text-left">
              
              @for (pref of notificationPrefs(); track pref.key) {
                <div class="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-850/35 last:border-none">
                  <div class="space-y-0.5">
                    <h5 class="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">{{ pref.title }}</h5>
                    <p class="text-xs text-slate-400 dark:text-slate-500 font-body">{{ pref.description }}</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      [checked]="pref.value"
                      (change)="toggleNotification(pref.key)"
                      class="sr-only peer"
                    />
                    <div class="w-10 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-cyan shadow-inner"></div>
                  </label>
                </div>
              }

              <!-- Save trigger -->
              <div class="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-850/30">
                <div class="w-auto">
                  <app-button
                    (onClick)="savePreferences()"
                    variant="gradient"
                    [loading]="isSaving()">
                    Save Preferences
                  </app-button>
                </div>
              </div>

            </div>
          </app-card>
        }

        <!-- SECTION 3: SECURITY -->
        @if (activeTab() === 'security') {
          <app-card [variant]="'elevated'" [title]="'Security Credentials'" [subtitle]="'Manage 2FA parameters and sandbox session limits.'" class="animate-fade-in">
            <div class="space-y-6 text-left">
              
              <!-- 2FA Toggle -->
              <div class="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-850/35">
                <div class="space-y-0.5">
                  <h5 class="text-sm font-semibold text-slate-800 dark:text-slate-100 font-sans">Two-Factor Authentication</h5>
                  <p class="text-xs text-slate-400 dark:text-slate-500 font-body">Verify casting operations via authentication codes.</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    [checked]="prefs().security.twoFactorEnabled"
                    (change)="toggle2FA()"
                    class="sr-only peer"
                  />
                  <div class="w-10 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-cyan shadow-inner"></div>
                </label>
              </div>

              <!-- Session timeout select dropdown -->
              <div class="space-y-2">
                <label for="session-timeout" class="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">Session Inactivity Timeout</label>
                <select
                  id="session-timeout"
                  [value]="prefs().security.sessionTimeout"
                  (change)="changeSessionTimeout($event)"
                  class="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-transparent outline-none focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/5 text-slate-850 dark:text-slate-100 transition-all font-sans cursor-pointer">
                  <option [value]="5">5 minutes</option>
                  <option [value]="15">15 minutes (Standard)</option>
                  <option [value]="30">30 minutes</option>
                  <option [value]="60">1 hour</option>
                </select>
              </div>

              <!-- Save trigger -->
              <div class="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-850/30">
                <div class="w-auto">
                  <app-button
                    (onClick)="savePreferences()"
                    variant="gradient"
                    [loading]="isSaving()">
                    Save Credentials
                  </app-button>
                </div>
              </div>

            </div>
          </app-card>
        }

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
export class SettingsComponent {
  public themeService = inject(ThemeService);
  private authService = inject(AuthService);

  activeTab = signal<'appearance' | 'notifications' | 'security'>('appearance');
  prefs = this.authService.preferences;
  isSaving = signal(false);

  tabs: { id: 'appearance' | 'notifications' | 'security'; label: string; icon: string }[] = [
    { id: 'appearance', label: 'Appearance & UI', icon: 'pi pi-palette' },
    { id: 'notifications', label: 'Notifications', icon: 'pi pi-bell' },
    { id: 'security', label: 'Security & Sandbox', icon: 'pi pi-shield' }
  ];

  notificationPrefs = computed(() => {
    const n = this.prefs().notifications;
    return [
      { key: 'email' as const, title: 'Email Alerts', description: 'Casting notifications sent directly to your inbox.', value: n.email },
      { key: 'push' as const, title: 'Push Alerts', description: 'Live desktop notifications about talent bookings.', value: n.push },
      { key: 'bookingRequests' as const, title: 'Casting Calls', description: 'Receive responses when talents accept your auditions.', value: n.bookingRequests },
      { key: 'marketing' as const, title: 'Marketing Communications', description: 'Brief updates about new creative talents in the area.', value: n.marketing }
    ];
  });

  constructor() {}

  toggleNotification(key: 'email' | 'push' | 'sms' | 'bookingRequests' | 'marketing') {
    const updatedNotifications = { ...this.prefs().notifications };
    updatedNotifications[key] = !updatedNotifications[key];
    this.authService.updatePreferences({ notifications: updatedNotifications });
  }

  toggle2FA() {
    const updatedSecurity = { ...this.prefs().security };
    updatedSecurity.twoFactorEnabled = !updatedSecurity.twoFactorEnabled;
    this.authService.updatePreferences({ security: updatedSecurity });
  }

  changeSessionTimeout(event: Event) {
    const timeout = parseInt((event.target as HTMLSelectElement).value, 10);
    const updatedSecurity = { ...this.prefs().security, sessionTimeout: timeout };
    this.authService.updatePreferences({ security: updatedSecurity });
  }

  savePreferences() {
    this.isSaving.set(true);
    setTimeout(() => {
      this.isSaving.set(false);
      alert('Your TrendFace preferences have been compiled and updated successfully!');
    }, 1000);
  }

  getTabClass(tabId: string): string {
    const isActive = this.activeTab() === tabId;
    const base = 'flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer';
    const activeClass = 'bg-brand-cyan/10 text-brand-cyan dark:bg-brand-cyan/5 border-l-4 border-brand-cyan pl-3 font-bold';
    const inactiveClass = 'text-slate-450 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40 hover:text-slate-800';
    return `${base} ${isActive ? activeClass : inactiveClass}`;
  }

  getThemeCardClass(theme: 'light' | 'dark'): string {
    const currentTheme = this.themeService.theme();
    const isSelected = currentTheme === theme;
    const border = isSelected 
      ? 'border-brand-cyan ring-4 ring-brand-cyan/10 scale-102' 
      : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:scale-101';
    
    return `rounded-2xl p-4.5 border-2 bg-white dark:bg-slate-900 cursor-pointer transition-all duration-300 flex flex-col justify-between ${border}`;
  }
}
