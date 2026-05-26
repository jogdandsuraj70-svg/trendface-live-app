import { Injectable, signal } from '@angular/core';

export interface UserReport {
  ticketId: string;
  reportedUserId: string;
  reportedUsername: string;
  reason: string;
  details: string;
  evidence: string[]; // array of base64 images
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private storageKey = 'trendface-reports';

  reports = signal<UserReport[]>(this.loadReports());

  constructor() {}

  private loadReports(): UserReport[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        }));
      } catch (e) {
        console.warn('Failed parsing user reports', e);
      }
    }
    return [];
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.reports()));
  }

  submitReport(userId: string, username: string, reason: string, details: string, evidence: string[]): string {
    const ticketId = 'REP-' + Math.floor(100000 + Math.random() * 900000);
    const newReport: UserReport = {
      ticketId,
      reportedUserId: userId,
      reportedUsername: username,
      reason,
      details,
      evidence,
      timestamp: new Date()
    };

    this.reports.update(list => [newReport, ...list]);
    this.save();
    return ticketId;
  }
}
