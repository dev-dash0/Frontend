import { RouterOutlet } from '@angular/router';
import { Component, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  // collapsed = false;
  dropdownStates: { [key: string]: boolean } = {};

  // @HostListener('window:resize', ['$event'])
  // onResize(event: Event): void {
  //   const width = window.innerWidth;
  //   this.collapsed = width <= 768;
  // }

  // toggleCollapse(): void {
  //   this.collapsed = !this.collapsed;
  // }
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
}
