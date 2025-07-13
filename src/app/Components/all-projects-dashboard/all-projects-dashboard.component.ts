import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  Inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { ChartLoaderComponent } from "../../Shared/chart-loader/chart-loader.component";

Chart.register(...registerables);
type IssueStatus =
  | 'Completed'
  | 'In Progress'
  | 'Reviewing'
  | 'to do'
  | 'Postponed'
  | 'Canceled'
  | 'BackLog';

  const statusGradientsMap: Record<IssueStatus, (ctx: CanvasRenderingContext2D) => CanvasGradient> = {
    'Completed': (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 150, 150);
      g.addColorStop(0, '#62efbe');
      g.addColorStop(1, '#0eeab3');
      return g;
    },
    'In Progress': (ctx) => {
      const g = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
      g.addColorStop(0, '#c120e6');
      g.addColorStop(1, '#5b6eef');
      return g;
    },
    'Reviewing': (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 150, 150);
      g.addColorStop(0, '#f7b733');
      g.addColorStop(1, '#fc4a1a');
      return g;
    },
    'to do': (ctx) => {
      const g = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
      g.addColorStop(0, '#36d1dc');
      g.addColorStop(1, '#5b86e5');
      return g;
    },
    'Postponed': (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 150, 150);
      g.addColorStop(0, '#ffb75e');
      g.addColorStop(1, '#ed8f03');
      return g;
    },
    'Canceled': (ctx) => {
      const g = ctx.createRadialGradient(150, 150, 150, 150, 150, 50);
      // g.addColorStop(0, '#db83f1');
      // g.addColorStop(1, '#f9dfff');
      g.addColorStop(0, '#fd8479');
      g.addColorStop(1, '#f3999a');
      return g;
    },
    'BackLog': (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 150, 150);
      g.addColorStop(0, '#616161');
      g.addColorStop(1, '#9bc5c3');
      return g;
    },
  };
  


  type ProjectStatus =
  | 'Completed'
  | 'Working on'
  | 'Postponed'
  | 'Canceled'
  | 'Planning';

const projectStatusGradientMap: Record<ProjectStatus, (ctx: CanvasRenderingContext2D) => CanvasGradient> = {
  'Completed': (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 150, 150);
    g.addColorStop(0, '#62efbe');
    g.addColorStop(1, '#0eeab3');
    return g;
  },
  'Working on': (ctx) => {
    const g = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
    g.addColorStop(0, '#c120e6');
    g.addColorStop(1, '#5b6eef');
    return g;
  },
  'Postponed': (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 150, 150);
    g.addColorStop(0, '#ffb75e');
    g.addColorStop(1, '#ed8f03');
    return g;
  },
  'Canceled': (ctx) => {
    const g = ctx.createRadialGradient(150, 150, 150, 150, 150, 50);
    // g.addColorStop(0, '#db83f1');
    // g.addColorStop(1, '#f9dfff');
    g.addColorStop(0, '#fd8479');
    g.addColorStop(1, '#f3999a');
    return g;
  },
  'Planning': (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 150, 150);
    g.addColorStop(0, '#36d1dc');
    g.addColorStop(1, '#5b86e5');
    return g;
  },
};


@Component({
  selector: 'app-all-projects-dashboard',
  standalone: true,
  imports: [ChartLoaderComponent, CommonModule],
  templateUrl: './all-projects-dashboard.component.html',
  styleUrl: './all-projects-dashboard.component.css',
})
export class AllProjectsDashboardComponent implements OnInit, OnChanges {
  completedProjects: any;
  projectsInProgress: any;
  totalProjects: any;
  projectsPostponed: any;
  projectsCanceled:any;
  projectPlanning:any;
  isLoading: boolean = true;
  AllIssuesList:any[]=[]
  currentTenantName:string='';
  lineChartInstance: Chart | null = null;
  doughnutChartInstance: Chart<"doughnut", number[], string> | null = null;




  private readonly _DashboardService = inject(DashboardService);

  @Input() tenantId!: number;
  @Input() tenantName!: string;
  

  @ViewChild('doughnutChart') doughnutChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalProjectsChart') totalProjectsChart!: ElementRef;
  @ViewChild('totalCompletedProjectsChart') totalCompletedProjectsChart!: ElementRef;
  @ViewChild('projectsInProgressChart') projectsInProgressChart!: ElementRef;
  @ViewChild('projectsOverdueChart') projectsOverdueChart!: ElementRef;
  @ViewChild('projectsCanceledChart') projectsCanceledChart!: ElementRef;
  @ViewChild('projectPlanningChart') projectPlanningChart!: ElementRef;
  

