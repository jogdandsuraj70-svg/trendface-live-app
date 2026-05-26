import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-2',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full w-full bg-white dark:bg-slate-900 flex flex-col justify-between animate-screen-in select-none">
      
      <!-- ================= TOP SECTION: COLLABORATION PHOTO ================= -->
      <div class="relative w-full h-[470px] overflow-hidden shrink-0">
        <!-- Unsplash premium creative workflow portrait matching reference exactly -->
        <img
          src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=600&h=800"
          class="w-full h-full object-cover object-center"
          alt="Connect & Collaborate Portrait"
        />
        
        <!-- Soft background fade transition overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-white/10 to-white dark:to-slate-900 transition-colors duration-300"></div>

        <!-- Skip pill top-right -->
        <button
          (click)="skip()"
          class="absolute top-6 right-6 px-4 py-1.5 text-xs font-semibold rounded-full bg-slate-950/45 hover:bg-slate-950/60 text-white backdrop-blur-md transition-all active-tap cursor-pointer">
          Skip
        </button>
      </div>

      <!-- ================= BOTTOM SECTION: BRAND TEXT & PAGINATION ================= -->
      <div class="px-8 pb-9 flex flex-col justify-between flex-1 -mt-6 relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl transition-colors duration-300">
        
        <!-- Heading group -->
        <div class="text-center space-y-3.5 pt-6">
          <h2 class="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight font-sans">
            Connect & Collaborate
          </h2>
          <p class="text-sm text-slate-450 dark:text-slate-500 font-body leading-relaxed max-w-[280px] mx-auto">
            Chat, plan, and collaborate seamlessly with professionals in the industry.
          </p>
        </div>

        <!-- Dots Pagination -->
        <div class="flex items-center justify-center gap-2 my-5">
          <!-- Inactive Dot -->
          <span class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800"></span>
          <!-- Active Dot (Gradient cyan/pink pill) -->
          <span class="h-2 w-6.5 rounded-full bg-gradient-to-r from-brand-cyan to-brand-pink shadow-sm shadow-brand-cyan/20"></span>
          <!-- Inactive Dot -->
          <span class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800"></span>
        </div>

        <!-- Next CTA Action -->
        <div class="w-full">
          <button
            (click)="next()"
            class="w-full py-4.5 rounded-2xl bg-brand-cyan hover:bg-opacity-92 text-white font-bold text-sm tracking-wide shadow-lg shadow-brand-cyan/15 transition-all active-tap cursor-pointer flex items-center justify-center gap-1.5">
            Next <i class="pi pi-arrow-right text-[10px]"></i>
          </button>
        </div>

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
export class OnboardingTwoComponent {
  constructor(private router: Router) {}

  next() {
    this.router.navigate(['/onboarding-3']);
  }

  skip() {
    this.router.navigate(['/onboarding-3']);
  }
}
