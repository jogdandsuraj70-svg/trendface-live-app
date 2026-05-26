import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash').then(m => m.SplashComponent)
  },
  {
    path: 'onboarding-1',
    loadComponent: () => import('./pages/onboarding/onboarding-1').then(m => m.OnboardingOneComponent)
  },
  {
    path: 'onboarding-2',
    loadComponent: () => import('./pages/onboarding/onboarding-2').then(m => m.OnboardingTwoComponent)
  },
  {
    path: 'onboarding-3',
    loadComponent: () => import('./pages/onboarding/onboarding-3').then(m => m.OnboardingThreeComponent)
  },
  {
    path: 'role-selection',
    loadComponent: () => import('./pages/role-selection/role-selection').then(m => m.RoleSelectionComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/verify-otp/verify-otp').then(m => m.VerifyOtpComponent)
  },
  {
    path: 'profile-setup',
    loadComponent: () => import('./pages/profile-setup/profile-setup').then(m => m.ProfileSetupComponent)
  },
  {
    path: 'experience-setup',
    loadComponent: () => import('./pages/experience-setup/experience-setup').then(m => m.ExperienceSetupComponent)
  },
  {
    path: 'portfolio-upload',
    loadComponent: () => import('./pages/portfolio-upload/portfolio-upload').then(m => m.PortfolioUploadComponent)
  },
  {
    path: 'availability',
    loadComponent: () => import('./pages/availability/availability').then(m => m.AvailabilityComponent)
  },
  {
    path: 'creator-profile',
    loadComponent: () => import('./pages/creator-profile/creator-profile').then(m => m.CreatorProfileComponent)
  },
  {
    path: 'verification',
    loadComponent: () => import('./pages/verification/verification').then(m => m.VerificationComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'discover',
    loadComponent: () => import('./pages/discover/discover').then(m => m.DiscoverComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications').then(m => m.NotificationsComponent)
  },
  {
    path: 'filters',
    loadComponent: () => import('./pages/filters/filters').then(m => m.FiltersComponent)
  },
  {
    path: 'profile-detail',
    loadComponent: () => import('./pages/profile-detail/profile-detail').then(m => m.ProfileDetailComponent)
  },
  {
    path: 'profile-detail/:id',
    loadComponent: () => import('./pages/profile-detail/profile-detail').then(m => m.ProfileDetailComponent)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile-detail/profile-detail').then(m => m.ProfileDetailComponent)
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages').then(m => m.MessagesComponent)
  },
  {
    path: 'chat',
    redirectTo: 'chat/aarav-sharma',
    pathMatch: 'full'
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./pages/chat/chat').then(m => m.ChatComponent)
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore').then(m => m.ExploreComponent)
  },
  {
    path: 'saved-profiles',
    loadComponent: () => import('./pages/saved-profiles/saved-profiles').then(m => m.SavedProfilesComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then(m => m.SettingsComponent)
  },
  {
    path: 'report-user',
    loadComponent: () => import('./pages/report-user/report-user').then(m => m.ReportUserComponent)
  },
  {
    path: 'report-user/:id',
    loadComponent: () => import('./pages/report-user/report-user').then(m => m.ReportUserComponent)
  },
  {
    path: 'block-user/:id',
    loadComponent: () => import('./pages/block-user/block-user').then(m => m.BlockUserComponent)
  },
  {
    path: 'report-confirmation',
    loadComponent: () => import('./pages/report-confirmation/report-confirmation').then(m => m.ReportConfirmationComponent)
  },
  {
    path: 'availability/:id',
    loadComponent: () => import('./pages/booking-availability/booking-availability').then(m => m.BookingAvailabilityComponent)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'splash'
  }
];
