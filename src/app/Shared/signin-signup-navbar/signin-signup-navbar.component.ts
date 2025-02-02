import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-signin-signup-navbar',
  standalone: true,
  imports: [MatToolbarModule, RouterLink],
  templateUrl: './signin-signup-navbar.component.html',
  styleUrl: './signin-signup-navbar.component.css',
})
export class SigninSignupNavbarComponent {}
