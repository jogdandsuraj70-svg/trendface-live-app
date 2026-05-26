import { Injectable, signal } from '@angular/core';

export interface BookingRequest {
  id: string;
  talentId: string;
  talentName: string;
  profession: string;
  date: string; // e.g. "October 18, 2023"
  timeSlot: string; // e.g. "01:00 PM"
  status: 'pending' | 'accepted' | 'declined';
  timestamp: Date;
}

export interface DateAvailability {
  day: number; // Day of the month
  status: 'available' | 'booked' | 'pending' | 'none';
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private storageKey = 'trendface-bookings';

  bookings = signal<BookingRequest[]>(this.loadBookings());

  constructor() {}

  private loadBookings(): BookingRequest[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((b: any) => ({
          ...b,
          timestamp: new Date(b.timestamp)
        }));
      } catch (e) {
        console.warn('Failed parsing saved bookings', e);
      }
    }
    return [
      {
        id: 'book-1',
        talentId: 'marcus-chen',
        talentName: 'Marcus Chen',
        profession: 'Creative Director',
        date: 'November 15, 2023',
        timeSlot: '10:00 AM',
        status: 'pending',
        timestamp: new Date()
      }
    ];
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.bookings()));
  }

  createBooking(talentId: string, name: string, profession: string, dateStr: string, slot: string): BookingRequest {
    const newBooking: BookingRequest = {
      id: 'bk-' + Math.random().toString(36).substr(2, 9),
      talentId,
      talentName: name,
      profession,
      date: dateStr,
      timeSlot: slot,
      status: 'pending',
      timestamp: new Date()
    };

    this.bookings.update(list => [newBooking, ...list]);
    this.save();
    return newBooking;
  }

  // Get availability data for Aarav Sharma October 2023 (Matching design image)
  // Available: 12, 14, 15 (Green)
  // Booked: 13 (grayed out or disabled in slot legend)
  // Pending: 18 (yellow/purple highlighted selected)
  getMockAvailabilityForMonth(talentId: string, year: number, month: number): DateAvailability[] {
    // We mock October 2023 availability
    // October has 31 days
    const availability: DateAvailability[] = [];
    for (let day = 1; day <= 31; day++) {
      let status: 'available' | 'booked' | 'pending' | 'none' = 'none';
      
      if (day === 12 || day === 14 || day === 15) {
        status = 'available';
      } else if (day === 3 || day === 7 || day === 9 || day === 25) {
        status = 'booked';
      } else if (day === 18) {
        status = 'pending';
      }

      // Check if there is an active local booking for this day
      const dateString = `October ${day}, 2023`;
      const localBooking = this.bookings().find(b => b.talentId === talentId && b.date === dateString);
      if (localBooking) {
        status = localBooking.status === 'pending' ? 'pending' : 'booked';
      }

      availability.push({ day, status });
    }
    return availability;
  }

  getAvailableTimeSlots(talentId: string, dateStr: string): string[] {
    // Returns available slots
    return ['10:00 AM', '01:00 PM', '04:00 PM'];
  }
}
