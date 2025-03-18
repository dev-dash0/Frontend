import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AllProjectsDashboardComponent } from "../all-projects-dashboard/all-projects-dashboard.component";
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';



@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [MatTabsModule, AllProjectsDashboardComponent],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css',
})

export class VisualizationComponent {
  lotsOfTabs = new Array(5).fill(0).map((_, index) => `Tenant ${1 + index}`);
  private readonly _DashboardService = inject(DashboardService);
  constructor() {
  }

}
