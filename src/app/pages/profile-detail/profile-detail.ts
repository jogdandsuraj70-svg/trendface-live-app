import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TalentService } from '../../services/talent.service';
import { NotificationService } from '../../services/notification.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-detail.html',
  styleUrls: ['./profile-detail.scss']
})
export class ProfileDetailComponent implements OnInit {
  private talentService = inject(TalentService);
  private notifService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  talent = signal<Talent | null>(null);
  isLoading = signal(true);
  connectState = signal<'Connect' | 'Requested' | 'Connected'>('Connect');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.talentService.getTalentById(id);
      if (found) {
        this.talent.set(found);

        // Check if already connected
        if (this.notifService.isConnected(found.name.toLowerCase().replace(/\s+/g, '-'))) {
          this.connectState.set('Connected');
        }
      }
    }
    setTimeout(() => this.isLoading.set(false), 400);
  }

  sendConnect() {
    if (this.connectState() === 'Connected') return;

    this.connectState.set('Requested');
    setTimeout(() => {
      this.connectState.set('Connected');
    }, 1500);
  }

  getConnectButtonClass(): string {
    const base = 'flex-1 py-3.5 rounded-2xl font-extrabold text-[11px] tracking-wider transition-all active-tap cursor-pointer text-center';
    const state = this.connectState();
    if (state === 'Connect') {
      return `${base} bg-brand-cyan text-white shadow-lg shadow-brand-cyan/15`;
    } else if (state === 'Requested') {
      return `${base} bg-brand-purple/10 border border-brand-purple text-brand-purple cursor-wait`;
    } else {
      return `${base} bg-brand-purple text-white shadow-sm shadow-brand-purple/15`;
    }
  }

  triggerMenu() {
    alert('Profile options & share menu');
  }

  back() {
    this.router.navigate(['/discover']);
  }
}
