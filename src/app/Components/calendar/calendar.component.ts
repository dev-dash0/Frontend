import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  dates: number[] = [];
  currentMonth: string = '';
  currentYear: number = new Date().getFullYear();
  selectedDate: number | null = null;

  currentDate: Date = new Date(); // Get the current date
  currentDayIndex: number = this.currentDate.getDay(); // Get the index of the current day (0 = Sunday, 6 = Saturday)
  // monthName: string = this.currentDate.toLocaleString('default', {
  //   month: 'long',
  // });

  issues = [
    {
      title: 'Issue 1',
      project: 'Project 1',
      team: 'Team 1',
      dates: 'Wed 7 - Sat 10',
    },
    {
      title: 'Issue 2',
      project: 'Project 2',
      team: 'Team 2',
      dates: 'Wed 7 - Mon 12',
    },
  ];

  private months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  ngOnInit(): void {
    const today = new Date();
    this.currentMonth = this.months[today.getMonth()];
    this.generateCalendar(today.getMonth(), this.currentYear);
    this.selectDate(this.currentDate.getDate());
  }

  generateCalendar(month: number, year: number): void {
    this.dates = Array.from({ length: 31 }, (_, i) => i + 1).slice(
      0,
      new Date(year, month + 1, 0).getDate()
    );
    this.currentMonth = this.months[month];
  }

  prevMonth(): void {
    const monthIndex = this.months.indexOf(this.currentMonth) - 1;
    if (monthIndex < 0) {
      this.currentYear -= 1;
      this.generateCalendar(11, this.currentYear);
    } else {
      this.generateCalendar(monthIndex, this.currentYear);
    }
  }

  nextMonth(): void {
    const monthIndex = this.months.indexOf(this.currentMonth) + 1;
    if (monthIndex > 11) {
      this.currentYear += 1;
      this.generateCalendar(0, this.currentYear);
    } else {
      this.generateCalendar(monthIndex, this.currentYear);
    }
  }

  selectDate(date: number): void {
    this.selectedDate = date;
  }
}
