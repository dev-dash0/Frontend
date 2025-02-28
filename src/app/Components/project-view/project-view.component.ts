import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SprintModalComponent } from '../sprint-modal/sprint-modal.component';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-view.component.html',
  styleUrl: './project-view.component.css',
})
export class ProjectViewComponent {
  private sidebarService = inject(SidebarService);
  constructor(private dialog: MatDialog) {}
  openSprint() {
    this.dialog.open(SprintModalComponent, {
      width: 'auto',
      minWidth: '50vw',
      maxWidth: '80vw',
      minHeight: '70vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { message: 'Hello from modal!' },
    });
  }

  openDialog() {
    this.dialog.open(IssueModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '80vw',
      minHeight: '70vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { message: 'Hello from modal!' },
    });
  }
  isSidebarCollapsed = true;
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
  }
}
