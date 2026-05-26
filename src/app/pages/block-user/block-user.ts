import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TalentService } from '../../services/talent.service';
import { BlockService } from '../../services/block.service';
import { ReportService } from '../../services/report.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-block-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './block-user.html',
  styleUrls: ['./block-user.scss']
})
export class BlockUserComponent implements OnInit {
  private talentService = inject(TalentService);
  private blockService = inject(BlockService);
  private reportService = inject(ReportService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId = signal('');
  talent = signal<Talent | null>(null);
  alsoReport = signal(false);
  showConfirmModal = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(id);
      const found = this.talentService.getTalentById(id);
      if (found) {
        this.talent.set(found);
      } else if (id === 'sophia-carter' || id === '10' || id === 'sophiac') {
        const sophia = this.talentService.getTalentById('sophia-carter');
        if (sophia) this.talent.set(sophia);
      }
    }
  }

  toggleReport() {
    this.alsoReport.set(!this.alsoReport());
  }

  triggerBlockConfirmation() {
    this.showConfirmModal.set(true);
  }

  closeModal() {
    this.showConfirmModal.set(false);
  }

  confirmBlock() {
    const t = this.talent();
    if (!t) return;

    this.showConfirmModal.set(false);

    // 1. Save Block State in database
    this.blockService.blockUser(t.id);

    // 2. Optional report trigger
    if (this.alsoReport()) {
      // Auto-submit report with default details
      const ticketId = this.reportService.submitReport(
        t.id,
        t.name,
        'Fake Profile',
        'Auto-submitted report during profile block action.',
        []
      );

      // Navigate to report confirmation page with parameters in session/localStorage
      localStorage.setItem('trendface-recent-report', JSON.stringify({
        reportedUserId: t.id,
        reportedUsername: t.name,
        reportedUserAvatar: t.imageUrl,
        reason: 'Fake Profile or Impersonation',
        ticketId,
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      }));

      this.router.navigate(['/report-confirmation']);
    } else {
      // Success alert and navigate back to Home/Dashboard
      alert(`You have blocked ${t.name}. This profile and its contents are now hidden.`);
      this.router.navigate(['/home']);
    }
  }

  cancel() {
    this.router.navigate(['/chat', this.userId()]);
  }
}
