import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-creator-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creator-profile.html',
  styleUrls: ['./creator-profile.scss']
})
export class CreatorProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Dynamic user data signals
  profileImage = signal<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256');
  fullName = signal<string>('Alex Rivera');
  username = signal<string>('arivera_stylist');
  roleBadge = signal<string>('LEAD STYLIST');
  location = signal<string>('Paris, FR');
  bio = signal<string>('Defining the intersection of architecture and high-fashion. Paris-based stylist specializing in monochromatic editorials and avant-garde runway silhouettes.');
  
  // Stat values (pre-configured for premium presentation)
  postsCount = signal<number>(124);
  followersCount = signal<string>('12.5k');
  followingCount = signal<number>(850);

  // Selected core disciplines / specialties
  specialties = signal<string[]>(['Editorial', 'Runway', 'Creative Direction']);

  // Portfolio items
  portfolioImages = signal<string[]>([
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300&h=400'
  ]);

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // 1. Load from core AuthService user signal context
    const current = this.authService.user();
    if (current) {
      if (current.name) this.fullName.set(current.name);
      if (current.avatarUrl) this.profileImage.set(current.avatarUrl);
      if (current.bio) this.bio.set(current.bio);
      if (current.location) this.location.set(current.location);
      if (current.role) {
        this.roleBadge.set(current.role.toUpperCase());
      }
    }

    // 2. Load from extra profile parameters (username, gender)
    const extraProfileJson = localStorage.getItem('trendface-extra-profile');
    if (extraProfileJson) {
      try {
        const extra = JSON.parse(extraProfileJson);
        if (extra.username) this.username.set(extra.username);
        if (extra.photo) this.profileImage.set(extra.photo);
      } catch (e) {
        console.warn('Failed parsing extra profile settings', e);
      }
    }

    // 3. Load from extra experience setup (specialties, level, bio)
    const extraExpJson = localStorage.getItem('trendface-extra-experience');
    if (extraExpJson) {
      try {
        const extraExp = JSON.parse(extraExpJson);
        if (extraExp.specialties && extraExp.specialties.length > 0) {
          this.specialties.set(extraExp.specialties);
        }
        if (extraExp.bio) this.bio.set(extraExp.bio);
      } catch (e) {
        console.warn('Failed parsing extra experience details', e);
      }
    }

    // 4. Load from dynamic portfolio uploads
    const portfolioJson = localStorage.getItem('trendface-portfolio-images');
    if (portfolioJson) {
      try {
        const customImgs: string[] = JSON.parse(portfolioJson);
        if (customImgs && customImgs.length > 0) {
          this.portfolioImages.set(customImgs);
          this.postsCount.set(120 + customImgs.length);
        }
      } catch (e) {
        console.warn('Failed parsing custom portfolio images', e);
      }
    }
  }

  // Handle menu actions or share popup
  triggerMenu() {
    alert('Atelier Settings & Portfolio Share options triggered.');
  }

  // Go back to the availability setup
  back() {
    this.router.navigate(['/availability']);
  }

  // Collaboration action click
  collaborate() {
    this.router.navigate(['/verification']);
  }
}
