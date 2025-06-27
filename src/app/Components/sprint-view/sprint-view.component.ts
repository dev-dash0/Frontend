import { Sprint } from './../../Core/interfaces/sprint';
import { DialogService } from './../../Core/Services/dialog.service';
import { SidebarService } from './../../Core/Services/sidebar.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { Issues } from '../../Core/interfaces/company/issues';
import { IssueCategory } from '../../Core/interfaces/company/issue-category';
import { SprintService } from '../../Core/Services/sprint.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardLoaderComponent } from "../../Shared/dashboard-loader/dashboard-loader.component";
import { MatDialog } from '@angular/material/dialog';
import { Issue } from '../../Core/interfaces/Dashboard/Issue';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sprint-view',
  standalone: true,
  imports: [CommonModule, DashboardLoaderComponent,MatTooltipModule
    ,DragDropModule
  ],
  templateUrl: './sprint-view.component.html',
  styleUrl: './sprint-view.component.css',
})
export class SprintViewComponent {
  isSidebarCollapsed = true;
  private dialogService = inject(DialogService);
  private dialog = inject(MatDialog);
  private sidebarService = inject(SidebarService);
  private _sprintService = inject(SprintService);
  private _IssueService=inject(IssueService)
  private route = inject(ActivatedRoute);

  sprintId = Number(this.route.snapshot.paramMap.get('id'));
  sprintDetails: Sprint[] = [];
  issueLoading = true;
  issueCategories: IssueCategory[] = [];

  Priorities = [
    {
      value: 'Low',
    },
    {
      value: 'Normal',
    },
    {
      value: 'High',
    },
    {
      value: 'Urgent',
    },
  ];

  issueStatus = ['todo-wrapper', 'completed-wrapper', 'reviewing-wrapper', 'canceled-wrapper', 'postponed-wrapper', 'in-progress-wrapper'];
  spanStatus = ['todo-span', 'completed-span', 'reviewing-span', 'canceled-span', 'postponed-span', 'in-progress-span'];

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.getSprintDetails();
    this.route.paramMap.subscribe(() => {
      this.getSprintDetails();
    });

    this._IssueService.issueMoved$.subscribe(() => {
      this.getSprintDetails();
    });
    this._IssueService.issueUpdated$.subscribe(() => {
      this.getSprintDetails(); 
    });

    this._IssueService.assignedUsersUpdated$.subscribe((updatedIssueId) => {
      if (updatedIssueId) {
        this.getSprintDetails(); // ✅ تحديث sprint تلقائي بعد أي تعديل في assigned users
      }
    });
    
  }
