import { Issue } from './../../Core/interfaces/Dashboard/Issue';
import { DialogService } from './../../Core/Services/dialog.service';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectResult } from '../../Core/interfaces/project';
import { MatDialog } from '@angular/material/dialog';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { SharedDeleteModalComponent } from '../../Shared/delete-modal/delete-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [CommonModule, NgFor, SharedDeleteModalComponent],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css',
})
export class ProjectViewComponent {
  private sidebarService = inject(SidebarService);
  private dialogService = inject(DialogService);
  private _IssueService = inject(IssueService);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute)

  projectId!: number;
  issue?: Issue;
  // showBacklog: boolean = true;
  backlogIssues: Issue[] = [];

  isSidebarCollapsed = true;
  ProjectsList: ProjectResult[] = [];
  priorityConfig: any = {
    Critical: { icon: 'assets/images/Issue Priorities/urgent.svg', color: '#D02705' }, // Red
    High: { icon: 'assets/images/Issue Priorities/high.svg', color: '#D07805' }, // Orange
    Medium: { icon: 'assets/images/Issue Priorities/normal.svg', color: '#4854F1' }, // Yellow
    Low: { icon: 'assets/images/Issue Priorities/low.svg', color: '#908F8F' }, // Green
  };

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    // Listen for new issue events and refresh backlog

    this.RefreshBacklogAfterAddingIssue();

    // Get Project id from url
    this.getProjectId()
  }

  getProjectId() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = +id;
        this.fetchBacklogIssues();
      }
    });
  }

  RefreshBacklogAfterAddingIssue() {
    // Listen for new issue events and refresh backlog
    this._IssueService.issueCreated$.subscribe(() => {
      console.log('New issue created! Refreshing backlog...');
      this.fetchBacklogIssues();
    });
  }
  openCreateIssue() {
    this.dialogService.openIssueModal(this.projectId);
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

  openSprint() {
    this.dialogService.openSprintModal();
  }


  fetchBacklogIssues(): void {
    console.log('Fetching backlog issues for project ID:', this.projectId);
    this._IssueService.getBacklogIssues(this.projectId, 0, 1).subscribe({
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

  getPriorityStyle(priority: string) {
    return { color: this.priorityConfig[priority]?.color || 'white' };
  }

  getPriorityIcon(priority: string) {
    return this.priorityConfig[priority]?.icon || 'assets/icons/default.svg'; // Default icon
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
      }
    });

    dialogRef.afterClosed().subscribe(result => {
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

  showSuccess() {
    this.toastr.success(
      'This issue has been removed',
      'Removed Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 5000, // Set to 5 seconds
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }
  loadIssue(issueId: number): void {
    this._IssueService.getIssueById(issueId).subscribe({
      next: (res) => {
        // console.log('Issue fetched:', res);
        // this.issue = res;
        this.openIssueView(issueId);
      },
      error: (err) => {
        console.error('Error fetching issue:', err);
      },
    });
  }





}



