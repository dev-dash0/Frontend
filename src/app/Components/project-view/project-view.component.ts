import { DialogService } from './../../Core/Services/dialog.service';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { CommonModule, NgFor } from '@angular/common';
import { ProjectService } from '../../Core/Services/project.service';
import { ProjectResult, UserProject } from '../../Core/interfaces/project';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css',
})
export class ProjectViewComponent {
  private sidebarService = inject(SidebarService);
  private dialogService = inject(DialogService);
  private readonly _ProjectService = inject(ProjectService);
  constructor(private dialog: MatDialog) {}

  isSidebarCollapsed = true;
  ProjectsList: ProjectResult[] = [];

  // openSprint() {
  //   this.dialog.open(SprintModalComponent, {
  //     width: 'auto',
  //     minWidth: '50vw',
  //     maxWidth: '80vw',
  //     minHeight: '70vh',
  //     maxHeight: '90vh',
  //     panelClass: 'custom-dialog-container',
  //     disableClose: true,
  //     data: { message: 'Hello from modal!' },
  //   });
  // }

  // openDialog() {
  //   this.dialog.open(IssueModalComponent, {
  //     width: 'auto',
  //     minWidth: '60vw',
  //     maxWidth: '80vw',
  //     minHeight: '70vh',
  //     maxHeight: '90vh',
  //     panelClass: 'custom-dialog-container',
  //     disableClose: true,
  //     data: { message: 'Hello from modal!' },
  //   });
  // }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
  }
  openIssue() {
    this.dialogService.openIssueModal();
  }
  openSprint() {
    this.dialogService.openSprintModal();
  }
}
