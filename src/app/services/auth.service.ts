import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile, UserPreferences } from '../models/user';

export interface LocalUser extends UserProfile {
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<LocalUser | null>(null);
  user = this.currentUser.asReadonly();
  
  // Pending verification state
  private pendingUser = signal<LocalUser | null>(null);
  private generatedOtp = signal<string>('412356'); // Default OTP code

  // Preferences configuration
  private userPrefs = signal<UserPreferences>({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      bookingRequests: true,
      marketing: false
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 15
    }
  });
  preferences = this.userPrefs.asReadonly();

  constructor(private router: Router) {
    // Check if there is an active local session
    const session = localStorage.getItem('trendface-session');
    if (session) {
      try {
        this.currentUser.set(JSON.parse(session));
      } catch (e) {
        localStorage.removeItem('trendface-session');
      }
    }
  }

  // Role Selection State
  setSelectedRole(role: 'artist' | 'model') {
    localStorage.setItem('trendface-selected-role', role);
  }

  getSelectedRole(): 'artist' | 'model' {
    return (localStorage.getItem('trendface-selected-role') as 'artist' | 'model') || 'artist';
  }

  // Get all registered users from local storage
  private getRegisteredUsers(): LocalUser[] {
    const usersJson = localStorage.getItem('trendface-registered-users');
    if (usersJson) {
      try {
        return JSON.parse(usersJson);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // Save users list
  private saveRegisteredUsers(users: LocalUser[]) {
    localStorage.setItem('trendface-registered-users', JSON.stringify(users));
  }

  // Sign up a new user locally (handles email verification & duplicates validation)
  signUp(fullName: string, email: string, password: string): { success: boolean; error?: string } {
    const users = this.getRegisteredUsers();
    
    // Check if email already exists
    const duplicate = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    // Capture saved role
    const selectedRole = this.getSelectedRole() === 'artist' ? 'Makeup Artist' : 'Model';

    // Store in pending state (will be written to registered list upon OTP success)
    const newUser: LocalUser = {
      id: 'tf-user-' + Math.random().toString(36).substr(2, 9),
      name: fullName,
      email: email,
      password: password,
      role: selectedRole,
      avatarUrl: selectedRole === 'Makeup Artist' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      bio: 'Atelier Creator matching visual casts on TrendFace.',
      location: 'New York, NY',
      phone: '+1 (555) 012-3456',
      company: 'Creative Atelier',
      website: 'www.trendface.ai'
    };

    // Generate random 6 digit OTP and log to console
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp.set(otp);
    this.pendingUser.set(newUser);
    
    // Log active OTP in console and mock alert for easy developer preview
    console.log(`[TrendFace Auth] Verification OTP for ${email} is: ${otp}`);
    alert(`[MOCK OTP SERVICE] Verification OTP code sent to your email: ${otp}`);

    return { success: true };
  }

  // Sign Up / In with Google Mock Flow
  googleAuth(): { success: boolean } {
    const selectedRole = this.getSelectedRole() === 'artist' ? 'Makeup Artist' : 'Model';
    
    const googleUser: LocalUser = {
      id: 'tf-google-' + Math.random().toString(36).substr(2, 9),
      name: 'Google Creative Creator',
      email: 'creative.creator@gmail.com',
      role: selectedRole,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
      bio: 'Professional Google cast portfolio on TrendFace casting portal.',
      location: 'Los Angeles, CA',
      phone: '+1 (555) 987-6543',
      company: 'Google Creative',
      website: 'creative.google.com'
    };

    // Add to registered users if not exists
    const users = this.getRegisteredUsers();
    const exists = users.find(u => u.email.toLowerCase() === googleUser.email.toLowerCase());
    if (!exists) {
      users.push(googleUser);
      this.saveRegisteredUsers(users);
    }

    this.currentUser.set(googleUser);
    localStorage.setItem('trendface-session', JSON.stringify(googleUser));
    
    return { success: true };
  }

  // Get active OTP details for verify page
  getPendingEmail(): string {
    return this.pendingUser()?.email || 'a.ex@trendface.ai';
  }

  getGeneratedOtp(): string {
    return this.generatedOtp();
  }

  // Confirm verification code and activate user profile
  verifyOtpCode(code: string): { success: boolean; error?: string } {
    if (code !== this.generatedOtp()) {
      return { success: false, error: 'The 6-digit code you entered is invalid. Please try again.' };
    }

    const newUser = this.pendingUser();
    if (newUser) {
      const users = this.getRegisteredUsers();
      users.push(newUser);
      this.saveRegisteredUsers(users);

      // Set active session
      this.currentUser.set(newUser);
      localStorage.setItem('trendface-session', JSON.stringify(newUser));
      
      // Clear pending
      this.pendingUser.set(null);
      return { success: true };
    }

    return { success: false, error: 'Verification session expired. Please sign up again.' };
  }

  // Login existing user locally
  login(email: string, password: string): { success: boolean; error?: string } {
    const users = this.getRegisteredUsers();
    
    // Find matching user credentials
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!matched) {
      return { success: false, error: 'Invalid email address or password. Please verify your credentials.' };
    }

    // Set active session
    this.currentUser.set(matched);
    localStorage.setItem('trendface-session', JSON.stringify(matched));
    
    return { success: true };
  }

  // Trigger Forgot Password (generates OTP and navigates to verification)
  forgotPassword(email: string): { success: boolean; error?: string } {
    const users = this.getRegisteredUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!exists) {
      return { success: false, error: 'No account with this email address was found.' };
    }

    // Generate validation OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp.set(otp);
    
    // Set pending reset context
    this.pendingUser.set(exists);
    
    console.log(`[TrendFace Auth] Password Reset OTP for ${email} is: ${otp}`);
    alert(`[MOCK OTP SERVICE] Password Reset OTP code sent to your email: ${otp}`);

    return { success: true };
  }

  // Reset password to a new value
  resetPassword(newPassword: string): boolean {
    const resetUser = this.pendingUser();
    if (resetUser) {
      const users = this.getRegisteredUsers();
      const index = users.findIndex(u => u.id === resetUser.id);
      if (index !== -1) {
        users[index].password = newPassword;
        this.saveRegisteredUsers(users);
        this.pendingUser.set(null);
        return true;
      }
    }
    return false;
  }

  // Log out active user session
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('trendface-session');
    this.router.navigate(['/login']);
  }

  updateProfile(profile: Partial<UserProfile>) {
    const current = this.currentUser();
    if (current) {
      const updated = { ...current, ...profile };
      this.currentUser.set(updated);
      localStorage.setItem('trendface-session', JSON.stringify(updated));
    }
  }

  updatePreferences(prefs: Partial<UserPreferences>) {
    this.userPrefs.update(current => ({
      ...current,
      ...prefs
    }));
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
