import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface TimeSlot {
  start: string;
  end: string;
}

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './availability.html',
  styleUrls: ['./availability.scss']
})
export class AvailabilityComponent {
  private router = inject(Router);

  // Availability Type: 'Full-Time', 'Part-Time', 'Freelance'
  availabilityTypes = signal<string[]>(['Full-Time', 'Part-Time', 'Freelance']);
  selectedType = signal<string>('Part-Time'); // Default active as shown in screenshot

  // Weekly Schedule: M, T, W, T, F, S, S
  // M-T-W-T-F are active (purple bg) by default
  daysOfWeek = signal<{ label: string; active: boolean; name: string }[]>([
    { label: 'M', active: true, name: 'Monday' },
    { label: 'T', active: true, name: 'Tuesday' },
    { label: 'W', active: true, name: 'Wednesday' },
    { label: 'T', active: true, name: 'Thursday' },
    { label: 'F', active: true, name: 'Friday' },
    { label: 'S', active: false, name: 'Saturday' },
    { label: 'S', active: false, name: 'Sunday' }
  ]);

  // Time Slots
  timeSlots = signal<TimeSlot[]>([
    { start: '09:00', end: '17:00' } // Default slot 9:00 AM - 5:00 PM
  ]);

  // Collaboration Mode: 'Remote' or 'In-Person'
  collaborationMode = signal<'Remote' | 'In-Person'>('Remote'); // Default active is Remote

  isLoading = signal(false);

  // Toggle availability type
  selectType(type: string) {
    this.selectedType.set(type);
  }

  // Toggle day active state
  toggleDay(index: number) {
    this.daysOfWeek.update(days => {
      const updated = [...days];
      updated[index] = { ...updated[index], active: !updated[index].active };
      return updated;
    });
  }

  // Add a new default time slot
  addSlot() {
    this.timeSlots.update(slots => [...slots, { start: '09:00', end: '17:00' }]);
  }

  // Remove a time slot
  removeSlot(index: number) {
    if (this.timeSlots().length > 1) {
      this.timeSlots.update(slots => slots.filter((_, i) => i !== index));
    }
  }

  // Update time values
  updateTime(index: number, field: 'start' | 'end', value: string) {
    this.timeSlots.update(slots => {
      const updated = [...slots];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  // Format time display: e.g. "09:00" -> "09:00 AM", "17:00" -> "05:00 PM"
  formatTimeDisplay(timeStr: string): string {
    if (!timeStr) return '';
    const [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedHours = hours < 10 ? '0' + hours : hours;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  // Save Availability state and continue
  saveAndContinue() {
    this.isLoading.set(true);

    const activeDays = this.daysOfWeek()
      .filter(d => d.active)
      .map(d => d.name);

    const availabilityData = {
      type: this.selectedType(),
      weeklySchedule: activeDays,
      timeSlots: this.timeSlots(),
      collaborationMode: this.collaborationMode()
    };

    setTimeout(() => {
      localStorage.setItem('trendface-availability', JSON.stringify(availabilityData));
      this.isLoading.set(false);
      this.router.navigate(['/creator-profile']);
    }, 1200);
  }

  // Go back to portfolio upload
  back() {
    this.router.navigate(['/portfolio-upload']);
  }
}
