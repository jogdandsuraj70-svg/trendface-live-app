import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 overflow-hidden transition-colors duration-300">
      <!-- Outer Card Frame (Simulating a premium mobile aspect layout on web, responsive) -->
      <div class="w-full max-w-md h-[800px] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800/40 relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
        
        <!-- ================= PAGE 1: SPLASH SCREEN ================= -->
        @if (currentStep() === 'splash') {
          <div class="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
            <!-- App Logo (Diamond with cyan/pink gradient) -->
            <div class="h-28 w-28 rounded-3xl bg-gradient-to-tr from-brand-purple via-brand-cyan to-brand-pink p-6 flex items-center justify-center shadow-2xl shadow-brand-cyan/20 animate-pulse">
              <svg class="h-16 w-16 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 3h12l4 6-10 13L2 9z"></path>
                <path d="M11 3 8 9l3 13"></path>
                <path d="M13 3 16 9l-3 13"></path>
                <path d="M2 9h20"></path>
              </svg>
            </div>
            
            <h1 class="text-4xl font-extrabold tracking-tight mt-6 font-sans text-slate-850 dark:text-white">TrendFace</h1>
            
            <!-- Bottom progress info -->
            <div class="absolute bottom-16 left-8 right-8 flex flex-col items-center gap-4">
              <!-- Custom Pulse progress bar -->
              <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full w-2/3 bg-gradient-pulse rounded-full"></div>
              </div>
              <span class="text-xs font-bold tracking-widest text-slate-400 dark:text-slate-500 font-sans uppercase">Initializing Atelier...</span>
            </div>
          </div>
        }

        <!-- ================= PAGE 2: ONBOARDING DISCOVER TALENT ================= -->
        @if (currentStep() === 'discover') {
          <div class="flex-1 flex flex-col justify-between h-full animate-fade-in">
            <!-- Top Photographic Portrait (Cyan & Warm keylight woman) -->
            <div class="relative w-full h-[460px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600&h=800"
                class="w-full h-full object-cover object-center"
                alt="Talent Discovery"
              />
              
              <!-- Subtle gradient overlay that matches the background perfectly for organic fading -->
              <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-slate-900/40 dark:to-slate-900 transition-colors duration-300"></div>

              <!-- Top-right Skip Button -->
              <button
                (click)="skip()"
                class="absolute top-6 right-6 px-4 py-2 text-xs font-semibold rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md transition-all cursor-pointer">
                Skip
              </button>
            </div>

            <!-- Onboarding Content Card -->
            <div class="px-8 pb-10 flex flex-col items-center flex-1 justify-between gap-6 -mt-8 relative z-10">
              <div class="text-center space-y-3">
                <h2 class="text-2xl font-extrabold text-slate-850 dark:text-white tracking-tight font-sans">Discover Talent</h2>
                <p class="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed font-body">
                  Find top makeup artists and models for your next creative project.
                </p>
              </div>

              <!-- Carousel Indicators -->
              <div class="flex items-center gap-2">
                <span class="h-2 w-6 rounded-full bg-brand-cyan shadow-sm shadow-brand-cyan/20 transition-all duration-300"></span>
                <span class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></span>
                <span class="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></span>
              </div>

              <!-- Action Button CTA -->
              <div class="w-full">
                <app-button
                  variant="cyan"
                  size="lg"
                  (onClick)="next()"
                  customClass="shadow-lg shadow-brand-cyan/20">
                  <span class="flex items-center justify-center gap-2">
                    Next <i class="pi pi-arrow-right text-xs"></i>
                  </span>
                </app-button>
              </div>
            </div>
          </div>
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
export class OnboardingComponent implements OnInit {
  currentStep = signal<'splash' | 'discover'>('splash');

  constructor(private router: Router) {}

  ngOnInit() {
    // Automatically transition from splash to onboarding discover after 2.5 seconds
    setTimeout(() => {
      this.currentStep.set('discover');
    }, 2500);
  }

  next() {
    this.router.navigate(['/login']);
  }

  skip() {
    this.router.navigate(['/login']);
  }
}
