import { CommonModule, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dates: number[] = [];
  currentMonth: string = '';
  currentYear: number = new Date().getFullYear();
  currentDate: Date = new Date();
  currentDayIndex: number = this.currentDate.getDay(); // 0 (Sunday) - 6 (Saturday)

  issues: any[] = [];
  calendarData: any[] = [];
  selectedDate: any; // Will store date as YYYY-MM-DD
  filteredIssues: any[] = [];

  private readonly _DashboardService = inject(DashboardService);


  ngOnInit(): void {
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();
    this.selectedDate = this.formatDate(this.currentDate); // Set today's date as default
    this.generateCalendarDays(this.currentDate.getMonth(), this.currentYear);
    this.fetchCalendarData();

  }


  // Generate calendar dates for the current month
  generateCalendarDays(month: number, year: number) {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Get first day index (0 = Sunday)
    const lastDay = new Date(year, month + 1, 0).getDate(); // Get last date of the month

    // Adjust for week starting on Monday (Make Sunday 7 instead of 0)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;

    // Create an array with empty slots + actual dates
    this.dates = Array(adjustedFirstDay).fill(null).concat(
      Array.from({ length: lastDay }, (_, i) => i + 1)
    );
  }

  // Fetch issues from the API
  fetchCalendarData() {
    this._DashboardService.getDashboardCalender().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);
          this.calendarData = res.result;
          this.updateFilteredIssues(); // Ensure today's issues are displayed by default
        }
      },
      error: (err) => console.error('Error fetching calendar data', err),
    });
  }

  // Update displayed issues based on the selected date
  updateFilteredIssues() {
    const foundData = this.calendarData.find(item => item.date === this.selectedDate);
    this.filteredIssues = foundData ? foundData.issues : [];
  }

  // Select a date and filter issues
  selectDate(date: number) {
    const formattedDate = `${this.currentYear}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    this.selectedDate = formattedDate;
    this.updateFilteredIssues();
  }

  // Select a weekday and filter issues
  selectDay(dayIndex: number) {
    const today = new Date();
    const selectedDay = new Date();
    selectedDay.setDate(today.getDate() - today.getDay() + dayIndex); // Get the correct date for the selected weekday

    this.selectedDate = this.formatDate(selectedDay);
    this.updateFilteredIssues();
  }

  // Navigate to the previous month
  prevMonth() {
    this.currentDate = new Date(this.currentYear, this.currentDate.getMonth() - 1, 1);
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendarDays(this.currentDate.getMonth(), this.currentYear);
  }

  // Navigate to the next month
  nextMonth() {
    this.currentDate = new Date(this.currentYear, this.currentDate.getMonth() + 1, 1);
    this.currentMonth = this.currentDate.toLocaleString('default', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();
    this.generateCalendarDays(this.currentDate.getMonth(), this.currentYear);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
