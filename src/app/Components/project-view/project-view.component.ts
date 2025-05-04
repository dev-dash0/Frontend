import { Issue } from './../../Core/interfaces/Dashboard/Issue';
import { DialogService } from './../../Core/Services/dialog.service';
import { Component, inject, Input } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectService } from '../../Core/Services/project.service';
import {
  fetchedProjectDetails,
  ProjectOwner,
  ProjectResult,
  UserProject,
} from '../../Core/interfaces/project';
import { MatDialog } from '@angular/material/dialog';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { SharedDeleteModalComponent } from '../../Shared/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { SprintService } from '../../Core/Services/sprint.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Sprint } from '../../Core/interfaces/sprint';
import { SprintModalComponent } from '../sprint-modal/sprint-modal.component';
import { VisualizationComponent } from '../visualization/visualization.component';
import { AllProjectsDashboardComponent } from '../all-projects-dashboard/all-projects-dashboard.component';
import { AllIssuesDashboardComponent } from '../all-issues-dashboard/all-issues-dashboard.component';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [CommonModule, NgFor, AllIssuesDashboardComponent, RouterLink],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css',
})
export class ProjectViewComponent {
  private dialogService = inject(DialogService);
  private dialog = inject(MatDialog);
  private sidebarService = inject(SidebarService);
  private _IssueService = inject(IssueService);
  private toastr = inject(ToastrService);
  private readonly _ProjectService = inject(ProjectService);
  private readonly _projectService = inject(ProjectService);
  private readonly _sprintService = inject(SprintService);
  private readonly route = inject(ActivatedRoute);
  private _router = inject(Router);

  // -------------------------------------------------------

  // variables
  sprintDetails: Sprint[] = [];
  Owner: ProjectOwner | null = null;
  ProjectId: string | null = null;
  issue?: Issue;
  // showBacklog: boolean = true;
  backlogIssues: Issue[] = [];
  isSidebarCollapsed = true;
  ProjectsList: any = '';
  ProjectDetails?: fetchedProjectDetails;

  priorityConfig: any = {
    Critical: {
      icon: 'assets/images/Issue Priorities/urgent.svg',
      color: '#D02705',
    }, // Red
    High: { icon: 'assets/images/Issue Priorities/high.svg', color: '#D07805' }, // Orange
    Medium: {
      icon: 'assets/images/Issue Priorities/normal.svg',
      color: '#4854F1',
    }, // Yellow
    Low: { icon: 'assets/images/Issue Priorities/low.svg', color: '#908F8F' }, // Green
  };

  // ----------------------------------------------------------------------------

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.fetchBacklogIssues();

    // Get The Id from the Path
    this.ProjectId = this.route.snapshot.paramMap.get('id');

    this.GetProjectData();

    // Listen for new issue events and refresh backlog
    this._IssueService.issueCreated$.subscribe(() => {
      console.log('New issue created! Refreshing backlog...');
      this.fetchBacklogIssues();
    });

    this._sprintService.sprintCreated$.subscribe(() => {
      this.getAllSprints();
    });
  }

  // modals
  openCreateIssue() {
    this.dialogService.openIssueModal(6);
  }
  openIssueView(issueId: number) {
    this.dialogService.openIssueViewModal(issueId);
  }

  openCreateIssueModal(issueId: number, event: Event) {
    event.stopPropagation(); // Prevent parent div click event
    this.dialog.open(IssueModalComponent, {
      width: '600px',
      data: { issueId },
    });
  }

  // openSprint() {
  //   this.dialogService.openSprintModal();
  // }
  openSprint() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.dialog.open(SprintModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw',
      minHeight: '60vh',
      maxHeight: '90vh',
      data: { projectId },
    });
  }

  openDeleteIssueModal(issueId: number, issueTitle: string) {
    const hideConfirm = localStorage.getItem('hideDeleteConfirm');
    // if (hideConfirm === 'true') {
    //   this._IssueService.RemoveIssue(issueId);
    //   this.fetchBacklogIssues();
    //   return;
    // }
    if (hideConfirm === 'true') {
      this._IssueService.RemoveIssue(issueId);
      setTimeout(() => {
        this.fetchBacklogIssues(); // ✅ Ensures backlog refreshes after deletion
      }, 100); // Small delay to ensure delete operation finishes
      return;
    }

    const dialogRef = this.dialog.open(SharedDeleteModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Issue',
        message: `Are you sure you want to delete ${issueTitle}issue? `,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        itemId: issueId,
        deleteFunction: (id: number) => this._IssueService.RemoveIssue(id), // Pass function reference
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deleted') {
        console.log('Issue deleted successfully');
        // this.dialogService.showDeletionSuccess();  //Want to show toaster
        // this.showSuccess();
        // this._IssueService.showSuccess();
        this.fetchBacklogIssues();
      } else {
        // this.fetchBacklogIssues();
        console.log('Deletion canceled');
      }
    });
  }

  // ---------------------------------------------------

  // Projects Api
  GetProjectData() {
    const ProjectId = this.route.snapshot.paramMap.get('id');
    this._projectService.getProject(ProjectId).subscribe({
      next: (res) => {
        console.log('Project fetched:', res);
        this.ProjectDetails = res.result;
      }, error: (err)=> {
        console.log(err)
      }
    });
  }

  // ---------------------------------------------------

  // issues Api
  fetchBacklogIssues(): void {
    this._IssueService.getBacklogIssues(6, 0, 1).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log(res);
          this.backlogIssues = res.result;
        }
      },
      error: (err) => {
        console.error('Error fetching backlog issues:', err);
      },
    });
  }

  loadIssue(issueId: number): void {
    this._IssueService.getIssueById(issueId).subscribe({
      next: (res) => {
        console.log('Issue fetched:', res);
        this.issue = res;
        this.openIssueView(issueId);
      },
      error: (err) => {
        console.error('Error fetching issue:', err);
      },
    });
  }

  // ---------------------------------------------------

  // Sprint Api
  getAllSprints() {
    const ProjectId = this.route.snapshot.paramMap.get('id');
    this._projectService.getProject(ProjectId).subscribe({
      next: (res) => {
        this._sprintService.getAllSprints(res.result.id).subscribe({
          next: (res) => {
            this.sprintDetails = res.result.map((sprint: Sprint) => ({
              ...sprint,
              startDate: this.dateFormatter(sprint.startDate),
              endDate: this.dateFormatter(sprint.endDate),
            }));
          },
        });
      },
    });
  }

  viewSprint(sprintId: any): void {
    this._router.navigate(['/MyDashboard/Sprint', sprintId]);
  }

  // ---------------------------------------------------
  // normal functions

  getPriorityStyle(priority: string) {
    return { color: this.priorityConfig[priority]?.color || 'white' };
  }

  getPriorityIcon(priority: string) {
    return this.priorityConfig[priority]?.icon || 'assets/icons/default.svg'; // Default icon
  }

  showSuccess() {
    this.toastr.success('This issue has been removed', 'Removed Successfully', {
      toastClass: 'toast-pink',
      timeOut: 5000, // Set to 5 seconds
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  dateFormatter(dateString: string | Date): string {
    const dateFormat = new Date(dateString);
    const formatted = `${String(dateFormat.getDate()).padStart(
      2,
      '0'
    )}/${String(dateFormat.getMonth() + 1).padStart(
      2,
      '0'
    )}/${dateFormat.getFullYear()}`;
    return formatted;
  }
}
