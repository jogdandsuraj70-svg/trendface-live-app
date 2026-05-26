import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-setup.html',
  styleUrls: ['./profile-setup.scss']
})
export class ProfileSetupComponent implements OnInit {
  profileForm: FormGroup;
  photoPreview = signal<string | null>(null);
  selectedGender = signal<string>('Male');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{3,15}$')]],
      dob: ['', [Validators.required]],
      location: ['']
    });
  }

  ngOnInit() {
    // Fill full name with registered profile name if exists
    const current = this.authService.user();
    if (current) {
      this.profileForm.patchValue({
        fullName: current.name
      });
    }
  }

  selectGender(gender: string) {
    this.selectedGender.set(gender);
  }

  getGenderClass(gender: string): string {
    const isSelected = this.selectedGender() === gender;
    
    if (isSelected) {
      // Active gender button: lavender-purple backdrop with border
      return 'bg-brand-purple border-transparent text-white shadow-sm shadow-brand-purple/15 scale-[1.03]';
    }
    // Idle button styling
    return 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50';
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Validate username uniqueness locally
  private isUsernameUnique(username: string): boolean {
    const registered = localStorage.getItem('trendface-registered-usernames');
    let usernames: string[] = [];
    
    if (registered) {
      try {
        usernames = JSON.parse(registered);
      } catch (e) {
        usernames = [];
      }
    }

    if (usernames.includes(username.toLowerCase())) {
      return false;
    }
    return true;
  }

  private saveUsername(username: string) {
    const registered = localStorage.getItem('trendface-registered-usernames');
    let usernames: string[] = [];
    
    if (registered) {
      try {
        usernames = JSON.parse(registered);
      } catch (e) {
        usernames = [];
      }
    }

    usernames.push(username.toLowerCase());
    localStorage.setItem('trendface-registered-usernames', JSON.stringify(usernames));
  }

  onSubmit() {
    this.errorMessage.set(null);

    if (this.profileForm.valid) {
      this.isLoading.set(true);
      const { fullName, username, dob, location } = this.profileForm.value;

      setTimeout(() => {
        // Validate duplicate username
        if (!this.isUsernameUnique(username)) {
          this.isLoading.set(false);
          this.errorMessage.set(`The username @${username} is already taken. Please try another one.`);
          return;
        }

        // Save username to unique registry
        this.saveUsername(username);

        // Update profile in AuthService state
        this.authService.updateProfile({
          name: fullName,
          location: location || undefined,
          avatarUrl: this.photoPreview() || undefined
        });

        // Save extra data context locally
        const extraProfileData = {
          username: username,
          gender: this.selectedGender(),
          dob: dob,
          photo: this.photoPreview()
        };
        localStorage.setItem('trendface-extra-profile', JSON.stringify(extraProfileData));

        this.isLoading.set(false);
        this.router.navigate(['/experience-setup']);
      }, 1200);
    } else {
      this.profileForm.markAllAsTouched();
      
      if (this.profileForm.get('fullName')?.invalid) {
        this.errorMessage.set('Please enter a valid full name (minimum 2 characters).');
      } else if (this.profileForm.get('username')?.invalid) {
        this.errorMessage.set('Username must be 3-15 characters and contain only letters, numbers, or underscores.');
      } else if (this.profileForm.get('dob')?.invalid) {
        this.errorMessage.set('Please select your Date of Birth.');
      }
    }
  }

  back() {
    this.router.navigate(['/verify-otp']);
  }
}
