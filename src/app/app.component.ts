import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Chart } from 'chart.js/auto';
import { SigninSignupNavbarComponent } from './Shared/signin-signup-navbar/signin-signup-navbar.component';
import { MyDashboardComponent } from './Components/my-dashboard/my-dashboard.component';
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';
}
