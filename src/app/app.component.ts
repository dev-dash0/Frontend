import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { IssueModalComponent } from './Components/issue-modal/issue-modal.component';
import { ProjectModalComponent } from './Components/project-modal/project-modal.component';
import { SprintModalComponent } from './Components/sprint-modal/sprint-modal.component';
import { AddCompanyModalComponent } from "./Components/company-modal/company-modal.component";
import { MyDashboardComponent } from "./Components/my-dashboard/my-dashboard.component";
import { DashboardTestComponent } from "./Components/dashboard-test/dashboard-test.component";
import { DashboardComponent } from "./Components/dashboard/dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    AddCompanyModalComponent,
    MyDashboardComponent,
    DashboardTestComponent,
    DashboardComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';

  constructor(private dialog: MatDialog) {}

  // ! Issue Modal  //////////////////////////////////////////////////////////////////
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

  // ! Project Modal //////////////////////////////////////////////////////////////////
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

  // ! Sprint Modal //////////////////////////////////////////////////////////////////
  openSprint() {
    this.dialog.open(SprintModalComponent, {
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
}
