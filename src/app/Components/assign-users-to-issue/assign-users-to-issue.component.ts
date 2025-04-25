import { Component, HostListener } from '@angular/core';
import { ProfileData } from '../../Core/interfaces/profile';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-users-to-issue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-users-to-issue.component.html',
  styleUrl: './assign-users-to-issue.component.css'
})
export class AssignUsersToIssueComponent {
  showDropdown = false;
  searchTerm = '';
  allUsers: ProfileData[] = [

  ];
  assignedUsers: ProfileData[] = [
  ];
  filteredUsers: ProfileData[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.filterUsers();
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.assign-dropdown-container')) {
      this.showDropdown = false;
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.searchTerm = '';
      this.filterUsers();
    }
  }

  filterUsers(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = term
      ? this.allUsers.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      )
      : [...this.allUsers];
  }

  isAssigned(userId: number): boolean {
    return this.assignedUsers.some(user => user.id === userId);
  }

  toggleUserAssignment(userId: number): void {
    this.isAssigned(userId) ? this.unassignUser(userId) : this.assignUser(userId);
  }

  assignUser(userId: number): void {
    const user = this.allUsers.find(u => u.id === userId);
    if (!user) return;

    this.assignedUsers.push(user);

    this.http.post('/api/IssueAssignedUser', {
      userId: userId,
      issueId: 123 // Replace with dynamic value
    }).subscribe({
      next: (response: any) => {
        if (!response.isSuccess) {
          this.assignedUsers = this.assignedUsers.filter(u => u.id !== userId);
          console.error('Failed to assign user:', response.errorMessages);
        }
      },
      error: err => {
        this.assignedUsers = this.assignedUsers.filter(u => u.id !== userId);
        console.error('Error assigning user:', err);
      }
    });
  }

  unassignUser(userId: number): void {
    this.assignedUsers = this.assignedUsers.filter(u => u.id !== userId);

    this.http.request('delete', '/api/IssueAssignedUser', {
      body: {
        userId: userId,
        issueId: 123
      }
    }).subscribe({
      next: (response: any) => {
        if (!response.isSuccess) {
          const user = this.allUsers.find(u => u.id === userId);
          if (user) this.assignedUsers.push(user);
          console.error('Failed to unassign user:', response.errorMessages);
        }
      },
      error: err => {
        const user = this.allUsers.find(u => u.id === userId);
        if (user) this.assignedUsers.push(user);
        console.error('Error unassigning user:', err);
      }
    });
  }
}
