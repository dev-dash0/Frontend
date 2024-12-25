import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { SignupComponent } from "./Components/signup/signup.component";
import { SigninComponent } from './Components/signin/signin.component';
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { DashboardTestComponent } from "./Components/dashboard-test/dashboard-test.component";
import { CalendarComponent } from "./Components/calendar/calendar.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    SignupComponent,
    SigninComponent,
    DashboardTestComponent,
    CalendarComponent,
    ForgetPasswordComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';
}
