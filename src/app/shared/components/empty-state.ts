import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/20 dark:bg-slate-900/10 w-full">
      <!-- Icon Wrapper -->
      <div class="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-inner">
        <i [class]="icon + ' text-2xl'"></i>
      </div>
      
      <!-- Text Copy -->
      <h3 class="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1 font-sans">{{ title }}</h3>
      <p class="text-xs text-slate-400 dark:text-slate-500 max-w-sm mb-6 font-body leading-relaxed">{{ description }}</p>

      <!-- Optional Button CTA -->
      <div *ngIf="actionText" class="w-auto">
        <app-button
          variant="secondary"
          size="sm"
          [icon]="actionIcon"
          (onClick)="onAction.emit()">
          {{ actionText }}
        </app-button>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icon = 'pi pi-inbox';
  @Input() title = 'No results found';
  @Input() description = 'We couldn\'t find any records matching your selection. Try clearing your filters or try a new search.';
  @Input() actionText = '';
  @Input() actionIcon = '';

  @Output() onAction = new EventEmitter<void>();
}
