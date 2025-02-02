import { Component } from '@angular/core';
import { MainDarkBtnComponent } from '../../Shared/main-dark-btn/main-dark-btn.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SigninSignupNavbarComponent } from '../../Shared/signin-signup-navbar/signin-signup-navbar.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MainDarkBtnComponent,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    SigninSignupNavbarComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  onSubmit(event: Event): void {
    event.preventDefault();
  }
}
