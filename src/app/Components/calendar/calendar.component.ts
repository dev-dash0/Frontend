import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { DialogService } from '../../Core/Services/dialog.service';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { AssignUsersToIssueComponent } from '../assign-users-to-issue/assign-users-to-issue.component';

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
  private priorityOrder = ['Low', 'Medium', 'High', 'Critical'];
  private statusOrder = ['BackLog', 'To Do', 'In Progress', 'Reviewing', 'Completed', 'Canceled', 'Postponed'];

  @ViewChild('issuesList') issuesList!: ElementRef;


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

    if (foundData) {
      this.filteredIssues = foundData.issues.sort((a: { priority: string; status: string }, b: { priority: string; status: string }) => this.sortIssues(a, b));
    } else {
      this.filteredIssues = [];
    }

    // Add a class if there are more than 6 issues
    setTimeout(() => {
      if (this.issuesList) {
        const issueListElement = this.issuesList.nativeElement as HTMLElement;
        if (this.filteredIssues.length > 0) {
          issueListElement.classList.add('show');
        } else {
          issueListElement.classList.remove('show');
        }

        // Apply scrollable class *after* .show
        if (this.filteredIssues.length > 1) {
          setTimeout(() => issueListElement.classList.add('scrollable'), 50);
        } else {
          issueListElement.classList.remove('scrollable');
        }
      }
    }, 10);
  }

  private sortIssues(a: { priority: string; status: string }, b: { priority: string; status: string }): number {
    const priorityDiff = this.priorityOrder.indexOf(b.priority) - this.priorityOrder.indexOf(a.priority);
    if (priorityDiff !== 0) return priorityDiff; // Sort by priority first

    return this.statusOrder.indexOf(a.status) - this.statusOrder.indexOf(b.status); // Then by status
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
// ===============================================================
private dialogService = inject(DialogService);
private _IssueService = inject(IssueService);
assignUsersComp!: AssignUsersToIssueComponent;
isModalOpen: boolean = false;
  //open issue modal
  loadIssue(issueId: number): void {
    this._IssueService.getIssueById(issueId).subscribe({
      next: (res) => {
        this.openIssueView(issueId);
        this.isModalOpen = true;

        // Load assigned users after the issue is loaded
        setTimeout(() => {
          if (this.assignUsersComp) {
            this.assignUsersComp.loadAssignedUsers();
          }
        }, 0);
      },
      error: (err) => {
        console.error('Error fetching issue:', err);
      },
    });
  }
  openIssueView(issueId: number) {
    this.dialogService.openIssueViewModal(issueId);
  }
}
