import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChildren,
  QueryList,
  inject,
  Input,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';

Chart.register(...registerables);
@Component({
  selector: 'app-all-issues-dashboard-stack-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-issues-dashboard-stack-cards.component.html',
  styleUrl: './all-issues-dashboard-stack-cards.component.css'
})
export class AllIssuesDashboardStackCardsComponent {

   miniCharts: { id: string; label: string; value: number }[] = [];
  
    @ViewChildren('chartCanvas') chartCanvases!: QueryList<
      ElementRef<HTMLCanvasElement>
    >;
  
    @Input() projectId!: number;
  
    private readonly _DashboardService = inject(DashboardService);
  
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
      this.getProjectIssuesDashboard(38);
    }
  
    ngAfterViewInit() {
      this.getProjectIssuesDashboard(38);
    }
  
    getProjectIssuesDashboard(projectId: number) {
      this._DashboardService.GetDashboardForIssues(projectId).subscribe({
        next: (res) => {
          const issues = res.result;
  
          this.miniCharts = [
            {
              id: 'totalIssuesChart',
              label: 'Total Issues',
              value: issues.totalIssues ?? 0,
            },
            {
              id: 'completedIssuesChart',
              label: 'Completed',
              value: issues.completedIssues ?? 0,
            },
            {
              id: 'inProgressIssuesChart',
              label: 'In Progress',
              value: issues.issuesInProgress ?? 0,
            },
            {
              id: 'overdueIssuesChart',
              label: 'Overdue',
              value: issues.issuesOverdue ?? 0,
            },
          ];
  
          setTimeout(() => this.initMiniCharts(), 500); // wait for canvas to be ready
        },
        error: (err) => {
          console.error('Failed to fetch project issues:', err);
        },
      });
    }
  
    initMiniCharts() {
      if (isPlatformBrowser(this.platformId)) {
        this.chartCanvases.forEach((canvasRef, index) => {
          const chart = this.miniCharts[index];
          const ctx = canvasRef.nativeElement.getContext('2d')!;
  
          const gradient = ctx.createLinearGradient(0, 0, 0, 150);
          gradient.addColorStop(0, 'rgba(113,165,255,1)');
          gradient.addColorStop(1, 'rgba(19,71,163,1)');
  
          new Chart(ctx, {
            type: 'doughnut',
            data: {
              datasets: [
                {
                  data: [chart.value, 100 - chart.value],
                  backgroundColor: [gradient, '#F5F5F5'],
                  borderWidth: 0,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
              },
            },
          });
        });
      }
    }
  
    moveCardToBack(clickedIndex: number) {
      const clickedCard = this.miniCharts.splice(clickedIndex, 1)[0];
      this.miniCharts.push(clickedCard);
    }

}
