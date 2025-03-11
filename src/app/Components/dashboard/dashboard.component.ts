import { Component, inject } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { SideMenuComponent } from '../../Shared/side-menu/side-menu.component';
import { SearchBarComponent } from '../../Shared/search-bar/search-bar.component';
import { NgModelGroup } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { VisualizationComponent } from '../visualization/visualization.component';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CalendarComponent,
    SideMenuComponent,
    SearchBarComponent,
    NgClass,
    VisualizationComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isSidebarCollapsed = true;

  private readonly _DashboardService = inject(DashboardService);

  constructor(private sidebarService: SidebarService) {
    // this.getDashboardAllIProject(8);
    // this.getDashboardAllIssue(8);
    // this.getDashboardCalender();
  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
  }


  getDashboardAllIProject(tenentId: number) {
    this._DashboardService.getDashboardAllProject(tenentId).subscribe(
      {
        next: (res) => {
          console.log(res);
          // this.tenantContent = res;
          // this.completedIssues = res.result.completedIssues
        },
        error: (err) => {
          console.log(err);
          console.error(err);
        },
      }

    );

  }
  getDashboardAllIssue(tenentId: number) {
    this._DashboardService.getDashboardAllIssue(tenentId).subscribe(
      {
        next: (res) => {
          console.log(res);
          // this.tenantContent = res;
          // this.completedIssues = res.result.completedIssues
        },
        error: (err) => {
          console.log(err);
          console.error(err);
        },
      }

    );

  }
  getDashboardCalender() {
    this._DashboardService.getDashboardCalender().subscribe(
      {
        next: (res) => {
          console.log(res);
          // this.tenantContent = res;
          // this.completedIssues = res.result.completedIssues
        },
        error: (err) => {
          console.log(err);
          console.error(err);
        },
      }

    );

  }
}
