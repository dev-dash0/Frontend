import { RouterLink, RouterOutlet } from '@angular/router';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../../Components/project-modal/project-modal.component';
import { IssueModalComponent } from '../../Components/issue-modal/issue-modal.component';
import { AddCompanyModalComponent } from '../../Components/company-modal/company-modal.component';
import { SprintModalComponent } from '../../Components/sprint-modal/sprint-modal.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, RouterLink],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  dropdownStates: { [key: string]: boolean } = {};

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = window.innerWidth;
    this.collapsed = width <= 992;
  }
  toggleCollapseDropDown(id: string) {
    this.dropdownStates[id] = !this.dropdownStates[id];
  }

  collapsed = false;

  constructor(
    private sidebarService: SidebarService,
    private dialog: MatDialog
  ) {}

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.sidebarService.setSidebarState(this.collapsed); // Notify other components
  }

  // ! <------- Project Modal ------->

  openProj() {
    this.dialog.open(ProjectModalComponent, {
      width: 'auto',
      minWidth: '50vw',
      maxWidth: '80vw', // Limits width to 90% of viewport
      minHeight: '70vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }

  // ! <------- Issue Modal ------->

  openDialog() {
    this.dialog.open(IssueModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '80vw', // Limits width to 90% of viewport
      minHeight: '70vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }

  // ! <------- Company Modal ------->

  openCompany() {
    this.dialog.open(AddCompanyModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '80vw', // Limits width to 90% of viewport
      minHeight: '70vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }

  // <!----- Sprint Modal ------>

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
}
