import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-3.html',
  styleUrls: ['./onboarding-3.scss']
})
export class OnboardingThreeComponent {
  constructor(private router: Router) {}

  getStarted() {
    this.router.navigate(['/role-selection']);
  }

  signIn() {
    this.router.navigate(['/role-selection']);
  }

  close() {
    this.router.navigate(['/splash']);
  }
}
