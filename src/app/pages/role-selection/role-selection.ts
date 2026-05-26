import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.html',
  styleUrls: ['./role-selection.scss']
})
export class RoleSelectionComponent {
  selectedRole = signal<'artist' | 'model'>('artist');
  
  private authService = inject(AuthService);
  private router = inject(Router);

  selectRole(role: 'artist' | 'model') {
    this.selectedRole.set(role);
  }

  confirm() {
    // Save selected role and navigate to signup
    this.authService.setSelectedRole(this.selectedRole());
    this.router.navigate(['/signup']);
  }

  // Reactive Card CSS utilities based on Signals
  getCardClass(role: 'artist' | 'model'): string {
    const active = this.selectedRole() === role;
    const base = 'w-full p-5 rounded-2xl cursor-pointer transition-all duration-300 border active-tap';
    
    if (active) {
      // Lavender-Purple active gradient style
      return `${base} bg-gradient-to-r from-brand-purple to-indigo-500 border-transparent shadow-md shadow-brand-purple/15 scale-[1.01]`;
    } else {
      // White/gray default border style
      return `${base} bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700`;
    }
  }

  getIconClass(role: 'artist' | 'model'): string {
    const active = this.selectedRole() === role;
    const base = 'h-11 w-11 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300';
    
    if (active) {
      // Soft translucent circle
      return `${base} bg-white/20 text-white`;
    } else {
      // Pink cameras backdrop
      const bg = role === 'artist' ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-pink/10 text-brand-pink';
      return `${base} ${bg}`;
    }
  }

  getTitleClass(role: 'artist' | 'model'): string {
    const active = this.selectedRole() === role;
    return `text-base font-bold font-sans leading-none ${active ? 'text-white' : 'text-slate-800 dark:text-white'}`;
  }

  getDescriptionClass(role: 'artist' | 'model'): string {
    const active = this.selectedRole() === role;
    return `text-[11px] leading-relaxed font-body ${active ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`;
  }
}
