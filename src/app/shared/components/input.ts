import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative w-full mb-4">
      <div class="relative flex items-center">
        <!-- Optional Left Icon -->
        <i *ngIf="icon" [class]="icon + ' absolute left-4 text-slate-400 dark:text-slate-500 text-sm pointer-events-none'"></i>
        
        <!-- Native Input Element -->
        <input
          [type]="isPassword && showPassword ? 'text' : type"
          [id]="id"
          [placeholder]="placeholder || ' '"
          [disabled]="disabled"
          [class]="inputClass"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
        
        <!-- Sleek Floating Label -->
        <label
          [for]="id"
          [class]="labelClass">
          {{ label }}
        </label>

        <!-- Toggle Password Visibility (Eye Icon) -->
        <button
          *ngIf="isPassword"
          type="button"
          (click)="togglePasswordVisibility()"
          class="absolute right-4 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200 cursor-pointer focus:outline-none transition-colors">
          <i [class]="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
        </button>
      </div>

      <!-- Validation Error Message -->
      <p *ngIf="error" class="mt-1.5 text-xs text-red-500 animate-fade-in pl-1 flex items-center gap-1">
        <i class="pi pi-exclamation-circle text-[10px]"></i>
        <span>{{ error }}</span>
      </p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    
    /* Perfect Floating Label transitions */
    input:placeholder-shown ~ label {
      transform: translateY(0.75rem) scale(1);
    }
    
    input:focus ~ label,
    input:not(:placeholder-shown) ~ label {
      transform: translateY(-0.65rem) scale(0.8);
      background-color: transparent;
      padding: 0 4px;
    }

    .dark-theme input:focus ~ label,
    .dark-theme input:not(:placeholder-shown) ~ label {
      color: var(--color-brand-cyan);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = 'input-' + Math.random().toString(36).substring(2, 9);
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() icon = '';
  @Input() error = '';
  @Input() disabled = false;

  value = '';
  showPassword = false;

  get isPassword(): boolean {
    return this.type === 'password';
  }

  get inputClass(): string {
    const base = 'w-full px-4 py-3 text-sm rounded-xl border bg-transparent transition-all duration-300 outline-none placeholder-transparent font-sans';
    const paddingLeft = this.icon ? 'pl-11' : 'pl-4';
    const paddingRight = this.isPassword ? 'pr-11' : 'pr-4';
    
    let borderTheme = 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 focus:border-brand-cyan focus:ring-4 focus:ring-brand-cyan/10';
    if (this.error) {
      borderTheme = 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10';
    }

    return `${base} ${paddingLeft} ${paddingRight} ${borderTheme} text-slate-800 dark:text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed`;
  }

  get labelClass(): string {
    const base = 'absolute left-4 top-0 text-sm text-slate-400 dark:text-slate-500 pointer-events-none transition-all duration-300 origin-[0_0] font-sans';
    const leftMargin = this.icon ? 'left-11' : 'left-4';
    let labelColor = 'text-slate-400 dark:text-slate-500';
    if (this.error) {
      labelColor = 'text-red-500';
    }

    return `${base} ${leftMargin} ${labelColor}`;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // ControlValueAccessor Boilerplate
  onChange: any = () => {};
  onTouched: any = () => {};

  onInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
