import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AllProjectsDashboardComponent } from "../all-projects-dashboard/all-projects-dashboard.component";



@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [MatTabsModule, AllProjectsDashboardComponent],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css',
})

export class VisualizationComponent {
  lotsOfTabs = new Array(5).fill(0).map((_, index) => `Project ${1 + index}`);
}
