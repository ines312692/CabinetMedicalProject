import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";


@Component({
  selector: 'app-calender',
  templateUrl: './calender.page.html',
  styleUrls: ['./calender.page.scss'],
  imports: [
    IonicModule,
    DatePipe,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class CalenderPage implements OnInit {
  currentYear: number;
  currentMonth: number;
  daysInMonth: number[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  events: { date: Date, title: string }[] = [
    { date: new Date(2025, 2, 15), title: 'Available 9am - 5pm' },
    { date: new Date(2025, 2, 16), title: 'Available 10am - 4pm' },
    // Add more events as needed
  ];
  isModalOpen = false;
  selectedDate: Date | null = null;

  constructor() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
  }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    for (let i = 0; i < firstDay; i++) {
      this.daysInMonth.unshift(0);
    }
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.currentMonth === today.getMonth() &&
      this.currentYear === today.getFullYear();
  }

  getEventsForDay(day: number) {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.events.filter(event => event.date.toDateString() === date.toDateString());
  }

  bookAppointment(day: number, event: { date: Date, title: string }) {
    this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
    this.isModalOpen = true;
  }

  confirmBooking() {
    if (this.selectedDate) {
      console.log(`Appointment booked for ${this.selectedDate.toDateString()}`);
      // Add logic to save the booking
    }
    this.closeModal();
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedDate = null;
  }
}
