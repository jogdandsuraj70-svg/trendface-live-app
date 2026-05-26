import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService, DateAvailability } from '../../services/booking.service';
import { TalentService } from '../../services/talent.service';
import { ChatService } from '../../services/chat.service';
import { Talent } from '../../models/talent';

@Component({
  selector: 'app-booking-availability',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-availability.html',
  styleUrls: ['./booking-availability.scss']
})
export class BookingAvailabilityComponent implements OnInit {
  private bookingService = inject(BookingService);
  private talentService = inject(TalentService);
  private chatService = inject(ChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  talentId = signal('');
  talent = signal<Talent | null>(null);
  currentMonth = signal('October 2023');
  availability = signal<DateAvailability[]>([]);

  selectedDay = signal<number | null>(18); // Default selected Oct 18 in Figma
  selectedTimeSlot = signal<string>('01:00 PM'); // Default selected 01:00 PM in Figma
  timeSlots = signal<string[]>(['10:00 AM', '01:00 PM', '04:00 PM']);

  showSuccessAnimation = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.talentId.set(id);
      const found = this.talentService.getTalentById(id);
      if (found) {
        this.talent.set(found);
      }
      this.loadAvailability();
    }
  }

  loadAvailability() {
    // Oct 2023 mock
    const list = this.bookingService.getMockAvailabilityForMonth(this.talentId(), 2023, 9);
    this.availability.set(list);
  }

  selectDay(day: DateAvailability) {
    if (day.status === 'booked') return; // Booked slots cannot be selected
    this.selectedDay.set(day.day);
    // Reload slots
    const dateString = `October ${day.day}, 2023`;
    const slots = this.bookingService.getAvailableTimeSlots(this.talentId(), dateString);
    this.timeSlots.set(slots);
  }

  selectSlot(slot: string) {
    this.selectedTimeSlot.set(slot);
  }

  bookNow() {
    const day = this.selectedDay();
    const slot = this.selectedTimeSlot();
    const t = this.talent();

    if (!day || !slot || !t) return;

    const dateString = `October ${day}, 2023`;

    // 1. Create booking in BookingService
    this.bookingService.createBooking(t.id, t.name, t.role, dateString, slot);

    // 2. Generate Booking card message attachment inside Chat conversation
    this.chatService.sendMessage(
      t.id,
      `Sent a booking request for ${dateString} at ${slot}`,
      true,
      {
        date: dateString,
        time: slot,
        status: 'pending'
      }
    );

    // 3. Show Success Animation
    this.showSuccessAnimation.set(true);

    // 4. Redirect to Chat room after 2.0s
    setTimeout(() => {
      this.router.navigate(['/chat', t.id]);
    }, 2000);
  }

  getDayClass(day: DateAvailability): string {
    const base = 'h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all relative cursor-pointer active-tap';
    
    // Highlight currently selected day
    if (this.selectedDay() === day.day) {
      return `${base} bg-brand-purple text-white ring-2 ring-brand-purple/20 scale-105`;
    }

    if (day.status === 'available') {
      return `${base} text-green-500 bg-green-50 dark:bg-green-950/20 font-extrabold`;
    } else if (day.status === 'booked') {
      return `${base} text-slate-350 dark:text-slate-650 cursor-not-allowed pointer-events-none line-through`;
    } else if (day.status === 'pending') {
      return `${base} text-amber-500 bg-amber-50 dark:bg-amber-950/20`;
    } else {
      return `${base} text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850`;
    }
  }

  back() {
    this.router.navigate(['/chat', this.talentId()]);
  }
}
