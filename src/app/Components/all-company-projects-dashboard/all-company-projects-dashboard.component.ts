import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-all-company-projects-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-company-projects-dashboard.component.html',
  styleUrl: './all-company-projects-dashboard.component.css',
})
export class AllCompanyProjectsDashboardComponent implements OnInit {
  totalprojects = 0;
  completedprojects = 0;
  projectsInProgress = 0;
  projectsOverdue = 0;
  @Input() companyId!: number;

  @ViewChild('totalprojectsChart')
  totalprojectsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completedprojectsChart')
  completedprojectsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectsInProgressChart')
  projectsInProgressChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('projectsOverdueChart')
  projectsOverdueChart!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getProjectsDashboard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companyId'] && !changes['companyId'].firstChange) {
      this.getProjectsDashboard();
    }
  }

  getProjectsDashboard(): void {
    if (!this.companyId) return;
    this.dashboardService.getDashboardData(this.companyId).subscribe({
      next: (res) => {
        const projects = res.result || {};
        this.totalprojects = Number(projects.totalProjects ?? 0);
        this.completedprojects = Number(projects.completedProjects ?? 0);
        this.projectsInProgress = Number(projects.projectsInProgress ?? 0);
        this.projectsOverdue = Number(projects.projectsOverdue ?? 0);

        this.initMiniCharts();
      },
      error: (err) => {
        console.error('Dashboard fetch error:', err);
      },
    });
  }

  initMiniCharts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      this.createMiniChart(
        this.totalprojectsChart,
        this.totalprojects,
        '#71a5ff',
        '#1347a3'
      );
      this.createMiniChart(
        this.completedprojectsChart,
        this.completedprojects,
        '#01fedd',
        '#5870f0'
      );
      this.createMiniChart(
        this.projectsInProgressChart,
        this.projectsInProgress,
        '#c120e6',
        '#5b6eef'
      );
      this.createMiniChart(
        this.projectsOverdueChart,
        this.projectsOverdue,
        '#f65d3f',
        '#5b6eef'
      );
    }, 0);
  }

  createMiniChart(
    chartElement: ElementRef<HTMLCanvasElement>,
    value: number,
    colorStart: string,
    colorEnd: string
  ): void {
    const canvas = chartElement.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    const total = value || 1; // prevent full white chart
    const data = [value, total - value];

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data,
            backgroundColor: [gradient, '#e0e0e0'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });
  }
}
