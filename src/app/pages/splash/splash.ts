import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full bg-white dark:bg-slate-900 flex flex-col items-center justify-between p-8 font-sans animate-screen-in select-none relative">
      
      <!-- Top Buffer spacing -->
      <div></div>

      <!-- Centered App Brand block -->
      <div class="flex flex-col items-center gap-5.5 -mt-16">
        <!-- Logo Gradient Rounded Card -->
        <div class="h-24 w-24 rounded-[22px] bg-gradient-to-tr from-brand-purple via-brand-cyan to-brand-pink p-5.5 flex items-center justify-center shadow-lg shadow-brand-cyan/15 animate-pulse">
          <!-- Sleek dark geometric diamond icon -->
          <svg class="h-13 w-13 text-slate-805" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 9l10 13 10-13-10-7zm0 3.32L18.18 9H12V5.32zM12 9H5.82L12 5.32V9zm0 2v7.73L5.05 11H12zm0 7.73V11h6.95L12 18.73z"/>
          </svg>
        </div>
        
        <!-- Brand Label -->
        <h1 class="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">TrendFace</h1>
      </div>

      <!-- Bottom loading trackers -->
      <div class="w-full flex flex-col items-center gap-4.5 mb-14">
        <!-- Progress track line -->
        <div class="w-full max-w-[250px] h-[3px] bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden relative">
          <!-- Progress sliding fill -->
          <div class="h-full bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink rounded-full w-full animate-progress-fill origin-left"></div>
        </div>
        
        <!-- Track label -->
        <span class="text-[9px] font-extrabold tracking-[0.22em] text-slate-400 dark:text-slate-500 uppercase font-sans">
          Initializing Atelier...
        </span>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `]
})
export class SplashComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Automatically navigate to Onboarding Slide 1 after progress bar fills
    setTimeout(() => {
      this.router.navigate(['/onboarding-1']);
    }, 3000);
  }
}