///////////////////////////////////////////////////////
  getSprintDetails() {
    const sprintId = this.route.snapshot.paramMap.get('id');
    this._sprintService.getSprintData(sprintId).subscribe({
      next: (res) => {
        console.log('Issue Categories Ready For UI:', this.issueCategories);
        this.issueLoading = false;
        const rawSprint = Array.isArray(res.result) ? res.result : [res.result];
        this.sprintDetails = rawSprint.map((sprint: Sprint) => ({
          ...sprint,
          startDate: this.dateFormatter(sprint.startDate),
          endDate: this.dateFormatter(sprint.endDate),
          issues: sprint.issues.map((issue: Issue) => ({
            ...issue, 
            assignedUsers: issue.assignedUsers || [],
            startDate: this.dateFormatter(issue.startDate),
            deadline: this.dateFormatter(issue.deadline),
            category: issue.type,
            priority: issue.priority,
            priorityIcon: this.getPriorityIcon(issue.priority),
            isBacklog: issue.isBacklog,
            status: issue.status,       
            issueId: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            createdBy: issue.createdBy,
          })),
        }));
        console.log('Sprint Details:', res);
  
        const issues = rawSprint[0].issues || [];
  
        // Initialize empty categories
        const issueCategories: { [key: string]: IssueCategory } = {
          backlog: {
            name: 'Backlog',
            icon: 'assets/images/Issue Status/backlog.svg',
            class: 'backlog-tag',
            status: 'Backlog',
            issues: [],
          },
          'to do': {
            name: 'To Do',
            icon: 'assets/images/Issue Status/todo.svg',
            class: 'todo-tag',
            status: 'to do',
            issues: [],
          },
          'in progress': {
            name: 'In Progress',
            icon: 'assets/images/Issue Status/in-progress.svg',
            class: 'in-progress-tag',
            status: 'In Progress',
            issues: [],
          },
          reviewing: {
            name: 'Reviewing',
            icon: 'assets/images/Issue Status/reviewing.svg',
            class: 'reviewing-tag',
            status: 'Reviewing',
            issues: [],
          },
          completed: {
            name: 'Completed',
            icon: 'assets/images/Issue Status/Completed.svg',
            class: 'completed-tag',
            status: 'Completed',
            issues: [],
          },
        canceled: {
            name: 'Canceled',
            icon: 'assets/images/Issue Status/canceled.svg',
            class: 'canceled-tag',
            status: 'Canceled',
            issues: [],
          },
          postponed: {
            name: 'Postponed',
            icon: 'assets/images/Issue Status/postponed.svg',
            class: 'postponed-tag',
            status: 'Postponed',
            issues: [],
          },
  
        };

        for (const issue of issues) {
          const statusKey = issue.isBacklog ? 'backlog' : (issue.status?.trim().toLowerCase() || 'to do');

          if (issueCategories[statusKey]) {
            issueCategories[statusKey].issues.push({
              id: issue.id,
              title: issue.title,
              startDate: this.dateFormatter(issue.startDate),
              deadline: this.dateFormatter(issue.deadline),
              description: issue.description,
              type: issue.type,
              priority: issue.priority,
              priorityIcon: this.getPriorityIcon(issue.priority),
              assignedUsers: issue.assignedUsers || [],
              status: issue.status,
              isBacklog: issue.isBacklog,
              projectName: issue.projectName,
              createdBy: issue.createdBy,
              creationDate: issue.creationDate,
              labels: issue.labels,
              attachments: issue.attachments,
              sprintId: issue.sprintId,
              attachment: issue.attachment,
              attachmentPath: issue.attachmentPath, 
              deliveredDate: issue.deliveredDate,
              lastUpdate: issue.lastUpdate,
              projectId: issue.projectId,
            });

            console.log('Issue Categories:', issueCategories);
          } else {
            console.warn('Unknown status category:', statusKey, 'for issue:', issue.title);
          }
          
        }
        
  
        // Convert to array for template
        this.issueCategories = Object.values(issueCategories);

        this.connectedDropListsIds = this.issueCategories.map(category =>
          this.formatStatusId(category.status)
        );

  
        console.log('Mapped Issues by Status:', this.issueCategories);
      },
      error: (err) => {
        console.error('Error fetching sprint details:', err);
      },
    });
  }
  getPriorityIcon(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'assets/images/Issue Priorities/low.svg';
      case 'normal':
        return 'assets/images/Issue Priorities/normal.svg';
      case 'high':
        return 'assets/images/Issue Priorities/high.svg';
      case 'urgent':
        return 'assets/images/Issue Priorities/urgent.svg';
      default:
        return '';
    }
  }
  getPriorityImage(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'assets/images/Issue Priorities/high.svg';
      case 'medium':
        return 'assets/images/Issue Priorities/normal.svg';
      case 'low':
        return 'assets/images/Issue Priorities/low.svg';
        case 'critical':
          return 'assets/images/Issue Priorities/urgent.svg';
      default:
        return 'assets/images/Issue Priorities/Low.svg';
    }
  }
//////////////////////////////////////////////// 
// modals
openCreateIssue() {
  const dialogRef = this.dialog.open(IssueModalComponent, {
    width: 'auto',
    minWidth: '60vw',
    maxWidth: '70vw', // Limits width to 80% of viewport
    minHeight: '60vh',
    data: { sprintId: this.sprintId, message: 'sprint'}
     
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'created') {
      this.getSprintDetails(); // Refresh the sprint details
    }
  });
  
}
openIssueView(issueId: number) {
  this.dialogService.openIssueViewModal(issueId);
}

