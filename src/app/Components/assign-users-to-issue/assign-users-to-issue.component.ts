import { Component, ElementRef, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../Core/Services/project.service';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { HttpClient } from '@angular/common/http';
import { ProfileData } from '../../Core/interfaces/profile';
declare var bootstrap: any;

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
}
@Component({
  selector: 'app-assign-users-to-issue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-users-to-issue.component.html',
  styleUrl: './assign-users-to-issue.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AssignUsersToIssueComponent {
  @Input() issueId!: number; // <-- accept IssueId from parent (important)
  @Input() issueProjectId!: number; // <-- accept ProjectId from parent

  @ViewChild('assignButton') assignButton!: ElementRef;

  projectUsers: User[] = [];
  assignedUsers: User[] = [];
  dropdownVisible = false;
  searchTerm = '';

  constructor(
    private eRef: ElementRef,
    private _HttpClient: HttpClient,
    private _ProjectService: ProjectService,
    private _IssueService: IssueService
  ) { }

  ngOnInit(): void {
    this.loadProjectUsers();
    this.loadAssignedUsers();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach((tooltipTriggerEl: any) => {
        new bootstrap.Tooltip(tooltipTriggerEl, {
          boundary: 'window',
          customClass: 'my-custom-tooltip',
          html: true,
          sanitize: false,
        });
      });
    }, 0);
  }

  loadProjectUsers() {
    this._ProjectService.getProject(this.issueProjectId).subscribe({
      next: (res) => {
        this.projectUsers = res.result?.userProjects ?? [];
      },
      error: (err) => {
        console.error('Error loading project users', err);
      }
    });
  }

  loadAssignedUsers() {
    // this.assignedUsers = this._IssueService.getAssignedUsers(this.issueId);

    // You'll need an API to get assigned users for the issue
    this._IssueService.getIssueById(this.issueId).subscribe({
      next: (res) => {
        this.assignedUsers = res.result.assignedUsers ?? [];
      },
      error: (err) => {
        console.error('Error loading assigned users', err);
      }
    });
  }

  getTooltipHtml(user: User): string {
    return `<i class="fas fa-user me-1"></i> ${user.firstName} ${user.lastName}`;
  }

  get filteredUsers(): User[] {
    if (!this.searchTerm.trim()) return this.projectUsers;
    const lower = this.searchTerm.toLowerCase();
    return this.projectUsers.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower)
    );
  }

  isAssigned(user: User): boolean {
    return this.assignedUsers.some(u => u.userId === user.userId);
  }

  // toggleUserAssignment(user: User) {
  //   if (this.isAssigned(user)) {
  //     this._IssueService.removeUserFromIssue(user.userId, this.issueId).subscribe({
  //       next: () => {
  //         this.assignedUsers = this.assignedUsers.filter(u => u.userId !== user.userId);
  //         console.log(`Unassigned user ${user.userId} from issue ${this.issueId}`);
  //       },
  //       error: (err) => {
  //         console.error('Error unassigning user', err);
  //       }
  //     });
  //   } else {
  //     this._IssueService.assignUserToIssue(user.userId, this.issueId).subscribe({
  //       next: (res) => {
  //         console.log('Response:', res);
  //         this.assignedUsers.push(user);
  //         console.log(`Assigned user ${user.userId} to issue ${this.issueId}`);
  //       },
  //       error: (err) => {
  //         console.error('Error assigning user', err);
  //       }
  //     });
  //   }
  // }

  toggleUserAssignment(user: User) {
    if (this.isAssigned(user)) {
      this._IssueService.removeUserFromIssue(user.userId, this.issueId).subscribe({
        next: () => {
          this.assignedUsers = this.assignedUsers.filter(u => u.userId !== user.userId);
          this._IssueService.setAssignedUsers(this.issueId, this.assignedUsers);
        },
        error: (err) => {
          console.error('Error unassigning user', err);
        }
      });
    } else {
      this._IssueService.assignUserToIssue(user.userId, this.issueId).subscribe({
        next: () => {
          this.assignedUsers.push(user);
          this._IssueService.setAssignedUsers(this.issueId, this.assignedUsers);
        },
        error: (err) => {
          console.error('Error assigning user', err);
        }
      });
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
    if (this.dropdownVisible) {
      this.searchTerm = '';
      setTimeout(() => {
        const buttonRect = this.assignButton.nativeElement.getBoundingClientRect();
        const dropdown = document.querySelector('.assignment-dropdown') as HTMLElement;
        if (dropdown) {
          dropdown.style.position = 'fixed';
          dropdown.style.zIndex = '1060';
          dropdown.style.maxHeight = '';
          dropdown.style.overflowY = '';

          const dropdownRect = dropdown.getBoundingClientRect();
          const dropdownHeight = dropdownRect.height;
          const dropdownWidth = dropdownRect.width || 320;

          const margin = 4;
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const spaceAbove = buttonRect.top;
          const spaceRight = window.innerWidth - buttonRect.left;
          const spaceLeft = buttonRect.right;

          let top = 0;
          let left = 0;

          if (spaceBelow >= dropdownHeight + margin) {
            top = buttonRect.bottom + margin;
          } else if (spaceAbove >= dropdownHeight + margin) {
            top = buttonRect.top - dropdownHeight - margin;
          } else {
            const availableHeight = Math.max(spaceBelow, spaceAbove) - margin * 2;
            dropdown.style.maxHeight = `${availableHeight}px`;
            dropdown.style.overflowY = 'auto';
            top = buttonRect.bottom + margin;
          }

          if (spaceRight >= dropdownWidth + margin) {
            left = buttonRect.left;
          } else if (spaceLeft >= dropdownWidth + margin) {
            left = buttonRect.right - dropdownWidth;
          } else {
            left = Math.max((window.innerWidth - dropdownWidth) / 2, margin);
          }

          dropdown.style.top = `${top}px`;
          dropdown.style.left = `${left}px`;
        }
      }, 0);
    }
  }

  closeDropdown() {
    this.dropdownVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
