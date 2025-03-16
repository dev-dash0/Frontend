import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, inject, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';

Chart.register(...registerables)

@Component({
  selector: 'app-all-projects-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './all-projects-dashboard.component.html',
  styleUrl: './all-projects-dashboard.component.css'
})
export class AllProjectsDashboardComponent {

  completedProjects: any;
  projectsInProgress: any;
  totalProjects: any;
  projectsOverdue: any;

  private readonly _DashboardService = inject(DashboardService);

  @ViewChild('doughnutChart') doughnutChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalProjectsChart') totalProjectsChart!: ElementRef;
  @ViewChild('totalCompletedProjectsChart') totalCompletedProjectsChart!: ElementRef;
  @ViewChild('projectsInProgressChart') projectsInProgressChart!: ElementRef;
  @ViewChild('projectsOverdueChart') projectsOverdueChart!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.getTenantDashboard(8);

  }
  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      this.initLineChart();
      this.initDoughnutChart();
      this.initSmallCharts();
    }
  }

  getTenantDashboard(tenentId: number) {
    this._DashboardService.getDashboardData(tenentId).subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.completedProjects = res.result.completedProjects
          this.projectsInProgress = res.result.projectsInProgress
          this.totalProjects = res.result.totalProjects
          this.projectsOverdue = res.result.projectsOverdue

          this.initCharts();
        },
        error: (err) => {
          console.log(err);
          console.error(err);
        },
      }

    );

  }

  // ///////////////////////////////////////////////////////
  // ////////////////Charts Implementation///////////////
  initLineChart() {
    const ctx_line = this.lineChart.nativeElement.getContext('2d');
    const gradient_purple = ctx_line!.createLinearGradient(150, 350, 50, 150);
    gradient_purple.addColorStop(0, 'rgba(107, 98, 239, 1)');
    gradient_purple.addColorStop(0.5, 'rgba(186, 37, 230, 1)');
    gradient_purple.addColorStop(0.1, 'rgb(253, 141, 249)');
    gradient_purple.addColorStop(0.3, 'rgb(209, 84, 225)');
    gradient_purple.addColorStop(1, 'rgba(107, 98, 239, 1)');

    const gradient_blueSky = ctx_line!.createLinearGradient(150, 300, 0, 150);
    gradient_blueSky.addColorStop(0, 'rgba(78, 131, 237, 1)');
    gradient_blueSky.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
    gradient_blueSky.addColorStop(0.5, 'rgba(29, 246, 228,1)');
    gradient_blueSky.addColorStop(1, 'rgba(78, 131, 237, 1)');


    const lineChart = new Chart(ctx_line!,
      {

        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Completed Issues',
              data: [25, 28, 26, 29, 26, 28],
              borderColor: gradient_blueSky,
              borderWidth: 2.5,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: 'In Progress Issues',
              data: [27, 25.5, 27.4, 26, 26.6, 27],
              borderColor: gradient_purple,
              borderWidth: 2.5,
              fill: false,
              tension: 0.4,
              pointRadius: 0,
            }
          ]
        },
        options: {
          responsive: true, // Ensures the chart resizes with the window
          maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
              labels: {
                color: '#ffffff'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#71A5FF',
                padding: 30,
              },
              grid: { color: 'rgba(255, 255, 255, 0)' }
            },

            y: {
              ticks: {
                color: '#71A5FF',
                padding: 35,
                stepSize: 1,
                callback: function (value) {
                  // Only show specific values on the Y-axis
                  if ([25, 26, 27, 28, 29].includes(value as number)) {
                    return value;
                  }
                  return '';
                },

              },
              grid: { color: 'rgba(255,255,255,0.1)' },
              // min: 25,
              // max: 29
            }
          }
        }
      });
  }

  initDoughnutChart() {
    const ctx = this.doughnutChart.nativeElement.getContext('2d');


    const gradient_purple = ctx!.createRadialGradient(100, 350, 350, 150, 150, 50);
    gradient_purple.addColorStop(1, 'rgba(193, 32, 230, 1)');
    gradient_purple.addColorStop(0, 'rgba(91, 110, 239, 1)');

    const gradient_blueSky = ctx!.createRadialGradient(150, 150, 0, 150, 150, 150);
    gradient_blueSky.addColorStop(0, 'rgba(78, 131, 237, 1)');
    gradient_blueSky.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
    gradient_blueSky.addColorStop(0.5, 'rgba(29, 246, 228,1)');
    gradient_blueSky.addColorStop(1, 'rgba(78, 131, 237, 1)');

    const gradient_pink = ctx!.createRadialGradient(150, 150, 150, 150, 150, 50);
    gradient_pink.addColorStop(0, 'rgba(219, 131, 241, 1)');
    gradient_pink.addColorStop(1, 'rgb(249, 223, 255)');


    const doughnutChart = new Chart(ctx!,
      {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'In Progress', 'Overdue'],
          datasets: [{
            label: '# of Votes',
            data: [50, 30, 20],
            backgroundColor: [
              gradient_purple,
              gradient_blueSky,
              gradient_pink,
            ],
            borderColor: [
              gradient_purple,
              gradient_blueSky,
              gradient_pink,
            ],
            borderWidth: 1,
            borderRadius: 3.5,
          }],
        },
        options: {
          responsive: true, // Ensures the chart resizes with the window
          maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
          cutout: '55%',
          plugins: {
            legend: {
              display: false, // Optional: Hide legend
            },
          },
        }
      }
    )



  }

  initSmallCharts() {

    // Total Projects Chart
    new Chart(this.totalProjectsChart.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [10, 0], // Completed vs Remaining
            backgroundColor:
              function (context) {
                const chart = context.chart;
                const ctx = chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                gradient.addColorStop(0, 'rgba(113,165,255,1)');  // Start color
                gradient.addColorStop(1, 'rgba(19,71,163,1)');  // End color
                if (context.dataIndex === 0) {
                  return gradient;  // Apply gradient to the first slice
                } else {
                  return '#F5F5F5';  // Solid color for the second slice
                }

              }
            ,
            borderWidth: 0
          },
        ],
      },
      options: {
        responsive: true, // Ensures the chart resizes with the window
        maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });

    // Total Completed Issues Chart
    new Chart(this.totalCompletedProjectsChart.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.completedProjects, this.totalProjects],
            backgroundColor:
              function (context) {
                const chart = context.chart;
                const ctx = chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                gradient.addColorStop(0, 'rgba(88,112,240,1)');  // Start color
                gradient.addColorStop(1, 'rgba(1,254,219,1)');  // End color
                if (context.dataIndex === 0) {
                  return gradient;  // Apply gradient to the first slice
                } else {
                  return '#F5F5F5';  // Solid color for the second slice
                }
              }
            ,
            borderWidth: 0
          },
        ],
      },
      options: {
        responsive: true, // Ensures the chart resizes with the window
        maintainAspectRatio: true, // Maintains the aspect ratio (default: true)
        cutout: '80%',
        plugins: {
          tooltip: { enabled: true },
          legend: { display: false },
        },
      },
    });

    // Total Issues in Progress Chart
    new Chart(this.projectsInProgressChart.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.projectsInProgress, this.totalProjects],
            backgroundColor:
              function (context) {
                const chart = context.chart;
                const ctx = chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                gradient.addColorStop(0, 'rgba(193,32,230,1)');  // Start color
                gradient.addColorStop(1, 'rgba(91,110,239,1)');  // End color
                if (context.dataIndex === 0) {
                  return gradient;  // Apply gradient to the first slice
                } else {
                  return '#F5F5F5';  // Solid color for the second slice
                }

              }
            ,
            borderWidth: 0,

          },
        ],
      },
      options: {
        responsive: true, // Ensures the chart resizes with the window
        maintainAspectRatio: true, // Maintains the aspect ratio (default: true)
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });

    // Total Issues Overdue Chart
    new Chart(this.projectsOverdueChart.nativeElement.getContext('2d'), {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.projectsOverdue, this.totalProjects],
            backgroundColor:
              function (context) {
                const chart = context.chart;
                const ctx = chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
                gradient.addColorStop(0, 'rgba(246,93,63,1)');  // Start color
                gradient.addColorStop(1, 'rgba(91,110,239,1)');  // End color
                if (context.dataIndex === 0) {
                  return gradient;  // Apply gradient to the first slice
                } else {
                  return '#F5F5F5';  // Solid color for the second slice
                }

              },
            borderWidth: 0
          },
        ],
      },
      options: {
        responsive: true, // Ensures the chart resizes with the window
        maintainAspectRatio: true, // Maintains the aspect ratio (default: true)
        cutout: '80%',
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false },
        },
      },
    });

  }


}
