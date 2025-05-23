import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IssueModalComponent } from '../../Components/issue-modal/issue-modal.component';
import { ProjectModalComponent } from '../../Components/project-modal/project-modal.component';
import { SprintModalComponent } from '../../Components/sprint-modal/sprint-modal.component';
import { UpdateInfoComponent } from '../../Components/update-info/update-info.component';
import { AddCompanyModalComponent } from '../../Components/company-modal/company-modal.component';
import { IssueViewModalComponent } from '../../Components/issue-view-modal/issue-view-modal.component';
import { ToastrService } from 'ngx-toastr';
import { UpdateProjectComponent } from '../../Components/update-project/update-project.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog, private toastr: ToastrService) {}

  openDialog(component: any, data: any = null) {
    this.dialog.open(component, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw', // Limits width to 80% of viewport
      minHeight: '60vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: data, // ✅ Pass dynamic data
    });
  }

  // ! Issue Modal  //////////////////////////////////////////////////////////////////
  openIssueModal(projectId: number) {
    this.openDialog(IssueModalComponent, {
      message: 'Hello from Issue Modal!',
      projectId, // ✅ Directly pass projectId instead of nesting it under another 'data' object
    });
  }
  openIssueViewModal(issueId: number) {
    this.openDialog(IssueViewModalComponent, {
      message: 'Hello from Issue View Modal!',
      issueId, // ✅ Directly pass projectId instead of nesting it under another 'data' object
    });
  }

  // ! Project Modal //////////////////////////////////////////////////////////////////
  openProjModal() {
    this.openDialog(ProjectModalComponent, {
      message: 'Hello from Project Modal!',
    });
  }

  openUpdateProjModal(projectId: number) {
    this.openDialog(UpdateProjectComponent, {
      message: 'Hello from Project Modal!',
      projectId,
    });
  }

  // ! Sprint Modal //////////////////////////////////////////////////////////////////
  openSprintModal() {
    this.openDialog(SprintModalComponent, {
      message: 'Hello from Sprint Modal!',
    });
  }

  // ! Update Info Modal //////////////////////////////////////////////////////////////////
  openUpdateInfoModal() {
    this.openDialog(UpdateInfoComponent, {
      message: 'Hello from Update Info Modal!',
    });
  }

  // ! open Company modal
  openCompanyModal() {
    this.openDialog(AddCompanyModalComponent, {
      message: 'Hello from Create company Modal!',
    });
  }
  // /////////////////////////////////////
  showDeletionSuccess() {
    this.toastr.success('The item has been removed', 'Removed Successfully', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
