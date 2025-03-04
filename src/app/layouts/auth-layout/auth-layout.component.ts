import { Component } from '@angular/core';
import { SigninSignupNavbarComponent } from "../../Shared/signin-signup-navbar/signin-signup-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [SigninSignupNavbarComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css'
})
export class AuthLayoutComponent {

}
