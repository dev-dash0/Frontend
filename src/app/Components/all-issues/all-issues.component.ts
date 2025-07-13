import { Component, inject, OnInit, Output } from '@angular/core';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { DialogService } from '../../Core/Services/dialog.service';
import { AssignUsersToIssueComponent } from '../assign-users-to-issue/assign-users-to-issue.component';
import { Issue } from '../../Core/interfaces/Dashboard/Issue';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { PinnedService } from '../../Core/Services/pinned.service';
import { ToastrService } from 'ngx-toastr';
import { EventEmitter } from '@angular/core';


interface IssueWithPin extends Issue {
  isPinned: boolean;
}

@Component({
  selector: 'app-all-issues',
  standalone: true,
  imports: [CommonModule,MatTooltipModule,FormsModule],
  templateUrl: './all-issues.component.html',
  styleUrl: './all-issues.component.css'
})
export class AllIssuesComponent implements OnInit {
  myIssues: IssueWithPin[] = [];
  isLoading: boolean = true;
  isModalOpen:boolean=true;
  assignUsersComp!: AssignUsersToIssueComponent;
  priorityConfig: any = {
    Critical: {
      icon: 'assets/images/Issue Priorities/urgent.svg',
      color: '#F44336',
    }, // Red
    High: { icon: 'assets/images/Issue Priorities/high.svg', color: '#FFC107' }, // Orange
    Medium: {
      icon: 'assets/images/Issue Priorities/normal.svg',
      color: '#4854F1',
    }, // Yellow
    Low: { icon: 'assets/images/Issue Priorities/low.svg', color: '#908F8F' }, // Green
  };

  private dialogService = inject(DialogService);
  constructor(private dashboardService: DashboardService,private _IssueService:IssueService) {}

  ngOnInit(): void {
    this.getUserIssues();
  }

