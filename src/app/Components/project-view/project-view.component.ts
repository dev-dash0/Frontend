import { DialogService } from './../../Core/Services/dialog.service';
import { Component, inject } from '@angular/core';
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
  private dialogService = inject(DialogService);
  isSidebarCollapsed = true;
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
