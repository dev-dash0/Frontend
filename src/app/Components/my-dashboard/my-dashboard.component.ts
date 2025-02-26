import { Component } from '@angular/core';
import { SearchBarComponent } from '../../Shared/search-bar/search-bar.component';
import { SideMenuComponent } from '../../Shared/side-menu/side-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AllProjectsDashboardComponent } from '../all-projects-dashboard/all-projects-dashboard.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-my-dashboard',
  standalone: true,
  imports: [
    SearchBarComponent,
    SideMenuComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    ProjectViewComponent,
    DashboardComponent,
    RouterOutlet,
    AllProjectsDashboardComponent,
    CommonModule,
  ],
  templateUrl: './my-dashboard.component.html',
  styleUrl: './my-dashboard.component.css',
})
export class MyDashboardComponent {}
