import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-report-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-user.html',
  styleUrls: ['./report-user.scss']
})
export class ReportUserComponent implements OnInit {
  private reportService = inject(ReportService);
  private talentService = inject(TalentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId = signal('');
  talent = signal<Talent | null>(null);

  // Selected report reason
  selectedReason = signal<'Fake Profile' | 'Harassment' | 'Spam' | 'Inappropriate Content'>('Fake Profile');
  additionalDetails = signal('');
  evidenceScreenshots = signal<string[]>([]); // array of base64 screenshots

  showSuccessOverlay = signal(false);
  generatedTicketId = signal('');

  // Default pre-populated screens matching Figma screenshots to look awesome
  defaultScreenshots = [
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=150&h=200',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=200'
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(id);
      const found = this.talentService.getTalentById(id);
      if (found) {
        this.talent.set(found);
      } else if (id === 'sophia-carter' || id === '10' || id === 'sophiac') {
        // Fallback or specific Sophia Carter details
        const sophia = this.talentService.getTalentById('sophia-carter');
        if (sophia) this.talent.set(sophia);
      }
    }
    // Load pre-populated screens by default so it looks exact to Figma
    this.evidenceScreenshots.set([...this.defaultScreenshots]);
  }

  selectReason(reason: 'Fake Profile' | 'Harassment' | 'Spam' | 'Inappropriate Content'): void {
    this.selectedReason.set(reason);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            this.evidenceScreenshots.update((list: string[]) => [...list, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeScreenshot(index: number): void {
    this.evidenceScreenshots.update((list: string[]) => list.filter((_: string, i: number) => i !== index));
  }

  submitReport(): void {
    const t = this.talent();
    if (!t) return;

    // Submit report inside service
    const ticketId = this.reportService.submitReport(
      t.id,
      t.name,
      this.selectedReason(),
      this.additionalDetails(),
      this.evidenceScreenshots()
    );

    this.generatedTicketId.set(ticketId);
    this.showSuccessOverlay.set(true);

    // Redirect to home after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  cancel(): void {
    this.router.navigate(['/chat', this.userId()]);
  }
}
