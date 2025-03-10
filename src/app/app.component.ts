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
import { SigninComponent } from "./Components/signin/signin.component";
import { SignupComponent } from "./Components/signup/signup.component";
import { UpdateInfoComponent } from './Components/update-info/update-info.component';
import { WelcomePageComponent } from "./Components/welcome-page/welcome-page.component";

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
    DashboardComponent,
    SigninComponent,
    SignupComponent,
    WelcomePageComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';

  constructor(private dialog: MatDialog) { }

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
  openIssueModal() {
    this.openDialog(IssueModalComponent, {
      message: 'Hello from Issue Modal!',
    });
  }

  // ! Project Modal //////////////////////////////////////////////////////////////////
  openProjModal() {
    this.openDialog(ProjectModalComponent, {
      message: 'Hello from Project Modal!',
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
}
