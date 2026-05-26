import { Component, signal, inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verification.html',
  styleUrls: ['./verification.scss']
})
export class VerificationComponent implements OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  // Uploaded states
  frontIdFile = signal<string | null>(null);
  backIdFile = signal<string | null>(null);
  selfieImage = signal<string | null>(null);
  proofFileName = signal<string | null>(null);

  // Scanning & Loading states
  isUploadingFront = signal<boolean>(false);
  isUploadingBack = signal<boolean>(false);
  isUploadingProof = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  // Validation feedback
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Live Camera parameters
  isCameraActive = signal<boolean>(false);
  cameraStream: MediaStream | null = null;

  ngOnDestroy() {
    this.stopCameraStream();
  }

  // Handle Front ID Upload with Aadhaar AI Check
  onFrontUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate format
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      this.errorMessage.set('Unsupported file format. Please upload JPG, PNG, or WEBP only.');
      return;
    }

    this.errorMessage.set(null);
    this.isUploadingFront.set(true);

    // Simulate smart AI OCR scanning
    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      const isAadhaar = fileName.includes('aadhar') || fileName.includes('aadhaar');

      this.isUploadingFront.set(false);

      if (!isAadhaar) {
        this.errorMessage.set(
          'AI Validation Rejection: Uploaded document does not look like an Aadhaar Card. Please ensure the filename contains "aadhaar" (e.g. aadhaar_front.jpg) and try again.'
        );
        return;
      }

      // Convert to Base64 preview
      const reader = new FileReader();
      reader.onload = () => {
        this.frontIdFile.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }, 1500);
  }

  // Handle Back ID Upload with Aadhaar AI Check
  onBackUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      this.errorMessage.set('Unsupported file format. Please upload JPG, PNG, or WEBP only.');
      return;
    }

    this.errorMessage.set(null);
    this.isUploadingBack.set(true);

    setTimeout(() => {
      const fileName = file.name.toLowerCase();
      const isAadhaar = fileName.includes('aadhar') || fileName.includes('aadhaar');

      this.isUploadingBack.set(false);

      if (!isAadhaar) {
        this.errorMessage.set(
          'AI Validation Rejection: Back ID document must be an Aadhaar Card. Ensure the filename contains "aadhaar" (e.g. aadhaar_back.png).'
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.backIdFile.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }, 1500);
  }

  // Live Camera Activation
  async startCamera() {
    this.errorMessage.set(null);
    this.isCameraActive.set(true);

    try {
      // Access camera (front-camera preferred on mobile device)
      const constraints = {
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.cameraStream = stream;

      setTimeout(() => {
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play().catch(e => {
            console.error('Play stream failed:', e);
          });
        }
      }, 100);
    } catch (err) {
      console.error('Camera API access failed:', err);
      this.isCameraActive.set(false);
      this.errorMessage.set('Could not access device camera. Please upload a clear photo or check camera permissions.');
    }
  }

  // Freeze selfie video stream onto canvas
  captureSelfie() {
    if (!this.videoElement || !this.videoElement.nativeElement || !this.cameraStream) {
      this.isCameraActive.set(false);
      return;
    }

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      this.selfieImage.set(dataUrl);
    }

    this.stopCameraStream();
    this.isCameraActive.set(false);
  }

  // Cancel Selfie Capture Flow
  cancelCamera() {
    this.stopCameraStream();
    this.isCameraActive.set(false);
  }

  // Retake captured photo
  retakePhoto() {
    this.selfieImage.set(null);
    this.startCamera();
  }

  // Helper to release camera streams
  private stopCameraStream() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  // Upload Professional Proof document
  onProofUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploadingProof.set(true);
    this.errorMessage.set(null);

    setTimeout(() => {
      this.isUploadingProof.set(false);
      this.proofFileName.set(file.name);
    }, 1200);
  }

  // Complete submission
  submitVerification() {
    this.errorMessage.set(null);

    // Strict validation
    if (!this.frontIdFile()) {
      this.errorMessage.set('Please upload the Front of your Aadhaar Card.');
      return;
    }
    if (!this.backIdFile()) {
      this.errorMessage.set('Please upload the Back of your Aadhaar Card.');
      return;
    }
    if (!this.selfieImage()) {
      this.errorMessage.set('Please take a selfie verification photo.');
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      // 1. Store verification status in localStorage local session context
      const verificationContext = {
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        proofFile: this.proofFileName()
      };
      
      localStorage.setItem('trendface-verification', JSON.stringify(verificationContext));
      
      // Update AuthService profile verification parameter
      this.authService.updateProfile({
        company: 'Creative Atelier (Verification Pending)' // Signifies pending
      });

      this.isLoading.set(false);
      this.successMessage.set('Submission Successful! Verification takes 24–48 hours.');

      setTimeout(() => {
        this.successMessage.set(null);
        this.router.navigate(['/home']);
      }, 2500);
    }, 2000);
  }

  // Navigate back to creator profile
  back() {
    this.router.navigate(['/creator-profile']);
  }
}
