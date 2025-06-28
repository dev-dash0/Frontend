import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/Auth.service';
import { NotificationService } from '../../Core/Services/notification.service';
import { Notification, Project, User, UserProject } from '../../Core/interfaces/notification';
import { CompanyService } from '../../Core/Services/company.service';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { O } from '@angular/cdk/keycodes';
import { ProjectResult } from '../../Core/interfaces/project';
import { map, switchMap } from 'rxjs';
import { BlobOptions } from 'buffer';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _NotificationService = inject(NotificationService);
  private readonly _DashboardService = inject(DashboardService);
  private readonly _Router = inject(Router);
  toggle = false;
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
    this._AuthService.Logout(logoutParams).subscribe({
      next: (res) => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.clear();
        this._Router.navigate(['/signin']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
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
