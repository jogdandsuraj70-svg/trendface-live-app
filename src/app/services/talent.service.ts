import { Injectable, signal, computed, inject } from '@angular/core';
import { Talent } from '../models/talent';
import { BlockService } from './block.service';

@Injectable({
  providedIn: 'root'
})
export class TalentService {
  private talentsList = signal<Talent[]>([
    {
      id: '1',
      name: 'Sofia Vercara',
      role: 'Makeup Artist',
      specialty: ['Avant-Garde', 'Editorial', 'High-Fashion'],
      rating: 4.9,
      reviewsCount: 142,
      experienceYears: 7,
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 120,
      bio: 'Editorial makeup artist specialized in high-definition avant-garde cosmetic aesthetics. Collaborated with Vogue, Elle, and New York Fashion Week.',
      isAvailable: true,
      skills: ['Airbrushing', 'Color Theory', 'Prosthetics', 'Skin Prep', 'Lighting Adaptation'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '2',
      name: 'Julian Thorne',
      role: 'Model',
      specialty: ['Runway', 'Commercial', 'Editorial'],
      rating: 4.8,
      reviewsCount: 96,
      experienceYears: 5,
      location: 'Los Angeles, CA',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 150,
      bio: 'International runway model and content creator. Strong focus on high-concept fashion editorials and athletic sportswear branding campaigns.',
      isAvailable: true,
      skills: ['Runway Walk', 'Athletic Posing', 'High-Concept Styling', 'Expressive Acting'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '3',
      name: 'Anya Romanov',
      role: 'Makeup Artist',
      specialty: ['Bridal', 'Natural Glow', 'Minimalist'],
      rating: 5.0,
      reviewsCount: 204,
      experienceYears: 9,
      location: 'Miami, FL',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 95,
      bio: 'Celebrity bridal artist and natural skin glow specialist. Creator of the "Sun-Kissed Dewy" style signature. Featured in Harper\'s Bazaar.',
      isAvailable: false,
      skills: ['Dewy Finishing', 'Lash Application', 'Branding Consultation', 'Color Correction'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '4',
      name: 'Marcus Sterling',
      role: 'Creative Director',
      specialty: ['Art Direction', 'Conceptual Campaigns', 'Casting'],
      rating: 4.9,
      reviewsCount: 88,
      experienceYears: 12,
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 200,
      bio: 'Visual conceptualist and talent caster. Helping brands create lasting visual impressions through high-end styling and premium photography projects.',
      isAvailable: true,
      skills: ['Set Design', 'Talent Casting', 'Fashion Styling', 'Budget Management'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '5',
      name: 'Elena Rostova',
      role: 'Model',
      specialty: ['Beauty', 'Fitness', 'Commercial'],
      rating: 4.7,
      reviewsCount: 110,
      experienceYears: 4,
      location: 'Los Angeles, CA',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 130,
      bio: 'Beauty, fitness, and commercial model. Dynamic facial expressionist and brand ambassador. Represented by Elite Models.',
      isAvailable: true,
      skills: ['Beauty Posing', 'Expressive Headshots', 'Social Media Branding', 'Fitness Routines'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '6',
      name: 'Dante King',
      role: 'Hairstylist',
      specialty: ['Avant-Garde', 'Couture Styling', 'Extensions'],
      rating: 4.9,
      reviewsCount: 92,
      experienceYears: 8,
      location: 'Chicago, IL',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 110,
      bio: 'High-concept couture hairstylist and session hair designer. Crafting sculptural hair assets for runways and international editorials.',
      isAvailable: true,
      skills: ['Hair Sculpting', 'Wig Design', 'Extensive Styling', 'Session Styling'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '7',
      name: 'Zara Ahmed',
      role: 'Makeup Artist',
      specialty: ['Bridal', 'Fashion', 'Editorial'],
      rating: 4.9,
      reviewsCount: 178,
      experienceYears: 6,
      location: 'Mumbai, IN',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 85,
      bio: 'Award-winning bridal and fashion makeup artist based in Mumbai. Known for flawless editorial looks and celebrity clientele.',
      isAvailable: true,
      skills: ['Bridal Styling', 'Contouring', 'Smokey Eye', 'HD Makeup', 'SFX Foundations'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '8',
      name: 'Rohan Malhotra',
      role: 'Model',
      specialty: ['Commercial', 'Runway', 'Fashion'],
      rating: 4.8,
      reviewsCount: 134,
      experienceYears: 3,
      location: 'Mumbai, IN',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 100,
      bio: 'Rising commercial and runway model. Regularly featured in top Indian fashion weeks and international brand campaigns.',
      isAvailable: true,
      skills: ['Runway Walk', 'Commercial Posing', 'Catalogue Modelling', 'Brand Representation'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '9',
      name: 'Priya Singh',
      role: 'Makeup Artist',
      specialty: ['Editorial', 'SFX', 'Fashion'],
      rating: 4.7,
      reviewsCount: 89,
      experienceYears: 5,
      location: 'Delhi, IN',
      imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 75,
      bio: 'Versatile editorial and SFX makeup artist blending artistry with innovation. Published in multiple fashion magazines across South Asia.',
      isAvailable: true,
      skills: ['SFX Makeup', 'Editorial Styling', 'Prosthetics', 'Fashion Shoot Prep'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: '10',
      name: 'Elena Grace',
      role: 'Model',
      specialty: ['Bridal', 'Beauty', 'Commercial'],
      rating: 4.8,
      reviewsCount: 156,
      experienceYears: 2,
      location: 'London, UK',
      imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 140,
      bio: 'International bridal and beauty model. Graceful, expressive, and versatile — ideal for luxury and lifestyle campaigns.',
      isAvailable: false,
      skills: ['Beauty Posing', 'Bridal Walk', 'Luxury Brand Modelling', 'Catalogue Shoots'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'aarav-sharma',
      name: 'Aarav Sharma',
      role: 'Model',
      specialty: ['Fashion', 'Editorial', 'Runway'],
      rating: 4.8,
      reviewsCount: 184,
      experienceYears: 6,
      location: 'Mumbai, India',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 150,
      bio: 'Fashion & Editorial Specialist. Deep experience on runways, lookbooks, and designer catalog campaigns. Based in Mumbai.',
      isAvailable: true,
      skills: ['Runway Walk', 'Studio Posing', 'Editorial Expressions', 'Lookbook Styling'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'priya-mehta',
      name: 'Priya Mehta',
      role: 'Model',
      specialty: ['Commercial', 'Runway', 'Beauty'],
      rating: 4.9,
      reviewsCount: 142,
      experienceYears: 4,
      location: 'Mumbai, India',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 135,
      bio: 'Commercial model & runway specialist. Strong brand representation and dewy beauty aesthetics campaigns.',
      isAvailable: true,
      skills: ['Commercial Acting', 'Beauty Posing', 'Runway Styling'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'james-wilson',
      name: 'James Wilson',
      role: 'Hairstylist',
      specialty: ['Fashion', 'Editorial', 'Runway'],
      rating: 4.7,
      reviewsCount: 88,
      experienceYears: 7,
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 110,
      bio: 'Fashion hair expert and session designer. Working regularly with designers for NYFW and high-profile creative editorials.',
      isAvailable: true,
      skills: ['Couture Hairstyling', 'Set Hair Styling', 'Bridal Design'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'elena-rodriguez',
      name: 'Elena Rodriguez',
      role: 'Makeup Artist',
      specialty: ['SFX', 'Editorial', 'Fashion'],
      rating: 4.9,
      reviewsCount: 164,
      experienceYears: 8,
      location: 'London, UK',
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 125,
      bio: 'Award-winning makeup designer specializing in high-concept fashion editorials, special effects makeup (SFX), and prosthetic works.',
      isAvailable: true,
      skills: ['SFX prosthetics', 'Flawless foundation', 'Vibrant airbrushing'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'marcus-chen',
      name: 'Marcus Chen',
      role: 'Creative Director',
      specialty: ['Art Direction', 'Conceptual Campaigns', 'Casting'],
      rating: 4.8,
      reviewsCount: 76,
      experienceYears: 10,
      location: 'Los Angeles, CA',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 180,
      bio: 'Art director focusing on high-concept casting, visual conceptualization, set curation, and dynamic digital editorial shoots.',
      isAvailable: true,
      skills: ['Creative direction', 'Fashion set styling', 'Roster curation'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'ishani-gupta',
      name: 'Ishani Gupta',
      role: 'Model',
      specialty: ['Commercial', 'Runway', 'Fashion'],
      rating: 4.9,
      reviewsCount: 156,
      experienceYears: 5,
      location: 'Mumbai, India',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 140,
      bio: 'Brand Ambassador & Runway specialist. Frequently featured in national fashion campaigns and bridal jewelry portfolios. High energy and professional.',
      isAvailable: true,
      skills: ['Runway Walk', 'Jewelry Posing', 'High Fashion Curation', 'Brand Cues'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'sophia-carter',
      name: 'Sophia Carter',
      role: 'Model',
      specialty: ['Fashion', 'Editorial', 'Commercial'],
      rating: 4.8,
      reviewsCount: 210,
      experienceYears: 6,
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 160,
      bio: 'High fashion model represented by Elite. Active in high-profile print editorials and luxury cosmetic brand campaigns. SFW & Creative conceptual layouts.',
      isAvailable: true,
      skills: ['Luxury Branding', 'Studio Posing', 'High-Definition Editorial Walk'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    },
    {
      id: 'rohan-mehra',
      name: 'Rohan Mehra',
      role: 'Model',
      specialty: ['Fitness', 'Commercial', 'Editorial'],
      rating: 4.8,
      reviewsCount: 94,
      experienceYears: 4,
      location: 'Mumbai, India',
      imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256&h=256',
      hourlyRate: 110,
      bio: 'Athletic & High Performance fashion and commercial model. Strong focus on athletic gear, lookbooks, and designer catalogs.',
      isAvailable: true,
      skills: ['Athletic Posing', 'Lookbook Modelling', 'Commercial Acting'],
      portfolioImages: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400'
      ]
    }
  ]);

  private blockService = inject(BlockService);

  talents = computed(() => {
    const list = this.talentsList();
    const blockedIds = this.blockService.blockedUserIds();
    return list.filter(t => !blockedIds.includes(t.id));
  });

  getTalentById(id: string): Talent | undefined {
    if (this.blockService.isBlocked(id)) return undefined;
    return this.talentsList().find(t => t.id === id);
  }

  addTalent(talent: Talent) {
    this.talentsList.update(list => [...list, talent]);
  }

  toggleAvailability(id: string) {
    this.talentsList.update(list =>
      list.map(t => t.id === id ? { ...t, isAvailable: !t.isAvailable } : t)
    );
  }
}
