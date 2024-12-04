import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Chart } from 'chart.js/auto';
<<<<<<< HEAD
=======
import { SignupComponent } from "./Components/signup/signup.component";
import { SigninComponent } from './Components/signin/signin.component';
>>>>>>> signin
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
<<<<<<< HEAD
=======
    SignupComponent,
    SigninComponent
>>>>>>> signin
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';
}
