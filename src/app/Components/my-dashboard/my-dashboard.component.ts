import { Component } from '@angular/core';
import { SearchBarComponent } from '../../Shared/search-bar/search-bar.component';
import { SideMenuComponent } from '../../Shared/side-menu/side-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-my-dashboard',
  standalone: true,
  imports: [
    SearchBarComponent,
    SideMenuComponent,
    MatSidenavModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './my-dashboard.component.html',
  styleUrl: './my-dashboard.component.css',
})
export class MyDashboardComponent {}
