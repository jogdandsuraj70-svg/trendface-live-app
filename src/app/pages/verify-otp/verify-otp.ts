import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-otp.html',
  styleUrls: ['./verify-otp.scss']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  pendingEmail = signal<string>('a.ex@trendface.ai');
  resendTimer = signal<number>(39); // 39 seconds timer as shown in Figma resend in 00:39
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  
  private otpValues: string[] = ['', '', '', '', '', ''];
  private timerInterval: any;

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.pendingEmail.set(this.authService.getPendingEmail());
    this.startTimer();
    
    // Auto-focus first input box
    setTimeout(() => {
      document.getElementById('otp-input-0')?.focus();
    }, 300);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private startTimer() {
    this.stopTimer();
    this.resendTimer.set(39);
    this.timerInterval = setInterval(() => {
      if (this.resendTimer() > 0) {
        this.resendTimer.update(t => t - 1);
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // Active OTP styling matching first field carrying digit e.g. blue bg
  getOtpBoxClass(index: number): string {
    const hasValue = this.otpValues[index] !== '';
    const isActive = index === 0 && !hasValue; // Make first box active by default
    
    if (hasValue || isActive) {
      // Figma active filled style: blue background, white text
      return 'bg-brand-purple border-transparent text-white shadow-md shadow-brand-purple/15 scale-[1.05]';
    }
    // Idle placeholder styling
    return 'bg-slate-50 dark:bg-slate-900/40 border-slate-150 dark:border-slate-800 text-slate-800 dark:text-white placeholder-slate-350 focus:border-brand-purple focus:bg-white';
  }

  onDigitInput(event: any, index: number) {
    const val = event.target.value;
    
    // Save digit value
    this.otpValues[index] = val;

    if (val !== '' && index < 5) {
      // Auto focus next input
      const nextInput = document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    }
  }

  onDigitBackspace(event: any, index: number) {
    if (event.key === 'Backspace' && this.otpValues[index] === '' && index > 0) {
      // Shift focus back on backspace
      const prevInput = document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  }

  verifyCode() {
    this.errorMessage.set(null);
    const code = this.otpValues.join('');
    
    if (code.length < 6) {
      this.errorMessage.set('Please enter all 6 digits of your verification code.');
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      const result = this.authService.verifyOtpCode(code);
      this.isLoading.set(false);

      if (result.success) {
        // Authenticated! Navigate to casting or success dashboard
        alert('Welcome to TrendFace! Profile successfully verified.');
        this.router.navigate(['/profile-setup']);
      } else {
        this.errorMessage.set(result.error || 'Verification failed.');
      }
    }, 1200);
  }

  resendCode() {
    this.authService.signUp('Re-send', this.pendingEmail(), ''); // Resend will regenerate code
    this.startTimer();
    alert('A new 6-digit OTP verification code has been dispatched to your email.');
  }

  back() {
    this.router.navigate(['/signup']);
  }
}
