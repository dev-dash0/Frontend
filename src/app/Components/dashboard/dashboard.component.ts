import { Component } from '@angular/core';
import { CalendarComponent } from "../calendar/calendar.component";
import { SideMenuComponent } from "../../Shared/side-menu/side-menu.component";
import { SearchBarComponent } from "../../Shared/search-bar/search-bar.component";
import { NgModelGroup } from '@angular/forms';
import { NgClass } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { VisualizationComponent } from "../visualization/visualization.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalendarComponent, SideMenuComponent, SearchBarComponent, NgClass, VisualizationComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isSidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) {}

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
  }
}
