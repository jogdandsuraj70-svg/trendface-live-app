export interface Talent {
  id: string;
  name: string;
  role: 'Makeup Artist' | 'Model' | 'Hairstylist' | 'Creative Director';
  specialty: string[];
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  location: string;
  imageUrl: string;
  hourlyRate: number;
  bio: string;
  isAvailable: boolean;
  portfolioImages: string[];
  skills: string[];
}

export interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  description: string;
}