//////////////////////////////////////////////// 

  // getWrapperClass(status: string): string {
  //   switch (status) {
  //     case 'to do':
  //       return this.issueStatus[0];
  //       case 'In Progress':
  //         return this.issueStatus[1];
  //     case 'Reviewing':
  //       return this.issueStatus[2];
  //     case 'Completed':
  //       return this.issueStatus[3];
  //     case 'Canceled':
  //       return this.issueStatus[4];
  //     case 'Postponed':
  //       return this.issueStatus[5];
  //     default:
  //       return '';
  //   }
  // }

  // getSpanStatus(status: string): string {
  //   switch (status) {
  //     case 'to do':
  //       return this.spanStatus[0];
  //     case 'In Progress':
  //       return this.spanStatus[1];
  //     case 'Completed':
  //       return this.spanStatus[2];
  //       case 'Reviewing':
  //         return this.issueStatus[2];
  //       case 'Canceled':
  //         return this.issueStatus[4];
  //       case 'Postponed':
  //         return this.issueStatus[5];
  //     default:
  //       return '';
  //   }
  // }

  // dateFormatter(dateString: string | Date): string {
  //   const dateFormat = new Date(dateString);
  //   const formatted = `${String(dateFormat.getDate()).padStart(
  //     2,
  //     '0'
  //   )}/${String(dateFormat.getMonth() + 1).padStart(
  //     2,
  //     '0'
  //   )}/${dateFormat.getFullYear()}`;
  //   return formatted;
  // }
  dateFormatter(dateString: string | Date | null | undefined): string {
    if (!dateString || dateString === '') {
      return '—';
    }
  
    const dateFormat = new Date(dateString);
    if (isNaN(dateFormat.getTime())) {
      return '—';
    }
  
    const day = dateFormat.getDate(); // بدون padStart علشان تطلع 5 مش 05
    const month = dateFormat.toLocaleString('en-US', { month: 'short' }); // Nov
  
    return `${day} ${month}`;
  }
  
  // ////////////////////////////////////////////////////////////////
//Date Format from string
getFormattedDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not set yet';

  const parts = dateStr.split('/');
  if (parts.length !== 3) return 'Not set yet';

  const day = +parts[0];
  const month = +parts[1] - 1; // JavaScript months start from 0
  const year = +parts[2];

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) return 'Not set yet';

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// //////////////////////////////////////////////////////////////////////////
// *************************Drag and Drop*************************
// ////////////////////////////////////////////////////////////////
connectedDropListsIds: string[] = [];

onIssueDropped(event: CdkDragDrop<any[]>, newStatus: string): void {
  const previousContainer = event.previousContainer;
  const currentContainer = event.container;

  if (previousContainer === currentContainer) return;

  const draggedIssue = previousContainer.data[event.previousIndex];

    // 1. Remove from old array, add to new
  transferArrayItem(
    previousContainer.data,
    currentContainer.data,
    event.previousIndex,
    event.currentIndex
  );

  // 2. Update backend issue status
  const updateData = new FormData();
  updateData.append("Title", draggedIssue.title);
  updateData.append("Description", draggedIssue.description ?? '');
  updateData.append("StartDate", draggedIssue.startDate ?? '');
  updateData.append("Deadline", draggedIssue.deadline ?? '');
  updateData.append("DeliveredDate", draggedIssue.deliveredDate ?? '');
  updateData.append("Type", draggedIssue.type ?? '');
  updateData.append("Status", newStatus); // what we are updating only
  updateData.append("Priority", draggedIssue.priority ?? '');
  updateData.append("Labels", draggedIssue.labels ?? '');
  updateData.append("SprintId", draggedIssue.sprintId?.toString() ?? '');
  updateData.append("IsBacklog", "false");
  updateData.append("LastUpdate", new Date().toISOString());

  this._IssueService.updateIssue(draggedIssue.id, updateData).subscribe({
    next: () => {
      console.log(`✅ Issue ${draggedIssue.id} status updated to ${newStatus}`);
      this._IssueService.notifyIssueUpdated();
    },
    error: (err) => {
      console.error('❌ Failed to update issue status:', err);
    }
  });
}

formatStatusId(status: string): string {
  return status.toLowerCase().replace(/\s/g, '-');
}


}
