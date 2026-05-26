import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <!-- Mobile Sidebar Overlay Backdrop -->
      <div
        *ngIf="isMobileOpen()"
        (click)="toggleMobileMenu()"
        class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300">
      </div>

      <!-- Responsive Sidebar Container -->
      <aside
        [class]="sidebarClass">
        <!-- Logo Header -->
        <div class="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/40 gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink p-2 flex items-center justify-center shadow-lg shadow-brand-purple/20">
            <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 3h12l4 6-10 13L2 9z"></path>
              <path d="M11 3 8 9l3 13"></path>
              <path d="M13 3 16 9l-3 13"></path>
              <path d="M2 9h20"></path>
            </svg>
          </div>
          <span class="text-xl font-bold tracking-tight font-sans text-gradient-cyan-pink">TrendFace</span>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-brand-purple/10 text-brand-purple dark:bg-brand-cyan/10 dark:text-brand-cyan border-l-4 border-brand-cyan pl-3"
              [routerLinkActiveOptions]="{exact: item.exact}"
              (click)="isMobileOpen.set(false)"
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all duration-200">
              <i [class]="item.icon + ' text-base'"></i>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <!-- Sidebar Footer Actions -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/10">
          <button
            (click)="logout()"
            class="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer">
            <i class="pi pi-sign-out text-base"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main Workspace Panel -->
      <div class="flex-1 flex flex-col lg:pl-64 min-w-0 bg-slate-50/50 dark:bg-slate-950/40">
        <!-- Sticky Top Navbar -->
        <header class="h-20 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/40 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
          <!-- Left Panel: Toggle Button & Title -->
          <div class="flex items-center gap-4">
            <button
              (click)="toggleMobileMenu()"
              class="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 lg:hidden cursor-pointer transition-colors">
              <i class="pi pi-bars text-lg"></i>
            </button>
            <div>
              <h1 class="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight font-sans">{{ getTitle() }}</h1>
              <p class="text-xs text-slate-400 dark:text-slate-500 hidden sm:block font-body">TrendFace Creative Workspace</p>
            </div>
          </div>

          <!-- Right Panel: Toggles & Profile Info -->
          <div class="flex items-center gap-4">
            <!-- Theme Switcher -->
            <button
              (click)="themeService.toggleTheme()"
              class="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-500 dark:text-slate-400 cursor-pointer transition-all duration-300">
              <i [class]="themeService.theme() === 'dark' ? 'pi pi-sun text-yellow-500' : 'pi pi-moon'"></i>
            </button>

            <!-- Vertical Divider -->
            <div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>

            <!-- Logged-in User Block -->
            <div class="flex items-center gap-3 pl-1">
              <img
                [src]="user()?.avatarUrl"
                class="h-9 w-9 rounded-full ring-2 ring-brand-cyan/20 object-cover shadow-sm"
                alt="Avatar"
              />
              <div class="hidden md:block text-left">
                <p class="text-xs font-semibold text-slate-850 dark:text-slate-200 leading-none">{{ user()?.name }}</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{{ user()?.role }}</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Workspace Body Pane -->
        <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div class="max-w-7xl mx-auto animate-fade-in">
            <router-outlet></router-outlet>
          </div>
        </main>
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
export class MainLayoutComponent {
  private authService = inject(AuthService);
  public themeService = inject(ThemeService);
  private router = inject(Router);

  isMobileOpen = signal(false);
  user = this.authService.user;

  navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'pi pi-th-large', exact: true },
    { label: 'Profile', path: '/profile', icon: 'pi pi-user', exact: false },
    { label: 'Settings', path: '/settings', icon: 'pi pi-cog', exact: false }
  ];

  constructor() {}

  toggleMobileMenu() {
    this.isMobileOpen.update(v => !v);
  }

  logout() {
    this.authService.logout();
  }

  getTitle(): string {
    const url = this.router.url;
    if (url.includes('/dashboard')) return 'Talent Dashboard';
    if (url.includes('/profile')) return 'Professional Profile';
    if (url.includes('/settings')) return 'Preferences & Settings';
    return 'TrendFace';
  }

  get sidebarClass(): string {
    const base = 'fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/40 flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0';
    const mobileState = this.isMobileOpen() ? 'translate-x-0' : '-translate-x-full';
    return `${base} ${mobileState}`;
  }
}
