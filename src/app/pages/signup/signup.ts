import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {
  signUpForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.signUpForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validator to check if Password and Confirm Password fields match
  private passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    this.errorMessage.set(null);

    if (this.signUpForm.valid) {
      this.isLoading.set(true);
      const { fullName, email, password } = this.signUpForm.value;

      setTimeout(() => {
        const result = this.authService.signUp(fullName, email, password);
        this.isLoading.set(false);

        if (result.success) {
          // Navigate to OTP page upon sending code
          this.router.navigate(['/verify-otp']);
        } else {
          this.errorMessage.set(result.error || 'Registration failed.');
        }
      }, 1500);
    } else {
      this.signUpForm.markAllAsTouched();
      
      // Determine user-friendly validation error message
      if (this.signUpForm.get('fullName')?.invalid) {
        this.errorMessage.set('Please enter a valid full name (minimum 2 characters).');
      } else if (this.signUpForm.get('email')?.invalid) {
        this.errorMessage.set('Please enter a valid email address.');
      } else if (this.signUpForm.get('password')?.invalid) {
        this.errorMessage.set('Password must be at least 8 characters long.');
      } else if (this.signUpForm.hasError('passwordMismatch')) {
        this.errorMessage.set('Passwords do not match. Please verify.');
      } else if (this.signUpForm.get('terms')?.invalid) {
        this.errorMessage.set('You must accept the Terms & Conditions to proceed.');
      }
    }
  }

  signUpWithGoogle() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.googleAuth();
      this.isLoading.set(false);
      
      // Navigate to casting confirm
      alert('Authenticated successfully via Google!');
      this.router.navigate(['/role-selection']);
    }, 1200);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  close() {
    this.router.navigate(['/splash']);
  }
}