  ngOnInit(): void {
    console.log('AllProjectsDashboardComponent initialized');
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenantId'] && this.tenantId) {
      this.getTenantDashboard(this.tenantId);
      this.getDashboardAllIssue();
    }
  }
  

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  initCharts() {
    if (isPlatformBrowser(this.platformId)) {
      this.initLineChart();
      // this.initDoughnutChart();
      this.initSmallCharts();
      this.initCompanyStatusChart();
    }
  }

  getTenantDashboard(tenantId: number) {
    this._DashboardService.getDashboardData(tenantId).subscribe({
      next: (res) => {
        console.log('Tenant Dashboard Data',res);
        this.totalProjects = res.result.totalProjects;
        this.completedProjects = res.result.completedProjects;
        this.projectsInProgress = res.result.projectsInProgress; // or projectWorkingon
        this.projectsPostponed = res.result.projectsPostponed;
        this.projectsCanceled = res.result.projectsCanceled;
        this.projectPlanning=res.result.projectPlanning;

        this.isLoading = false;
        // this.initCharts();
        setTimeout(() => {
          this.initCharts();
        }, 0);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
    });
  }

  // ///////////////////////////////////////////////////////
  // ////////////////Charts Implementation///////////////
  // initLineChart() {
  //   const ctx_line = this.lineChart.nativeElement.getContext('2d');
  //   const gradient_purple = ctx_line!.createLinearGradient(150, 350, 50, 150);
  //   gradient_purple.addColorStop(0, 'rgba(107, 98, 239, 1)');
  //   gradient_purple.addColorStop(0.5, 'rgba(186, 37, 230, 1)');
  //   gradient_purple.addColorStop(0.1, 'rgb(253, 141, 249)');
  //   gradient_purple.addColorStop(0.3, 'rgb(209, 84, 225)');
  //   gradient_purple.addColorStop(1, 'rgba(107, 98, 239, 1)');

  //   const gradient_blueSky = ctx_line!.createLinearGradient(150, 300, 0, 150);
  //   gradient_blueSky.addColorStop(0, 'rgba(78, 131, 237, 1)');
  //   gradient_blueSky.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
  //   gradient_blueSky.addColorStop(0.5, 'rgba(29, 246, 228,1)');
  //   gradient_blueSky.addColorStop(1, 'rgba(78, 131, 237, 1)');

  //   const lineChart = new Chart(ctx_line!, {
  //     type: 'line',
  //     data: {
  //       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //       datasets: [
  //         {
  //           label: 'Completed Issues',
  //           data: [25, 28, 26, 29, 26, 28],
  //           borderColor: gradient_blueSky,
  //           borderWidth: 2.5,
  //           fill: false,
  //           tension: 0.4,
  //           pointRadius: 0,
  //         },
  //         {
  //           label: 'In Progress Issues',
  //           data: [27, 25.5, 27.4, 26, 26.6, 27],
  //           borderColor: gradient_purple,
  //           borderWidth: 2.5,
  //           fill: false,
  //           tension: 0.4,
  //           pointRadius: 0,
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: true, // Ensures the chart resizes with the window
  //       maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
  //       plugins: {
  //         legend: {
  //           display: false,
  //           position: 'bottom',
  //           labels: {
  //             color: '#ffffff',
  //           },
  //         },
  //       },
  //       scales: {
  //         x: {
  //           ticks: {
  //             color: '#71A5FF',
  //             padding: 30,
  //           },
  //           grid: { color: 'rgba(255, 255, 255, 0)' },
  //         },

  //         y: {
  //           ticks: {
  //             color: '#71A5FF',
  //             padding: 35,
  //             stepSize: 1,
  //             callback: function (value) {
  //               // Only show specific values on the Y-axis
  //               if ([25, 26, 27, 28, 29].includes(value as number)) {
  //                 return value;
  //               }
  //               return '';
  //             },
  //           },
  //           grid: { color: 'rgba(255,255,255,0.1)' },
  //           // min: 25,
  //           // max: 29
  //         },
  //       },
  //     },
  //   });
  // }

  // initDoughnutChart() {
  //   const ctx = this.doughnutChart.nativeElement.getContext('2d');
  //   const allZero = this.completedProjects === 0 && this.projectsInProgress === 0 && this.projectsOverdue === 0;

  //   const gradient_purple = ctx!.createRadialGradient(
  //     100,
  //     350,
  //     350,
  //     150,
  //     150,
  //     50
  //   );
  //   gradient_purple.addColorStop(1, 'rgba(193, 32, 230, 1)');
  //   gradient_purple.addColorStop(0, 'rgba(91, 110, 239, 1)');

  //   const gradient_blueSky = ctx!.createRadialGradient(
  //     150,
  //     150,
  //     0,
  //     150,
  //     150,
  //     150
  //   );
  //   gradient_blueSky.addColorStop(0, 'rgba(78, 131, 237, 1)');
  //   gradient_blueSky.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
  //   gradient_blueSky.addColorStop(0.5, 'rgba(29, 246, 228,1)');
  //   gradient_blueSky.addColorStop(1, 'rgba(78, 131, 237, 1)');

  //   const gradient_pink = ctx!.createRadialGradient(
  //     150,
  //     150,
  //     150,
  //     150,
  //     150,
  //     50
  //   );
  //   gradient_pink.addColorStop(0, 'rgba(219, 131, 241, 1)');
  //   gradient_pink.addColorStop(1, 'rgb(249, 223, 255)');

  //   // const gradientOverdue = ctx!.createRadialGradient(150, 150, 50, 150, 150, 150);
  //   // gradientOverdue.addColorStop(0, 'rgba(246,93,63,1)');
  //   // gradientOverdue.addColorStop(1, 'rgba(91,110,239,1)');
    
    
  //   const doughnutChart = allZero
  //     ? new Chart(ctx!, {
  //       type: 'doughnut',
  //       data: {
  //         labels: ['No Data'],
  //         datasets: [{
  //           data: [1], // value 1 just to render
  //           backgroundColor: ['#0C1E3D'], // gray color
  //           borderColor: [gradient_purple, gradient_blueSky, gradient_pink],
  //           borderWidth: 1,
  //           borderRadius: 3.5,
  //         }]
  //       },
  //       options: {
  //         responsive: true, // Ensures the chart resizes with the window
  //         maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
  //         cutout: '55%',
  //         plugins: {
  //           legend: {
  //             display: true, // Optional: Hide legend
  //             position: 'bottom', // Set legend position to bottom
  //             labels: {
  //               padding: 35, // Optional: Add some spacing
  //               color: '#7d92ca', // Optional: Set text color
  //               font: {
  //                 size: 10, // Reduce the font size
  //               },
  //               boxWidth: 10, // Reduce the size of color indicator boxes
  //             },
  //           },
  //         },
  //       },
  //     })
  //     : new Chart(ctx!, {
  //       type: 'doughnut',
  //       data: {
  //         labels: ['Completed Projects', 'In Progress Projects', 'Overdue Projects'],
  //         datasets: [
  //           {
  //             label: '# of Votes',
  //             // data: [50, 30, 20],
  //             data: [
  //               this.completedProjects,
  //               this.projectsInProgress,
  //               this.projectsOverdue,
  //             ],
  //             backgroundColor: [gradient_purple, gradient_blueSky, gradient_pink],
  //             borderColor: [gradient_purple, gradient_blueSky, gradient_pink],
  //             borderWidth: 1,
  //             borderRadius: 3.5,
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true, // Ensures the chart resizes with the window
  //         maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
  //         cutout: '55%',
  //         plugins: {
  //           legend: {
  //             display: true, // Optional: Hide legend
  //             position: 'bottom', // Set legend position to bottom
  //             labels: {
  //               padding: 35, // Optional: Add some spacing
  //               color: '#7d92ca', // Optional: Set text color
  //               font: {
  //                 size: 10, // Reduce the font size
  //               },
  //               boxWidth: 10, // Reduce the size of color indicator boxes
  //             },
  //           },
  //         },
  //       },
  //     });
  // }


  initLineChart() {
    const ctx = this.lineChart.nativeElement.getContext('2d');
  
    // 🧹Remove the existing chart 
    if (this.lineChartInstance) {
      this.lineChartInstance.destroy();
    }
  
    const { months, data } = this.getMonthlyStatusCounts(this.tenantName);
  
    const gradientCompleted = ctx!.createLinearGradient(150, 350, 50, 150);
      gradientCompleted.addColorStop(0, 'rgb(98, 239, 190)');
      gradientCompleted.addColorStop(0.5, 'rgb(25, 175, 120)');
      gradientCompleted.addColorStop(0.1, 'rgb(253, 141, 249)');
      gradientCompleted.addColorStop(0.3, 'rgb(209, 84, 225)');
      gradientCompleted.addColorStop(1, 'rgb(14, 234, 179)');
      
      const gradientInProgress = ctx!.createRadialGradient(
        150,
        150,
        0,
        150,
        150,
        150
      );
      gradientInProgress.addColorStop(0, 'rgba(78, 131, 237, 1)');
      gradientInProgress.addColorStop(0.1, 'rgba(153, 83, 207, 0.54)');
      gradientInProgress.addColorStop(0.5, 'rgb(181, 94, 236)');
      gradientInProgress.addColorStop(1, 'rgba(78, 131, 237, 1)');
  
   //create the chart and add the data
    this.lineChartInstance = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Completed Issues',
            data: data['Completed'],
            borderColor: '#0EEADE',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0.5,
            pointBackgroundColor: '#66bb6a',
            segment: {
              borderColor: ctx => gradientCompleted 
            }
          },
          {
            label: 'In Progress Issues',
            data: data['In Progress'],
            borderColor: gradientInProgress,
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0.5,
            pointBackgroundColor: '#9575cd',
                  segment: {
              borderColor: ctx => gradientInProgress 
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#71A5FF'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.02)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#71A5FF'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.01)'
            }
          }
        }
      }
    });
  }
  
  // initCompanyStatusChart() {
  //   const ctx = this.doughnutChart.nativeElement.getContext('2d');
  
  //   if (this.doughnutChartInstance) this.doughnutChartInstance.destroy();

  //   const issues = this.AllIssuesList.filter(issue => issue.tenantName === this.tenantName);
  
  //   const statuses: IssueStatus[] = ['Completed', 'In Progress', 'Reviewing', 'to do', 'Postponed', 'Canceled', 'BackLog'];
  //   const statusCounts: Record<IssueStatus, number> = {
  //     'Completed': 0,
  //     'In Progress': 0,
  //     'Reviewing': 0,
  //     'to do': 0,
  //     'Postponed': 0,
  //     'Canceled': 0,
  //     'BackLog': 0
  //   };
  
  //   issues.forEach(issue => {
  //     const status = issue.status;
    
  //     if ((statuses as string[]).includes(status)) {
  //       statusCounts[status as IssueStatus]++;
  //     }
  //   });
    
  
  //   const labels = Object.keys(statusCounts) as IssueStatus[];
  //   const data = Object.values(statusCounts);
  
  //   const allZero = data.every(count => count === 0);
  
  //   // gradients
  //   const gradients: Record<IssueStatus, CanvasGradient> = {
  //     'Completed': (() => {
  //       const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       g.addColorStop(0, 'rgb(98, 239, 190)');
  //       g.addColorStop(1, 'rgb(14, 234, 179)');
  //       return g;
  //     })(),
  //     'In Progress': (() => {
  //       // const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       // g.addColorStop(0, 'rgba(78, 131, 237, 1)');
  //       // g.addColorStop(1, 'rgb(181, 94, 236)');
  //       // return g;
  //       const g =  ctx!.createRadialGradient(
  //             100,
  //             350,
  //             350,
  //             150,
  //             150,
  //             50
  //           );
  //           g.addColorStop(1, 'rgba(193, 32, 230, 1)');
  //           g.addColorStop(0, 'rgba(91, 110, 239, 1)');
  //       return g;
  //     })(),
  //     'Reviewing': (() => {
  //       const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       g.addColorStop(0, '#f7b733');
  //       g.addColorStop(1, '#fc4a1a');
  //       return g;
  //     })(),
  //     'to do': (() => {
  //       // const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       // g.addColorStop(0, '#36D1DC');
  //       // g.addColorStop(1, '#5B86E5');
  //       // return g;
  //       const g = ctx!.createRadialGradient(
  //             150,
  //             150,
  //             0,
  //             150,
  //             150,
  //             150
  //           );
  //           g.addColorStop(0, 'rgba(78, 131, 237, 1)');
  //           g.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
  //           g.addColorStop(0.5, 'rgba(29, 246, 228,1)');
  //           g.addColorStop(1, 'rgba(78, 131, 237, 1)');
  //       return g;
  //     })(),
  //     'Postponed': (() => {
  //       const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       g.addColorStop(0, '#FFB75E');
  //       g.addColorStop(1, '#ED8F03');
  //       return g;
  //     })(),
      
  //     'Canceled': (() => {
  //       // const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       // g.addColorStop(0, '#ff5858');
  //       // g.addColorStop(1, '#f857a6');
  //       // return g;
  //       const g = ctx!.createRadialGradient(
  //             150,
  //             150,
  //             150,
  //             150,
  //             150,
  //             50
  //           );;
  //        g.addColorStop(0, 'rgba(219, 131, 241, 1)');
  //     g.addColorStop(1, 'rgb(249, 223, 255)');
  //       return g;
  //     })(),
  //     'BackLog': (() => {
  //       const g = ctx!.createLinearGradient(0, 0, 150, 150);
  //       g.addColorStop(0, '#616161');
  //       g.addColorStop(1, '#9bc5c3');
  //       return g;
  //     })()
  //   };
  
  //       const gradient_purple = ctx!.createRadialGradient(
  //       100,
  //       350,
  //       350,
  //       150,
  //       150,
  //       50
  //     );
  //     gradient_purple.addColorStop(1, 'rgba(193, 32, 230, 1)');
  //     gradient_purple.addColorStop(0, 'rgba(91, 110, 239, 1)');
  
  //     const gradient_blueSky = ctx!.createRadialGradient(
  //       150,
  //       150,
  //       0,
  //       150,
  //       150,
  //       150
  //     );
  //     gradient_blueSky.addColorStop(0, 'rgba(78, 131, 237, 1)');
  //     gradient_blueSky.addColorStop(0.1, 'rgba(9, 240, 222, 1)');
  //     gradient_blueSky.addColorStop(0.5, 'rgba(29, 246, 228,1)');
  //     gradient_blueSky.addColorStop(1, 'rgba(78, 131, 237, 1)');
  
  //     const gradient_pink = ctx!.createRadialGradient(
  //       150,
  //       150,
  //       150,
  //       150,
  //       150,
  //       50
  //     );
  //     gradient_pink.addColorStop(0, 'rgba(219, 131, 241, 1)');
  //     gradient_pink.addColorStop(1, 'rgb(249, 223, 255)');
  
    
  //   const backgroundColors = labels.map(label => gradients[label]);
  
  //   this.doughnutChartInstance = new Chart(ctx!, {
  //     type: 'doughnut',
  //     data: {
  //       labels: allZero ? ['No Data'] : labels,
  //       datasets: [
  //         {
  //           label: 'Issue Status Breakdown',
  //           data: allZero ? [1] : data,
  //           backgroundColor: allZero ? ['#0C1E3D'] : backgroundColors,
  //           borderColor: allZero ? [gradient_purple, gradient_blueSky, gradient_pink] : backgroundColors,
  //           borderWidth: 1,
  //           borderRadius: 3.5,
  
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       maintainAspectRatio: false,
  //       cutout: '55%',
  //       plugins: {
  //         legend: {
  //           display: true,
  //           position: 'bottom',
  //           labels: {
  //             color: '#7d92ca',
  //             font: {
  //               size: 10
  //             },
  //             boxWidth: 10
  //           }
  //         },
  //         tooltip: {
  //           callbacks: {
  //             label: function (context) {
  //               return allZero
  //                 ? 'No Data'
  //                 : `${context.label +' ' +' Issues'}: ${context.raw }`;
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  // }
  initCompanyStatusChart() {
    const ctx = this.doughnutChart.nativeElement.getContext('2d');


  
    if (this.doughnutChartInstance) this.doughnutChartInstance.destroy();
  
    const issues = this.AllIssuesList.filter(issue => issue.tenantName === this.tenantName);
  
    const statuses: IssueStatus[] = ['Completed', 'In Progress', 'Reviewing', 'to do', 'Postponed', 'Canceled', 'BackLog'];

    const gradients: Record<IssueStatus, CanvasGradient> = {} as any;
    statuses.forEach(status => {
      gradients[status] = statusGradientsMap[status](ctx!);
    });
    
    const statusCounts: Record<IssueStatus, number> = {
      'Completed': 0,
      'In Progress': 0,
      'Reviewing': 0,
      'to do': 0,
      'Postponed': 0,
      'Canceled': 0,
      'BackLog': 0
    };
  
    issues.forEach(issue => {
      const status = issue.status;
      if ((statuses as string[]).includes(status)) {
        statusCounts[status as IssueStatus]++;
      }
    });
  
    const labels = Object.keys(statusCounts) as IssueStatus[];
    const data = Object.values(statusCounts);
    const allZero = data.every(count => count === 0);
  
    const backgroundColors = labels.map(label => gradients[label]);

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
      
  
    this.doughnutChartInstance = new Chart(ctx!, {
      type: 'doughnut',
      data: {
        labels: allZero ? ['No Data'] : labels,
        datasets: [
          {
            label: 'Issue Status Breakdown',
            data: allZero ? [1] : data,
            backgroundColor: allZero ? ['#0C1E3D'] : backgroundColors,
            borderColor: allZero ?[gradient_purple, gradient_blueSky, gradient_pink]: backgroundColors  ,
            borderWidth: 1,
            borderRadius: 3.5,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#7d92ca',
              font: { size: 10 },
              boxWidth: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return allZero ? 'No Data' : `${context.label} Issues: ${context.raw}`;
              }
            }
          }
        }
      }
    });
  }


  // initSmallCharts() {
  //   const zeroTotalProjects = this.totalProjects === 0;

  //   // Total Projects Chart
  //   const totalProjects = zeroTotalProjects ?
  //     new Chart(this.totalProjectsChart.nativeElement.getContext('2d'), {
  //       type: 'doughnut',
  //       data: {
  //         datasets: [
  //           {
  //             data: [0, 0], // Completed vs Remaining
  //             backgroundColor: function (context) {
  //               const chart = context.chart;
  //               const ctx = chart.ctx;
  //               const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  //               gradient.addColorStop(0, 'rgba(113,165,255,1)'); // Start color
  //               gradient.addColorStop(1, 'rgba(19,71,163,1)'); // End color
  //               if (context.dataIndex === 0) {
  //                 return gradient; // Apply gradient to the first slice
  //               } else {
  //                 return '#F5F5F5'; // Solid color for the second slice
  //               }
  //             },
  //             borderWidth: 0,
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true, // Ensures the chart resizes with the window
  //         maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
  //         cutout: '80%',
  //         plugins: {
  //           tooltip: { enabled: false },
  //           legend: { display: false },
  //         },
  //       },
  //     })
  //     : new Chart(this.totalProjectsChart.nativeElement.getContext('2d'), {
  //       type: 'doughnut',
  //       data: {
  //         datasets: [
  //           {
  //             data: [10, 0], // Completed vs Remaining
  //             backgroundColor: function (context) {
  //               const chart = context.chart;
  //               const ctx = chart.ctx;
  //               const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
  //               gradient.addColorStop(0, 'rgba(113,165,255,1)'); // Start color
  //               gradient.addColorStop(1, 'rgba(19,71,163,1)'); // End color
  //               if (context.dataIndex === 0) {
  //                 return gradient; // Apply gradient to the first slice
  //               } else {
  //                 return '#F5F5F5'; // Solid color for the second slice
  //               }
  //             },
  //             borderWidth: 0,
  //           },
  //         ],
  //       },
  //       options: {
  //         responsive: true, // Ensures the chart resizes with the window
  //         maintainAspectRatio: false, // Maintains the aspect ratio (default: true)
  //         cutout: '80%',
  //         plugins: {
  //           tooltip: { enabled: false },
  //           legend: { display: false },
  //         },
  //       },
  //     });

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

  //   // Total Projects in Progress Chart
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

  //   // Total Projects Postponed Chart
  //   new Chart(this.projectsCanceledChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [
  //             this.projectsPostponed,
  //             this.totalProjects - this.projectsPostponed,
  //           ],
  //           backgroundColor: function (context) {
  //             const chart = context.chart;
  //             const ctx = chart.ctx;
  //             const gradient = ctx!.createRadialGradient(
  //               150,
  //               150,
  //               150,
  //               150,
  //               150,
  //               50
  //             );;
  //             gradient.addColorStop(0, 'rgba(219, 131, 241, 1)');
  //             gradient.addColorStop(1, 'rgb(249, 223, 255)');
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
  //   // Total Projects Canceled Chart
  //   new Chart(this.projectsOverdueChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [
  //             this.projectsPostponed,
  //             this.totalProjects - this.projectsPostponed,
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
  //   // Total Projects Planning Chart
  //   new Chart(this.projectPlanningChart.nativeElement.getContext('2d'), {
  //     type: 'doughnut',
  //     data: {
  //       datasets: [
  //         {
  //           data: [
  //             this.projectPlanning,
  //             this.totalProjects - this.projectPlanning,
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

  //////////////////////////////////////////////////////////////////
  initSmallCharts() {
    const zeroTotalProjects = this.totalProjects === 0;
  
    const getGradient = (ctx: CanvasRenderingContext2D, status: ProjectStatus) =>
      projectStatusGradientMap[status](ctx);
  
    const charts = [
      {
        ref: this.totalCompletedProjectsChart,
        value: this.completedProjects,
        status: 'Completed' as ProjectStatus,
      },
      {
        ref: this.projectsInProgressChart,
        value: this.projectsInProgress,
        status: 'Working on' as ProjectStatus,
      },
      {
        ref: this.projectsOverdueChart,
        value: this.projectsPostponed,
        status: 'Postponed' as ProjectStatus,
      },
      {
        ref: this.projectsCanceledChart,
        value: this.projectsCanceled,
        status: 'Canceled' as ProjectStatus,
      },
      {
        ref: this.projectPlanningChart,
        value: this.projectPlanning,
        status: 'Planning' as ProjectStatus,
      }
    ];
  
    // 🟦 Total Projects Chart (unique static gradient)
    const ctxTotal = this.totalProjectsChart.nativeElement.getContext('2d');
    const defaultGradient = ctxTotal!.createLinearGradient(0, 0, 0, ctxTotal.canvas.height);
    defaultGradient.addColorStop(0, 'rgba(113,165,255,1)');
    defaultGradient.addColorStop(1, 'rgba(19,71,163,1)');
  
    new Chart(ctxTotal!, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.totalProjects, 0],
            backgroundColor: (context) =>
              context.dataIndex === 0 ? defaultGradient : '#cfdcffed',
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
  
    // 🟩 Other status-based charts
    charts.forEach(({ ref, value, status }) => {
      const ctx = ref.nativeElement.getContext('2d');
      const gradient = getGradient(ctx!, status);
  
      new Chart(ctx!, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [value, this.totalProjects - value],
              backgroundColor: (context) =>
                context.dataIndex === 0 ? gradient : '#cfdcffed',
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          cutout: '80%',
          plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
          },
        },
      });
    });
  }
  
