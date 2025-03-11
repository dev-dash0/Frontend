import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/Auth.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  toggle = false;
  toggleMode() {
    this.toggle = !this.toggle;
  }
  LogOut() {
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      console.warn('no tokens found,you are logged out.');
      return;
    }
    const logoutParams = { accessToken, refreshToken };
    this._AuthService.Logout(logoutParams).subscribe({
      next: (res) => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.clear();
        this._Router.navigate(['/signin']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
