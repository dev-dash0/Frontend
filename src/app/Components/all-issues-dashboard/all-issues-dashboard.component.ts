import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-all-issues-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './all-issues-dashboard.component.html',
  styleUrl: './all-issues-dashboard.component.css',
})
export class AllIssuesDashboardComponent implements AfterViewInit {
  totalIssues: number = 0;
  completedIssues: number = 0;
  issuesInProgress: number = 0;
  issuesOverdue: number = 0;

  // Optionally define arrays for dynamic line chart data if available
  completedIssuesTrend: number[] = [];
  inProgressIssuesTrend: number[] = [];

  private readonly _DashboardService = inject(DashboardService);

  // @ViewChild('doughnutChart') doughnutChart!: ElementRef<HTMLCanvasElement>;
  //@ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;
  //@ViewChild('completedIssuesChart') completedIssuesChart!: ElementRef;
  //@ViewChild('inProgressIssuesChart') inProgressIssuesChart!: ElementRef;
  //@ViewChild('overdueIssuesChart') overdueIssuesChart!: ElementRef;

  @ViewChild('doughnutChart') doughnutChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completedIssuesChart') completedIssuesChart!: ElementRef;
  @ViewChild('totalIssuesChart')
  totalIssuesChart!: ElementRef;
  @ViewChild('issuesInProgressChart') issuesInProgressChart!: ElementRef;
  @ViewChild('issuesOverdueChart') issuesOverdueChart!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.getProjectIssuesDashboard(38); // Pass the project ID here
  }

  ngAfterViewInit() {
    // Only init charts after views (canvas) are ready
    this.getProjectIssuesDashboard(38);
  }

  // Rendering(){
  //       this.initMiniCharts();
  // }

  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      // this.initLineChart(this.completedIssuesTrend, this.inProgressIssuesTrend);
      // this.initDoughnutChart();
      this.initMiniCharts();
    }
  }

  getProjectIssuesDashboard(projectId: number) {
    this._DashboardService.GetDashboardForIssues(projectId).subscribe({
      next: (res) => {
        const issues = res.result;

        console.log('API Result:', issues);

        this.totalIssues = issues.totalIssues ?? 0;
        this.completedIssues = issues.completedIssues ?? 0;
        this.issuesInProgress = issues.issuesInProgress ?? 0;
        this.issuesOverdue = issues.issuesOverdue ?? 0;

        // Example: If you have trend data from API, set it here
        // For demonstration, fallback to static if not available
        this.completedIssuesTrend = issues.completedIssuesTrend ?? [
          12, 14, 18, 20, 22, 25,
        ];
        this.inProgressIssuesTrend = issues.inProgressIssuesTrend ?? [
          10, 12, 11, 13, 12, 15,
        ];

        console.log({
          total: this.totalIssues,
          completed: this.completedIssues,
          inProgress: this.issuesInProgress,
          overdue: this.issuesOverdue,
        });

        this.initCharts();
      },
      error: (err) => {
        console.error('Failed to fetch project issues:', err);
      },
    });
  }

  // Modified line chart to accept dynamic data
  initLineChart(completedData: number[], inProgressData: number[]) {
    const ctx = this.lineChart.nativeElement.getContext('2d');
    const gradient = ctx!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#6b62ef');
    gradient.addColorStop(1, '#be25e6');

    new Chart(ctx!, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Completed Issues',
            data: completedData,
            borderColor: gradient,
            borderWidth: 2.5,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
          {
            label: 'In Progress',
            data: inProgressData,
            borderColor: '#1ef4e4',
            borderWidth: 2.5,
            fill: false,
            tension: 0.4,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#fff',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#71A5FF',
            },
            grid: { display: false },
          },
          y: {
            ticks: {
              color: '#71A5FF',
            },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
        },
      },
    });
  }

  // initDoughnutChart() {
  //   const ctx = this.doughnutChart.nativeElement.getContext('2d');

  //   new Chart(ctx!, {
  //     type: 'doughnut',
  //     data: {
  //       labels: ['Completed', 'In Progress', 'Overdue'],
  //       datasets: [
  //         {
  //           data: [
  //             this.completedIssues,
  //             this.issuesInProgress,
  //             this.issuesOverdue,
  //           ],
  //           backgroundColor: ['#6b62ef', '#1ef4e4', '#f65d3f'],
  //           borderWidth: 1,
  //           borderRadius: 4,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       cutout: '60%',
  //       plugins: {
  //         legend: {
  //           display: true,
  //           position: 'bottom',
  //           labels: {
  //             color: '#7d92ca',
  //             padding: 30,
  //             font: {
  //               size: 12,
  //             },
  //             boxWidth: 10,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }

  initDoughnutChart() {
    const ctx = this.doughnutChart.nativeElement.getContext('2d');

    const gradient_purple = ctx!.createRadialGradient(
      100,
      350,
      350,
      150,
      150,
      50
    );
    gradient_purple.addColorStop(1, 'rgba(193, 32, 230, 1)');
    gradient_purple.addColorStop(0, 'rgba(91, 110, 239, 1)');

    const gradient_blueSky = ctx!.createRadialGradient(
      150,
      150,
      0,
      150,
      150,
      150
    );
    gradient_blueSky.addColorStop(0, 'rgba(78, 131, 237, 1)');
    gradient_blueSky.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
    gradient_blueSky.addColorStop(0.5, 'rgba(29, 246, 228,1)');
    gradient_blueSky.addColorStop(1, 'rgba(78, 131, 237, 1)');

    const gradient_pink = ctx!.createRadialGradient(
      150,
      150,
      150,
      150,
      150,
      50
    );
    gradient_pink.addColorStop(0, 'rgba(219, 131, 241, 1)');
    gradient_pink.addColorStop(1, 'rgb(249, 223, 255)');

    const doughnutChart = new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Overdue'],
        datasets: [
          {
            label: '# of Votes',
            // data: [50, 30, 20],
            data: [
              this.completedIssues,
              this.issuesInProgress,
              this.  issuesOverdue,
            ],
            backgroundColor: [gradient_purple, gradient_blueSky, gradient_pink],
            borderColor: [gradient_purple, gradient_blueSky, gradient_pink],
            borderWidth: 1,
            borderRadius: 3.5,
          },
        ],
      },
      options: {
        responsive: true, // Ensures the chart resizes with the window
        maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
        cutout: '55%',
        plugins: {
          legend: {
            display: true, // Optional: Hide legend
            position: 'bottom', // Set legend position to bottom
            labels: {
              padding: 35, // Optional: Add some spacing
              color: '#7d92ca', // Optional: Set text color
              font: {
                size: 10, // Reduce the font size
              },
              boxWidth: 10, // Reduce the size of color indicator boxes
            },
          },
        },
      },
    });
  }

  initMiniCharts() {
    this.createMiniChart(
      this.totalIssuesChart,
      this.totalIssues,
      'rgba(113,165,255,1)',
      'rgba(19,71,163,1)'
    );
    this.createMiniChart(
      this.completedIssuesChart,
      this.completedIssues,
      'rgba(88,112,240,1)',
      'rgba(1,254,219,1)'
    );
    this.createMiniChart(
      this.issuesInProgressChart,
      this.issuesInProgress,
      'rgba(193,32,230,1)',
      'rgba(91,110,239,1)'
    );
    this.createMiniChart(
      this.issuesOverdueChart,
      this.issuesOverdue,
      'rgba(246,93,63,1)',
      'rgba(91,110,239,1)'
    );
  }

  createMiniChart(
    chartElement: ElementRef,
    value: number,
    colorStart: string,
    colorEnd: string
  ) {
    const ctx = chartElement.nativeElement.getContext('2d');
    const gradient = ctx!.createLinearGradient(
      0,
      0,
      0,
      chartElement.nativeElement.height
    );
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);

    new Chart(ctx!, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [value, this.totalIssues - value],
            backgroundColor: [gradient, '#F5F5F5'],
            // backgroundColor: function (context) {
            //   const chart = context.chart;
            //   const ctx = chart.ctx;
            //   const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
            //   gradient.addColorStop(0, 'rgba(113,165,255,1)'); // Start color
            //   gradient.addColorStop(1, 'rgba(19,71,163,1)'); // End color
            //   if (context.dataIndex === 0) {
            //     return gradient; // Apply gradient to the first slice
            //   } else {
            //     return '#F5F5F5'; // Solid color for the second slice
            //   }
            // },
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

  // initSmallCharts() {
  //   Total Projects Chart
  //   new Chart(this.totalProjectsChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [10, 0], // Completed vs Remaining
  //           backgroundColor: function (context) {
  //             const chart = context.chart;
  //             const ctx = chart.ctx;
  //             const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  //             gradient.addColorStop(0, 'rgba(113,165,255,1)'); // Start color
  //             gradient.addColorStop(1, 'rgba(19,71,163,1)'); // End color
  //             if (context.dataIndex === 0) {
  //               return gradient; // Apply gradient to the first slice
  //             } else {
  //               return '#F5F5F5'; // Solid color for the second slice
  //             }
  //           },
  //           borderWidth: 0,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true, // Ensures the chart resizes with the window
  //       maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
  //       cutout: '80%',
  //       plugins: {
  //         tooltip: { enabled: false },
  //         legend: { display: false },
  //       },
  //     },
  //   });

  //   // Total Completed Issues Chart
  //   new Chart(this.totalCompletedProjectsChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [
  //             this.completedProjects,
  //             this.totalProjects - this.completedProjects,
  //           ],
  //           backgroundColor: function (context) {
  //             const chart = context.chart;
  //             const ctx = chart.ctx;
  //             const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  //             gradient.addColorStop(0, 'rgba(88,112,240,1)'); // Start color
  //             gradient.addColorStop(1, 'rgba(1,254,219,1)'); // End color
  //             if (context.dataIndex === 0) {
  //               return gradient; // Apply gradient to the first slice
  //             } else {
  //               return '#F5F5F5'; // Solid color for the second slice
  //             }
  //           },
  //           borderWidth: 0,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true, // Ensures the chart resizes with the window
  //       maintainAspectRatio: true, // Maintains the aspect ratio (default: true)
  //       cutout: '80%',
  //       plugins: {
  //         tooltip: { enabled: true },
  //         legend: { display: false },
  //       },
  //     },
  //   });

  //   // Total Issues in Progress Chart
  //   new Chart(this.projectsInProgressChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [
  //             this.projectsInProgress,
  //             this.totalProjects - this.projectsInProgress,
  //           ],
  //           backgroundColor: function (context) {
  //             const chart = context.chart;
  //             const ctx = chart.ctx;
  //             const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  //             gradient.addColorStop(0, 'rgba(193,32,230,1)'); // Start color
  //             gradient.addColorStop(1, 'rgba(91,110,239,1)'); // End color
  //             if (context.dataIndex === 0) {
  //               return gradient; // Apply gradient to the first slice
  //             } else {
  //               return '#F5F5F5'; // Solid color for the second slice
  //             }
  //           },
  //           borderWidth: 0,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true, // Ensures the chart resizes with the window
  //       maintainAspectRatio: true, // Maintains the aspect ratio (default: true)
  //       cutout: '80%',
  //       plugins: {
  //         tooltip: { enabled: false },
  //         legend: { display: false },
  //       },
  //     },
  //   });

  //   // Total Issues Overdue Chart
  //   new Chart(this.projectsOverdueChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [
  //             this.projectsOverdue,
  //             this.totalProjects - this.projectsOverdue,
  //           ],
  //           backgroundColor: function (context) {
  //             const chart = context.chart;
  //             const ctx = chart.ctx;
  //             const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  //             gradient.addColorStop(0, 'rgba(246,93,63,1)'); // Start color
  //             gradient.addColorStop(1, 'rgba(91,110,239,1)'); // End color
  //             if (context.dataIndex === 0) {
  //               return gradient; // Apply gradient to the first slice
  //             } else {
  //               return '#F5F5F5'; // Solid color for the second slice
  //             }
  //           },
  //           borderWidth: 0,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true, // Ensures the chart resizes with the window
  //       maintainAspectRatio: true, // Maintains the aspect ratio (default: true)
  //       cutout: '80%',
  //       plugins: {
  //         tooltip: { enabled: false },
  //         legend: { display: false },
  //       },
  //     },
  //   });
  // }
}
