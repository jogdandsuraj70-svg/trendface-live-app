import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.forgotForm.valid) {
      this.isLoading.set(true);
      const { email } = this.forgotForm.value;

      setTimeout(() => {
        const result = this.authService.forgotPassword(email);
        this.isLoading.set(false);

        if (result.success) {
          this.successMessage.set('A verification code has been dispatched to your email.');
          setTimeout(() => {
            this.router.navigate(['/verify-otp']);
          }, 1500);
        } else {
          this.errorMessage.set(result.error || 'Password reset request failed.');
        }
      }, 1500);
    } else {
      this.forgotForm.markAllAsTouched();
      this.errorMessage.set('Please enter a valid email address.');
    }
  }

  back() {
    this.router.navigate(['/login']);
  }
}
