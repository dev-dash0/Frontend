import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-loader.component.html',
  styleUrl: './dashboard-loader.component.css'
})
export class DashboardLoaderComponent {
  @Input() size: number = 120;

}
