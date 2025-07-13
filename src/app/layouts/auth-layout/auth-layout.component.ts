import { Component, inject } from '@angular/core';
import { SigninSignupNavbarComponent } from "../../Shared/signin-signup-navbar/signin-signup-navbar.component";
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Core/Services/Auth.service';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [SigninSignupNavbarComponent, RouterOutlet, CommonModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {
  readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.saveUserData(); // ✅ Make sure this is called
  }
}
