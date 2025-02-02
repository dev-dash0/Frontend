import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { Chart } from 'chart.js/auto';
import { SigninSignupNavbarComponent } from './Shared/signin-signup-navbar/signin-signup-navbar.component';
import { MyDashboardComponent } from './Components/my-dashboard/my-dashboard.component';

import { SignupComponent } from "./Components/signup/signup.component";
import { SigninComponent } from './Components/signin/signin.component';
import { VisualizationComponent } from "./Components/visualization/visualization.component";
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { DashboardTestComponent } from "./Components/dashboard-test/dashboard-test.component";
import { CalendarComponent } from "./Components/calendar/calendar.component";
import { AddCompanyModalComponent } from "./Components/company-modal/company-modal.component";
import { AllProjectsDashboardComponent } from "./Components/all-projects-dashboard/all-projects-dashboard.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    SigninSignupNavbarComponent,
    MyDashboardComponent,
    SignupComponent,
    SigninComponent,
    DashboardTestComponent,
    CalendarComponent,
    ForgetPasswordComponent,
    AddCompanyModalComponent,
    AllProjectsDashboardComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';
}
