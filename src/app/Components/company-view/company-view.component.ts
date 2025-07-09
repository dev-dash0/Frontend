import { Tenant, TenantResult } from './../../Core/interfaces/pinned';
import { SidebarService } from './../../Core/Services/sidebar.service';
import { CompanyService } from './../../Core/Services/company.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Company, Owner } from '../../Core/interfaces/company/company';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../deletemodal/deletemodal.component';
import { ProfileService } from '../../Core/Services/profile.service';
import { ProjectCategory } from '../../Core/interfaces/company/project-category';
import { ProjectService } from '../../Core/Services/project.service';
import { ProjectResult } from '../../Core/interfaces/project';
import { UpdateCompanyComponent } from '../update-company/update-company.component';
import { PinnedService } from '../../Core/Services/pinned.service';
import { ToastrService } from 'ngx-toastr';
import { AllCompanyProjectsDashboardComponent } from '../all-company-projects-dashboard/all-company-projects-dashboard.component';
import { Projectstats } from '../../Core/interfaces/company/projectstats';
import { DashboardLoaderComponent } from '../../Shared/dashboard-loader/dashboard-loader.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    AllCompanyProjectsDashboardComponent,
    DashboardLoaderComponent,
  ],
  templateUrl: './company-view.component.html',
  styleUrl: './company-view.component.css',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '700ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class CompanyViewComponent implements OnInit {
  @Input() company!: Company;
  @Output() companySelected = new EventEmitter<any>();
  @Output() projectSelected = new EventEmitter<number>();
  @Output() companyDeleted = new EventEmitter<void>();
  isOwner = false;
  userId!: any;
  showCompany = false;
  // variables
  constructor(
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService,
    private companyService: CompanyService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private profileService: ProfileService,
    private _PinnedService: PinnedService,
    private _toastr: ToastrService
  ) {}
  isSidebarCollapsed = true;
  Owner: Owner | null = null;
  CompanyId: number = 0;
  SelectedProjectId: number = 0;
  ProjectIds: number[] = [];
  hover: boolean = false;
  projectStats: Projectstats[] = [];
  ProjectCategories: ProjectCategory[] = [];
  projectsGlobalCounter: number = 0;
  loading = true;
  projectLoading = true;
  isPinned = false;
  // ----------------------------------------
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.sidebarService.companyUpdated$.subscribe(() => {
      this.getCompany();
    });
    this.route.paramMap.subscribe(() => {
      this.getCompany();
    });
  }

  selectCompany() {
    this.companySelected.emit(this.company.id);
    this.CompanyId = parseInt(this.CompanyId as unknown as string);
  }
  selectProject(projectId: any) {
    this.SelectedProjectId = parseInt(projectId);
    console.log('Selected Project ID:', this.SelectedProjectId);
    this.projectSelected.emit(this.SelectedProjectId); // Emit it
    this.router.navigate(['/MyDashboard/Project', projectId]);
  }

  contactInfo: any = [
    {
      icon: 'assets/images/Email.svg',
      label: 'Email',
      value: this.Owner?.email,
    },
    {
      icon: 'assets/images/LinkedIn.svg',
      label: 'LinkedIn',
      value: 'linkedin.com/in/johndoe',
    },
    {
      icon: 'assets/images/WhatsApp.svg',
      label: 'WhatsApp',
      value: this.Owner?.phoneNumber,
    },
  ];

  cardClasses = [
    'cardBottomRight',
    'cardBottomLeft',
    'cardTopRight',
    'cardTopLeft',
  ];

  projectStatus = [
    'inprogress-wrapper',
    'completed-wrapper',
    'overdue-wrapper',
    'planning-wrapper',
    'canceled-wrapper',
  ];

  spanStatus = [
    'inprogress-span',
    'completed-span',
    'overdue-span',
    'planning-span',
    'canceled-span',
  ];

  // get tenant data
  getCompany(): void {
    this.profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        const companyId = this.route.snapshot.paramMap.get('id');
        if (companyId) {
          this.companyService.getCompanyData(companyId).subscribe({
            next: (res) => {
              this.company = res.result;
              this.Owner = res.result.owner;
              this.CompanyId = res.result.id; // ✅ Set CompanyId here
              localStorage.setItem('CompanyId', this.CompanyId.toString());
              this.getProjectData(); // ✅ Fetch project data after setting ID
              // ✅ Update contactInfo after Owner is assigned
              this.contactInfo = [
                {
                  icon: 'assets/images/Email.svg',
                  label: 'Email',
                  value: this.Owner?.email || 'N/A', // ✅ Ensure it does not remain undefined
                },
                {
                  icon: 'assets/images/LinkedIn.svg',
                  label: 'LinkedIn',
                  value: 'linkedin.com/in/johndoe',
                },
                {
                  icon: 'assets/images/WhatsApp.svg',
                  label: 'WhatsApp',
                  value: this.Owner?.phoneNumber || 'N/A', // ✅ Handle missing values
                },
              ];

              // ✅ Trigger change detection (if needed)
              this.cdr.detectChanges();

              if (this.Owner?.id !== this.userId) {
                this.isOwner = false; // hide delete button
              } else {
                this.isOwner = true; // show delete button
              }
              this.showCompany = true;
              this.loading = false;
            },
            error: (err) => console.log('Error fetching company details:', err),
          });
        }
      },
    });
  }

  // copy function
  copied = { code: false, url: false };
  copyText(text: 'code' | 'url') {
    navigator.clipboard
      .writeText(
        text === 'code' ? this.company.tenantCode : this.company.tenantUrl
      )
      .then(() => {
        this.copied[text] = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.copied[text] = false;
          this.cdr.markForCheck();
        }, 2000);
      });
  }

  // wrappers
  getWrapperClass(status: string): string {
    switch (status) {
      case 'working on':
        return this.projectStatus[0];
      case 'completed':
        return this.projectStatus[1];
      case 'overdue':
        return this.projectStatus[2];
      case 'planning':
        return this.projectStatus[3];
      case 'canceled':
        return this.projectStatus[4];
      default:
        return '';
    }
  }
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'low-tag';
      case 'medium':
        return 'medium-tag';
      case 'high':
        return 'high-tag';
      case 'critical':
        return 'critical-tag';
      default:
        return '';
    }
  }
  getPriorityImage(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'assets/images/Issue Priorities/urgent.svg';
      case 'medium':
        return 'assets/images/Issue Priorities/high.svg';
      case 'low':
        return 'assets/images/Issue Priorities/low.svg';
      default:
        return 'assets/images/Issue Status/backlog.svg';
    }
  }
  getSpanStatus(status: string): string {
    switch (status) {
      case 'working on':
        return this.spanStatus[0];
      case 'completed':
        return this.spanStatus[1];
      case 'overdue':
        return this.spanStatus[2];
      case 'planning':
        return this.spanStatus[3];
      case 'canceled':
        return this.spanStatus[4];
      default:
        return '';
    }
  }

  // url validation
  isValidUrl(url: any): boolean {
    return !!(url && url !== 'string' && url.trim() !== '');
  }

  // modals
  delete() {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '40vh',
      maxHeight: '50vh',
      disableClose: true,
      data: { companyId: this.company.id }, // ✅ Pass company id to modal
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deleted') {
        console.log('Company deleted successfully');
        this.sidebarService.notifyCompanyDeleted();
        this.router.navigate(['/MyDashboard/allcompanies']);
      }
    });
  }
  update() {
    const dialogRef = this.dialog.open(UpdateCompanyComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw',
      minHeight: '60vh',
      maxHeight: '90vh',
      disableClose: true,
      data: { companyId: this.company.id }, // ✅ Pass company id to modal
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.sidebarService.notifyCompanyUpdated();
        console.log('Company updated successfully');
      }
    });
  }

  // get project data
  getProjectData() {
    this.projectService.getProjectData(this.CompanyId).subscribe({
      next: (res) => {
        console.log(res);
        let totalProjectsCounter = 0;
        let completedProjectsCounter = 0;
        let workingOnProjectsCounter = 0;
        let overdueProjectsCounter = 0;

        if (res.isSuccess && res.result) {
          totalProjectsCounter = res.result.length;
          this.projectsGlobalCounter = res.result.length;
          res.result.forEach((project: any) => {
            switch (project.status) {
              case 'Completed':
                completedProjectsCounter++;
                break;
              case 'Working on':
                workingOnProjectsCounter++;
                break;
              case 'Postponed':
                overdueProjectsCounter++;
                break;
            }
          });
        }

        console.log(this.ProjectIds);

        this.projectStats = [
          {
            title: 'Total Projects',
            count: totalProjectsCounter,
            class: 'total-projects',
          },
          {
            title: 'Completed Projects',
            count: completedProjectsCounter,
            class: 'completed-projects',
          },
          {
            title: 'Projects Working On',
            count: workingOnProjectsCounter,
            class: 'workingon-projects',
          },
          {
            title: 'Projects Overdue',
            count: overdueProjectsCounter,
            class: 'overdue-projects',
          },
        ];

        const projects: ProjectResult[] = res.result;
        const workingOnProjects = projects.filter(
          (p) => p.status === 'Working on'
        );
        const completedProjects = projects.filter(
          (p) => p.status === 'Completed'
        );
        const overdueProjects = projects.filter(
          (p) => p.status === 'Postponed'
        );
        const planningProjects = projects.filter(
          (p) => p.status === 'Planning'
        );
        const canceledProjects = projects.filter(
          (p) => p.status === 'Canceled'
        );

        this.ProjectCategories = [
          {
            name: 'In Progress',
            icon: 'assets/images/Issue Status/in-progress.svg',
            class: 'inprogress-tag',
            status: 'working on',
            projects: workingOnProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              priority: project.priority,
              members: this.getProjectMembers(project),
            })),
          },
          {
            name: 'Completed',
            icon: 'assets/images/Issue Status/Completed.svg',
            class: 'completed-tag',
            status: 'completed',
            projects: completedProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              priority: project.priority,
              members: this.getProjectMembers(project),
            })),
          },
          {
            name: 'Overdue',
            icon: 'assets/images/Issue Status/Important Time.svg',
            class: 'overdue-tag',
            status: 'overdue',
            projects: overdueProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              priority: project.priority,
              members: this.getProjectMembers(project),
            })),
          },
          {
            name: 'Planning',
            icon: 'assets/images/Issue Status/Important Time.svg',
            class: 'planning-tag',
            status: 'planning',
            projects: planningProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              priority: project.priority,
              members: this.getProjectMembers(project),
            })),
          },
          {
            name: 'Canceled',
            icon: 'assets/images/Issue Status/Important Time.svg',
            class: 'canceled-tag',
            status: 'canceled',
            projects: canceledProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              priority: project.priority,
              members: this.getProjectMembers(project),
            })),
          },
        ];
        this.projectLoading = false;
      },
      error: (err) => console.error('Error fetching project data:', err),
    });
  }
  getProjectMembers(project: any) {
    return project.userProjects.map((userProject: any) => {
      const user = project.tenant.joinedUsers.find(
        (u: any) => u.id === userProject.userId
      );
      return {
        ...user,
      };
    });
  }

  // pin tenant
  onPinTenant(event: MouseEvent) {
    event.stopPropagation(); // prevent triggering card animation click
    this._PinnedService.PinItem('Tenant', this.CompanyId).subscribe({
      next: (res) => {
        console.log('Pinned successfully:', res);
        this.showSuccess();
      },
      error: (err) => {
        console.error('Pinning failed:', err);
        this.showFail(err.error.message);
      },
    });
  }

  // show successful and failed pinned toastr
  showSuccess() {
    this._toastr.success('The Project has been Pinned', 'Pinned Successfully', {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  showFail(err: any) {
    this._toastr.error(err, 'Pinned Failed', {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
