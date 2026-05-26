export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
  phone?: string;
  company?: string;
  website?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    bookingRequests: boolean;
    marketing: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
  };
}
