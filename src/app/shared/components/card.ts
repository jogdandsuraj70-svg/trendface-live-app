import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClass">
      <!-- Card Header -->
      <div *ngIf="title || subtitle || hasHeader" class="px-6 py-4 border-b border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
        <div>
          <h3 *ngIf="title" class="text-base font-semibold text-slate-800 dark:text-slate-100 font-sans">{{ title }}</h3>
          <p *ngIf="subtitle" class="text-xs text-slate-400 dark:text-slate-500 mt-1 font-body">{{ subtitle }}</p>
        </div>
        <ng-content select="[card-header]"></ng-content>
      </div>

      <!-- Card Body -->
      <div [class]="bodyPadding">
        <ng-content></ng-content>
      </div>

      <!-- Card Footer -->
      <div *ngIf="hasFooter" class="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800/40 rounded-b-2xl">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() variant: 'flat' | 'elevated' | 'glass' | 'borderless' = 'elevated';
  @Input() hover = false;
  @Input() hasHeader = false;
  @Input() hasFooter = false;
  @Input() bodyPadding = 'p-6';
  @Input() customClass = '';

  get cardClass(): string {
    const base = 'rounded-2xl transition-all duration-300 overflow-hidden w-full';
    
    const variants = {
      flat: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40',
      elevated: 'bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-slate-800/20 shadow-md shadow-slate-100 dark:shadow-none',
      glass: 'glass-panel shadow-sm shadow-slate-100/30 dark:shadow-none',
      borderless: 'bg-transparent border-none'
    };

    const hoverStyle = this.hover 
      ? 'hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none hover:border-slate-200 dark:hover:border-slate-700/60' 
      : '';

    return `${base} ${variants[this.variant]} ${hoverStyle} ${this.customClass}`;
  }
}
