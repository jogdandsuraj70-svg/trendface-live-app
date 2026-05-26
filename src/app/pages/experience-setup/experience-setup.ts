import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-experience-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './experience-setup.html',
  styleUrls: ['./experience-setup.scss']
})
export class ExperienceSetupComponent {
  expForm: FormGroup;
  selectedLevel = signal<string>('INTERMEDIATE'); // Default intermediate as shown in Figma
  
  // Dynamic Specialties list
  specialtiesList = signal<string[]>(['Editorial', 'Bridal', 'Runway', 'SFX', 'Commercial']);
  selectedSpecialties = signal<string[]>(['Editorial', 'Runway']); // Default pre-selected tags matching Figma
  
  bioCharacterCount = signal<number>(0);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Regex validation for URLs
    const urlPattern = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?';
    
    this.expForm = this.fb.group({
      portfolioUrl: ['', [Validators.required, Validators.pattern(urlPattern)]],
      bio: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  selectLevel(level: string) {
    this.selectedLevel.set(level);
  }

  getLevelClass(level: string): string {
    const isSelected = this.selectedLevel() === level;
    const base = 'py-4.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all duration-300 active-tap';
    
    if (isSelected) {
      // Figma active level card: lavender-purple backdrop with border
      return `${base} bg-brand-purple/10 border-brand-purple text-brand-purple shadow-sm scale-[1.03] font-bold`;
    }
    // Idle level card
    return `${base} bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50`;
  }

  isSpecialtySelected(spec: string): boolean {
    return this.selectedSpecialties().includes(spec);
  }

  toggleSpecialty(spec: string) {
    const list = this.selectedSpecialties();
    if (list.includes(spec)) {
      this.selectedSpecialties.set(list.filter(s => s !== spec));
    } else {
      this.selectedSpecialties.set([...list, spec]);
    }
  }

  getSpecialtyClass(spec: string): string {
    const isSelected = this.isSpecialtySelected(spec);
    
    if (isSelected) {
      // Active chip: lavender/purple bg, light text, with close
      return 'bg-brand-purple/10 border-brand-purple text-brand-purple shadow-inner scale-[1.02] font-semibold';
    }
    // Idle chip
    return 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50';
  }

  addNewSpecialtyPrompt() {
    const customSpec = prompt('Enter your custom creative specialty:');
    if (customSpec && customSpec.trim() !== '') {
      const trimmed = customSpec.trim();
      const list = this.specialtiesList();
      if (!list.includes(trimmed)) {
        this.specialtiesList.set([...list, trimmed]);
      }
      // Auto-select newly added specialty
      const selected = this.selectedSpecialties();
      if (!selected.includes(trimmed)) {
        this.selectedSpecialties.set([...selected, trimmed]);
      }
    }
  }

  onBioInput(event: any) {
    const text = event.target.value;
    this.bioCharacterCount.set(text.length);
  }

  onSubmit() {
    this.errorMessage.set(null);

    if (this.expForm.valid) {
      this.isLoading.set(true);
      const { portfolioUrl, bio } = this.expForm.value;

      setTimeout(() => {
        // Save experience step context
        const extraExperienceData = {
          level: this.selectedLevel(),
          specialties: this.selectedSpecialties(),
          portfolioUrl: portfolioUrl,
          bio: bio
        };

        // Update AuthService bio and location to keep ProfileComponent green
        this.authService.updateProfile({
          bio: bio,
          website: portfolioUrl
        });

        localStorage.setItem('trendface-extra-experience', JSON.stringify(extraExperienceData));

        this.isLoading.set(false);
        this.router.navigate(['/portfolio-upload']);
      }, 1200);
    } else {
      this.expForm.markAllAsTouched();
      
      if (this.expForm.get('portfolioUrl')?.invalid) {
        this.errorMessage.set('Please enter a valid website portfolio URL.');
      } else if (this.expForm.get('bio')?.invalid) {
        this.errorMessage.set('Please write a brief creative bio description.');
      }
    }
  }

  back() {
    this.router.navigate(['/profile-setup']);
  }
}
