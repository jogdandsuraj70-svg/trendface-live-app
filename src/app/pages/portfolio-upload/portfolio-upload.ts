import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-portfolio-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-upload.html',
  styleUrls: ['./portfolio-upload.scss']
})
export class PortfolioUploadComponent {
  // Pre-populate with exactly 4 premium fashion portraits from Unsplash to match Figma design visual state
  images = signal<string[]>([
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300&h=400'
  ]);
  
  isLoading = signal(false);
  
  private authService = inject(AuthService);
  private router = inject(Router);

  triggerMediaUpload(mediaInput: HTMLInputElement) {
    if (this.images().length >= 5) {
      alert('Maximum of 5 professional portfolio images reached.');
      return;
    }
    mediaInput.click();
  }

  onMediaSelected(event: any) {
    const files: FileList = event.target.files;
    const currentLength = this.images().length;
    const allowedNewCount = 5 - currentLength;

    if (files.length === 0) return;

    // Parse each selected image to base64
    const filesToLoad = Math.min(files.length, allowedNewCount);
    for (let i = 0; i < filesToLoad; i++) {
      const file = files[i];
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.images.update(imgs => [...imgs, reader.result as string]);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Invalid file format. Please upload JPG, PNG, or WEBP images only.');
      }
    }
  }

  removeImage(index: number) {
    this.images.update(imgs => imgs.filter((_, i) => i !== index));
  }

  confirm() {
    this.isLoading.set(true);

    setTimeout(() => {
      // Save images list locally
      localStorage.setItem('trendface-portfolio-images', JSON.stringify(this.images()));
      
      this.isLoading.set(false);
      this.router.navigate(['/availability']);
    }, 1500);
  }

  skip() {
    this.router.navigate(['/availability']);
  }

  back() {
    this.router.navigate(['/profile-setup']);
  }
}