getMonthlyStatusCounts(tenantName: string) {
  const issues = this.AllIssuesList.filter(issue => issue.tenantName === this.tenantName);
  // console.log('📊 Current Tenant:', this.tenantName);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const statuses = ['Completed', 'In Progress','Reviewing' ,'to do' ,'Postponed','Canceled','BackLog'];

  // Initialize the data object with empty arrays for each month and status

  const data: { [status: string]: number[] } = {};

  statuses.forEach(status => {
    data[status] = new Array(12).fill(0);
  });

  issues.forEach(issue => {
    if (!statuses.includes(issue.status)) return;

    const date = new Date(issue.deadline || issue.creationDate || new Date());
    const monthIndex = date.getMonth();

    if (data[issue.status]) {
      data[issue.status][monthIndex]++;
    }
  });

  return { months, data };
}
getDashboardAllIssue() {
  this._DashboardService.getDashboardAllIssue().subscribe({
    next: (res) => {
      this.AllIssuesList = res.result || []; // array of issues

      // console.log(' Loaded Issues:', this.AllIssuesList);
      //  Get tenantName from first issue
      if (this.AllIssuesList.length > 0) {
        // console.log(' Tenant:', this.currentTenantName);

        //  Wait for chart element to be available
        setTimeout(() => {
          if (this.lineChart?.nativeElement) {
            this.initLineChart();
          } else {
            console.warn("⚠️lineChart not ready yet.");
          }
          if (this.doughnutChart?.nativeElement) this.initCompanyStatusChart();
        }, 0);
      } else {
        console.warn('🚫 No issues found.');
      }
    },
    error: (err) => {
      console.error(err);
    }
  });
}






  
}
