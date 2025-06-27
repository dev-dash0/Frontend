import { Component, ElementRef, HostListener, Input, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../Core/Services/project.service';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { User } from '../../Core/interfaces/User';

declare var bootstrap: any;


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
  @ViewChildren('tooltipRef') tooltipElements!: QueryList<ElementRef>;

  projectUsers: User[] = [];
  assignedUsers: User[] = [];
  dropdownVisible = false;
  searchTerm = '';
  isLoadingAssignedUsers: boolean = true;
  isLoadingProjectUsers: boolean = true;


  constructor(
    private eRef: ElementRef,
    private _ProjectService: ProjectService,
    private _IssueService: IssueService
  ) { }

  ngOnInit(): void {
    this.loadAssignedUsers();
    this.loadProjectUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['issueId'] && !changes['issueId'].firstChange) {
      this.loadAssignedUsers();
      this.loadProjectUsers();
    }
  }
  // /***********************Tooltip****************************** *//
  ngAfterViewInit(): void {
    this.tooltipElements.changes.subscribe(() => {
      this.initializeTooltips();
    });
  }

  initializeTooltips() {
    setTimeout(() => {
      this.tooltipElements.forEach((elRef) => {
        new bootstrap.Tooltip(elRef.nativeElement, {
          boundary: 'window',
          customClass: 'my-custom-tooltip',
          html: true,
          sanitize: false,
        });
      });
    });
  }
  getTooltipHtml(user: User): string {
    return `<i class="fas fa-user me-1"></i> ${user.firstName} ${user.lastName}`;
  }
  // ///////////////////////////////////////////////////////////////////////////////
  loadAssignedUsers() {
    this._IssueService.getIssueById(this.issueId).subscribe({
      next: (res) => {
        // توحيد هيكل البيانات مع projectUsers
        this.assignedUsers = res.result.assignedUsers.map((user: any) => ({
          id: user.id || user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          imageUrl: user.imageUrl
        }));
        this.isLoadingAssignedUsers = false;
        console.log('Assigned users after load:', this.assignedUsers);
      },
      error: (err) => {
        console.error('Error Loading assigned users', err);
        this.isLoadingAssignedUsers = false;
      }
    });
  }

  loadProjectUsers() {
    this._ProjectService.getProject(this.issueProjectId).subscribe({
      next: (res) => {
        this.projectUsers = res.result?.tenant.joinedUsers?.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          imageUrl: user.imageUrl
        })) || [];
        console.log('Project users:', this.projectUsers);
        this.isLoadingProjectUsers = false;
      },
      error: (err) => {
        console.error('Error loading project users', err);
        this.isLoadingProjectUsers = false;

      }
    });
  }
  trackByUserId(index: number, user: User): number {
    return user.id;
  }


  get filteredUsers(): User[] {
    if (!this.searchTerm.trim()) return this.projectUsers;
    const lower = this.searchTerm.toLowerCase();
    return this.projectUsers.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(lower) ||
      user.email.toLowerCase().includes(lower)
    );
  }

  isAssigned(id: number): boolean {
    return this.assignedUsers.some(u => u.id === id);
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



  toggleUserAssignment(user: User) {
    if (!user || !user.id) {
      console.error('Invalid user object or missing id', user);
      return;
    }

    console.log('Current assigned users:', this.assignedUsers);
    console.log('Toggling user:', user);

    if (this.isAssigned(user.id)) {
      this._IssueService.removeUserFromIssue(user.id, this.issueId).subscribe({
        next: () => {
          this.assignedUsers = this.assignedUsers.filter(u => u.id !== user.id);
          console.log('After unassign:', this.assignedUsers);
          this._IssueService.setAssignedUsers(this.issueId, this.assignedUsers);
          //Refresh Assigned,project users
          this.loadAssignedUsers();
          this.loadProjectUsers();

          this._IssueService.notifyAssignedUsersUpdated(this.issueId);

        },
        error: (err) => {
          console.error('Error unassigning user', err);
        }
      });
    } else {
      this._IssueService.assignUserToIssue(user.id, this.issueId).subscribe({
        next: () => {
          // التأكد من عدم وجود تكرار قبل الإضافة
          if (!this.assignedUsers.some(u => u.id === user.id)) {
            this.assignedUsers.push(user);
          }
          console.log('After assign:', this.assignedUsers);
          this._IssueService.setAssignedUsers(this.issueId, this.assignedUsers);
          //Refresh Assigned,project users
          this.loadAssignedUsers();
          this.loadProjectUsers();

          this._IssueService.notifyAssignedUsersUpdated(this.issueId);

        },
        error: (err) => {
          console.error('Error assigning user', err);
        }
      });
    }
  }


}