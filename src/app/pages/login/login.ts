import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    this.errorMessage.set(null);

    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;

      setTimeout(() => {
        const result = this.authService.login(email, password);
        this.isLoading.set(false);

        if (result.success) {
          // Navigates successfully to Casting / Role selection details
          alert('Logged in successfully!');
          this.router.navigate(['/role-selection']);
        } else {
          this.errorMessage.set(result.error || 'Authentication failed. Please verify credentials.');
        }
      }, 1200);
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage.set('Please enter a valid email address and password.');
    }
  }

  loginWithGoogle() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.authService.googleAuth();
      this.isLoading.set(false);
      
      alert('Authenticated successfully via Google!');
      this.router.navigate(['/role-selection']);
    }, 1200);
  }

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  close() {
    this.router.navigate(['/splash']);
  }
}
