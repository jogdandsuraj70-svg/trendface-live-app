import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClass"
      (click)="onButtonClick($event)">
      <!-- Loading Spinner -->
      <svg *ngIf="loading" class="mr-2 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <!-- Icon -->
      <i *ngIf="icon && !loading" [class]="icon + ' mr-2 text-sm'"></i>
      <!-- Button Text -->
      <span class="inline-flex items-center">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'gradient' | 'danger' | 'cyan' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon = '';
  @Input() customClass = '';

  @Output() onClick = new EventEmitter<MouseEvent>();

  onButtonClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }

  get buttonClass(): string {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer w-full';
    
    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base'
    };

    const variants = {
      primary: 'bg-brand-purple hover:bg-opacity-90 text-white shadow-md shadow-brand-purple/20 focus:ring-brand-purple',
      cyan: 'bg-brand-cyan hover:bg-opacity-90 text-white shadow-md shadow-brand-cyan/20 focus:ring-brand-cyan',
      secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-400',
      outline: 'bg-transparent border border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-slate-400',
      gradient: 'bg-gradient-to-r from-brand-purple via-brand-cyan to-brand-pink hover:opacity-95 text-white shadow-lg shadow-brand-purple/20 focus:ring-brand-cyan',
      danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-red-500'
    };

    return `${base} ${sizes[this.size]} ${variants[this.variant]} ${this.customClass}`;
  }
}