  // getUserIssues() {
  //   this.dashboardService.getDashboardAllIssue().subscribe({
  //     next: (res) => {
  //       this.myIssues = res.result || [];
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  getUserIssues() {
    this.dashboardService.getDashboardAllIssue().subscribe({
      next: (res) => {
        const issuesFromApi = res.result || [];
  
        // ➊ نضيف isPinned=false مؤقتًا
        this.myIssues = issuesFromApi.map((issue: Issue) => ({
          ...issue,
          isPinned: false
        }));
  
        // ➋ نجيب pinned issues ونحدد مين منهم pinned فعلاً
        this._PinnedService.getPinnedIssues().subscribe({
          next: (pinnedRes) => {
            const pinnedIds = pinnedRes.result.map((i: any) => i.id);
  
            this.myIssues.forEach(issue => {
              if (pinnedIds.includes(issue.id)) {
                issue.isPinned = true;
              }
            });
          },
          error: (err) => console.error('Error loading pinned issues:', err)
        });
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  getDeadlineStatus(deadline: string | null | undefined): 'passed' | 'upcoming' | 'unknown' {
    if (!deadline || isNaN(Date.parse(deadline))) {
      return 'unknown'; 
    }
  
    const now = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < now ? 'passed' : 'upcoming';
  }
  

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s === 'completed') return 'badge-success';
    if (s === 'in progress') return 'badge-warning';
    if (s === 'canceled') return 'badge-danger';
    return 'badge-secondary';
  }

  getPriorityColor(priority: string): string {
    const p = priority.toLowerCase();
    if (p === 'critical') return 'critical';
    if (p === 'high') return 'high';
    if (p === 'medium') return 'medium';
    return 'low';
  }

  getPriorityIcon(priority: string) {
    return this.priorityConfig[priority]?.icon || 'assets/icons/default.svg'; // Default icon
  }

  //*******************Open Issue Modal********************* */
    // Open the issue view in a modal
    loadIssue(issueId: number): void {
      this._IssueService.getIssueById(issueId).subscribe({
        next: (res) => {
          // console.log('Issue fetched:', res);
          // this.issue = res;
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
// *******************Filter****************************************
// *************************Filter by Project Status **************

searchTerm: string = '';
selectedStatus: string = 'All';
statusFilters: string[] = ['All', 'Completed', 'In Progress', 'Reviewing', 'Postponed', 'Canceled', 'BackLog'];

filterByStatus(status: string) {
  this.selectedStatus = status;
}


// *************************Filter by Project Name **************
selectedProject: string = '';
selectedPriority: string = '';

get uniqueProjects(): string[] {
  return [...new Set(this.myIssues.map(i => i.projectName))];
}

get uniquePriorities(): string[] {
  return [...new Set(this.myIssues.map(i => i.priority))];
}


// *************************Reset and sort issues by priority  **************
sortOption: string = 'recent';

resetFilters() {
  this.searchTerm = '';
  this.selectedStatus = 'All';
  this.selectedProject = '';
  this.selectedPriority = '';
  this.sortOption = 'recent';
}

sortIssues(issues: IssueWithPin[]) {
  if (this.sortOption === 'priority') {
    const priorityOrder = ['Critical', 'High', 'Medium', 'Low'];
    return issues.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
  } 
  else if (this.sortOption === 'closest') {
    const today = new Date();
    return issues
      .filter(issue => issue.deadline)
      .sort((a, b) =>
        Math.abs(new Date(a.deadline).getTime() - today.getTime()) -
        Math.abs(new Date(b.deadline).getTime() - today.getTime())
      );
  } 
  else if (this.sortOption === 'overdue') {
    const now = new Date();
    return issues
      .filter(issue => new Date(issue.deadline) < now)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  } 
  else {
    return issues.sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  }
}


filteredIssues() {
  const filtered = this.myIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(this.searchTerm.toLowerCase());
    const matchesStatus = this.selectedStatus === 'All' || issue.status.toLowerCase() === this.selectedStatus.toLowerCase();
    const matchesProject = this.selectedProject === '' || issue.projectName === this.selectedProject;
    const matchesPriority = this.selectedPriority === '' || issue.priority === this.selectedPriority;
    return matchesSearch && matchesStatus && matchesProject && matchesPriority;
  });

  return this.sortIssues(filtered);
}

// **********************Export to CSV**************
exportToCSV() {
  const headers = ['ID', 'Title', 'Status', 'Priority', 'Project', 'Deadline'];
  const rows = this.filteredIssues().map(issue =>
    [issue.id, issue.title, issue.status, issue.priority, issue.projectName, issue.deadline]
  );

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my_issues.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// **********************Copy to Clipboard**************
copyIssuesToClipboard() {
  const issuesText = this.filteredIssues().map(issue =>
    `• [${issue.projectName}] ${issue.title} - ${issue.status} (${issue.priority}) - ${issue.deadline}`
  ).join('\n');

  navigator.clipboard.writeText(issuesText)
    .then(() => alert('✅ Issues copied to clipboard!'))
    .catch(err => alert('❌ Failed to copy issues.'));
}

// **********************count issues by Status**************

getCountForStatus(status: string): number {
  if (status === 'All') return this.myIssues.length;
  return this.myIssues.filter(issue => issue.status.toLowerCase() === status.toLowerCase()).length;
}
// ▼ For toggling dropdowns
isProjectDropdownOpen = false;
isPriorityDropdownOpen = false;
isSortDropdownOpen = false;

// ▼ For selected labels
selectedProjectLabel = 'All Projects';
selectedPriorityLabel = 'All Priorities';
selectedSortLabel = 'Sort by...';

toggleDropdown(type: 'project' | 'priority' | 'sort') {
  if (type === 'project') {
    this.isProjectDropdownOpen = !this.isProjectDropdownOpen;
    this.isPriorityDropdownOpen = false;
    this.isSortDropdownOpen = false;
  } else if (type === 'priority') {
    this.isPriorityDropdownOpen = !this.isPriorityDropdownOpen;
    this.isProjectDropdownOpen = false;
    this.isSortDropdownOpen = false;
  } else if (type === 'sort') {
    this.isSortDropdownOpen = !this.isSortDropdownOpen;
    this.isProjectDropdownOpen = false;
    this.isPriorityDropdownOpen = false;
  }
}

selectProject(project: string) {
  this.selectedProject = project;
  this.selectedProjectLabel = project || 'All Projects';
  this.isProjectDropdownOpen = false;
}

selectPriority(priority: string) {
  this.selectedPriority = priority;
  this.selectedPriorityLabel = priority || 'All Priorities';
  this.isPriorityDropdownOpen = false;
}

selectSort(sort: string) {
  this.sortOption = sort;
  this.selectedSortLabel = this.getSortLabel(sort);
  this.isSortDropdownOpen = false;
}

getSortLabel(value: string): string {
  switch (value) {
    case 'recent': return 'Upcoming Deadlines';
    case 'closest': return 'Closest to Today';
    case 'overdue': return ' Overdue Only';
    case 'priority': return 'Priority Order';
    default: return 'Sort by...';
  }
}

// ****************Pin &Unpin Issues******************

@Output() pinChanged = new EventEmitter<{ id: number; pinned: boolean }>();
private readonly _PinnedService = inject(PinnedService);
isPinned = false; // current pin status
togglePin(issue: IssueWithPin, event: MouseEvent) {
  event.stopPropagation();

  if (issue.isPinned) {
    this._PinnedService.UnPinItem('issue', issue.id).subscribe({
      next: () => {
        issue.isPinned = false;
        this.showSuccess('Issue unpinned successfully');
        this.pinChanged.emit({ id: issue.id, pinned: false });
      },
      error: (err) => {
        console.error('Unpinning failed:', err);
        this.showError(err.error.message);
      },
    });
  } else {
    this._PinnedService.PinItem('issue', issue.id).subscribe({
      next: () => {
        issue.isPinned = true;
        this.showSuccess('Issue pinned successfully');
        this.pinChanged.emit({ id: issue.id, pinned: true });
      },
      error: (err) => {
        console.error('Pinning failed:', err);
        this.showError(err.error.message);
      },
    });
  }
}


/***************Toaster******************** */
private readonly _toaster = inject(ToastrService);
showError(err: string) {
  this._toaster.error(err, 'Error Message', {
    toastClass: 'toast-pink',
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing',
  });
}
showSuccess(Message:string){
  this._toaster.success(Message, 'Success Message', {
    toastClass: 'toast-pink',
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing',
  });
}
}
