import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/Auth.service';
import { SearchService } from '../../Core/Services/search.service';
import { FormsModule } from '@angular/forms';
import { SearchResults } from '../../Core/interfaces/search-results';
import { NotificationService } from '../../Core/Services/notification.service';
import { Notification, User } from '../../Core/interfaces/notification';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { ProjectResult } from '../../Core/interfaces/project';
import { map, switchMap } from 'rxjs';
import { DashboardLoaderComponent } from '../dashboard-loader/dashboard-loader.component';
import { DialogService } from '../../Core/Services/dialog.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
    FormsModule,
    DashboardLoaderComponent,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  constructor(
    private authService: AuthService,
    private _NotificationService: NotificationService,
    private _DashboardService: DashboardService,
    private router: Router,
    private searchService: SearchService,
    private dialogService: DialogService
  ) {}

  toggle = false;
  searchText: string = '';
  searchResult: SearchResults | null = null;
  showResults = false;
  loading = false;
  showDivider = true;
  noResults = false;
  showSearchPanel = false;

  // Notification
  showPanel = false;
  projects: ProjectResult[] = [];
  allUsers: User[] = [];
  NotifyUser: any = {};
  // close: Boolean = false;

  joinedUsers: any[] = [];

  notifications: Notification[] = [];

  ngOnInit(): void {
    this.getNotification();
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
    this.getNotification();
  }

  toggleMode() {
    this.toggle = !this.toggle;
  }
  LogOut() {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      console.warn('no tokens found,you are logged out.');
      return;
    }
    const logoutParams = { accessToken, refreshToken };
    this.authService.Logout(logoutParams).subscribe({
      next: (res) => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.clear();
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }

  // search API
  search(event?: KeyboardEvent) {
    if (event?.key == 'Escape') {
      this.showSearchPanel = false;
      return;
    }
    if (!this.searchText) {
      this.clearSearch();
      this.showResults = false;
      this.showSearchPanel = false;
      return;
    }

    this.showSearchPanel = true;
    this.loading = true;
    this.showResults = true;
    this.searchService.search(this.searchText).subscribe({
      next: (res) => {
        console.log(this.searchText);
        this.searchResult = res.result;
        // this.showResults = true;
        // this.showSearchPanel = true;
        this.noResults = !(
          this.searchResult?.tenants?.length ||
          this.searchResult?.projects?.length ||
          this.searchResult?.sprints?.length ||
          this.searchResult?.issues?.length
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Search failed:', err);
        this.loading = false;
        this.noResults = true;
      },
    });
  }

  clearSearch() {
    this.searchText = '';
    this.searchResult = null;
    this.showResults = false;
    this.loading = false;
    this.showSearchPanel = false;
    this.noResults = false;
  }

  navigateToIssue(issueId: number) {
    this.router.navigate(['/issue', issueId]);
    this.clearSearch();
  }
  navigateToProject(projectId: number) {
    this.router.navigate(['/MyDashboard/Project', projectId]);
    this.clearSearch();
  }
  navigateToTenant(tenantId: number) {
    this.router.navigate(['/MyDashboard/Company', tenantId]);
    this.clearSearch();
  }
  navigateToSprint(sprintId: number) {
    this.router.navigate(['/MyDashboard/Sprint', sprintId]);
    this.clearSearch();
  }

  openIssueView(issueId: number) {
    this.dialogService.openIssueViewModal(issueId);
  }

  closeResults(): void {
    this.showResults = false;
  }

  @HostListener('document:click', ['$event'])
  colseOnClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.closeResults();
    }
  }

  onInputChange(): void {
    if (!this.searchText) {
      this.closeResults();
    }
  }

  selectedFilter: 'all' | 'company' | 'project' | 'sprint' | 'issue' = 'all';

  setFilter(filter: typeof this.selectedFilter) {
    this.selectedFilter = filter;
    if (this.selectedFilter === 'all') {
      this.showDivider = true;
    } else {
      this.showDivider = false;
    }
  }

  hasNoSearchResults(): boolean {
    if (!this.searchResult) return true;

    switch (this.selectedFilter) {
      case 'company':
        return !this.searchResult.tenants?.length;
      case 'project':
        return !this.searchResult.projects?.length;
      case 'sprint':
        return !this.searchResult.sprints?.length;
      case 'issue':
        return !this.searchResult.issues?.length;
      default:
        return (
          !this.searchResult.tenants?.length &&
          !this.searchResult.projects?.length &&
          !this.searchResult.sprints?.length &&
          !this.searchResult.issues?.length
        );
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'low-tag';
      case 'medium':
        return 'medium-tag';
      case 'high':
        return 'high-tag';
      case 'critical':
        return 'critical-tag';
      default:
        return '';
    }
  }

  getIssueStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'backlog':
        return 'backlog-status';
      case 'in progress':
        return 'inprogress-status';
      case 'canceled':
        return 'cancelled-status';
      case 'completed':
        return 'complete-status';
      case 'reviewing':
        return 'reviewing-status';
      case 'postponed':
        return 'postpone-status';
      case 'to do':
        return 'todo-status';
      default:
        return '';
    }
  }

  getNotification() {
    this._DashboardService
      .getDashboardAllProject()
      .pipe(
        // Step 1: Fetch all users from projects
        map((res) => {
          this.projects = res.result;
          this.joinedUsers = [];

          for (let project of this.projects) {
            const tenantUsers = project.tenant?.joinedUsers || [];
            for (let user of tenantUsers) {
              if (!this.joinedUsers.some((u) => u.id === user.id)) {
                this.joinedUsers.push(user);
              }
            }
          }

          console.log('Joined Users:', this.joinedUsers);
          return this.joinedUsers;
        }),

        // Step 2: Switch to notification observable after users are ready
        switchMap(() => this._NotificationService.getNotification())
      )
      .subscribe({
        next: (res) => {
          this.notifications = res.result.notifications;
          // console.log('Notifications:', this.notifications);

          // Step 3: Match userId from notifications with joined users
          const joinedUserIds = new Set(this.joinedUsers.map((u) => u.id));
          console.log('Joined User IDs:', joinedUserIds);

          for (let notification of this.notifications) {
            if (joinedUserIds.has(notification.userId)) {
              const matchedUser = this.joinedUsers.find(
                (u) => u.id === notification.userId
              );
              if (matchedUser) {
                notification.userId = matchedUser; // Attach full user object
                // console.log('Matched Notification with User:', notification);
                this.NotifyUser = notification.userId;
              }
            }
          }
        },
        error: (err) => {
          console.error('Error in fetching notifications or users:', err);
        },
      });
  }

  markAsRead(notify: Notification, id: number) {
    if (!notify.isRead) {
      notify.isRead = true;
      // Optionally, send update to backend here.
      this._NotificationService.markAsRead(id).subscribe({
        next: (res) => {
          console.log('Notification marked as read:', res);
        },
      });
    }
  }
  showWindow = true;

  getClose() {
    this.showPanel = false;
    this.getNotification();
  }
}
