import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private activeTheme = signal<'light' | 'dark'>('light');
  theme = this.activeTheme.asReadonly();

  constructor() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('trendface-theme') as 'light' | 'dark';
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    // Set up an effect to apply theme classes to the document body whenever the signal changes
    effect(() => {
      const current = this.activeTheme();
      if (current === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      localStorage.setItem('trendface-theme', current);
    });
  }

  toggleTheme() {
    this.activeTheme.update(t => t === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: 'light' | 'dark') {
    this.activeTheme.set(theme);
  }

  isDark(): boolean {
    return this.activeTheme() === 'dark';
  }
}
