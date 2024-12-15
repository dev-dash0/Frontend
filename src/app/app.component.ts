import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Chart } from 'chart.js/auto';
import { SignupComponent } from "./Components/signup/signup.component";
import { ForgetpasswordComponent } from "./Components/forgetpassword/forgetpassword.component";
import { Forgetpassword2Component } from "./Components/forgetpassword2/forgetpassword2.component";
import { Forgetpassword3Component } from "./Components/forgetpassword3/forgetpassword3.component";
import { Forgetpassword4Component } from "./Components/forgetpassword4/forgetpassword4.component";
import { SigninComponent } from './Components/signin/signin.component';
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
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
    ForgetpasswordComponent,
    Forgetpassword2Component,
    ForgetPasswordComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';
}
