import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface RecentReport {
  reportedUserId: string;
  reportedUsername: string;
  reportedUserAvatar: string;
  reason: string;
  ticketId: string;
  timestamp: string;
}

@Component({
  selector: 'app-report-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-confirmation.html',
  styleUrls: ['./report-confirmation.scss']
})
export class ReportConfirmationComponent implements OnInit {
  private router = inject(Router);

  reportDetails = signal<RecentReport>({
    reportedUserId: 'sophia-carter',
    reportedUsername: 'Sophia Carter',
    reportedUserAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    reason: 'Harassment or Bullying',
    ticketId: '#TF-98421-X',
    timestamp: 'Oct 24, 2023 • 14:20'
  });

  ngOnInit() {
    const saved = localStorage.getItem('trendface-recent-report');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.reportDetails.set(parsed);
      } catch (e) {
        console.warn('Failed parsing recent report details, using mocks', e);
      }
    }
  }

  done() {
    // Navigates back to Home
    this.router.navigate(['/home']);
  }

  blockUser() {
    // Navigate to Block User flow for this reported user!
    this.router.navigate(['/block-user', this.reportDetails().reportedUserId]);
  }
}
