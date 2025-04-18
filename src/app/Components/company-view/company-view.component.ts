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
import { Project, ProjectResult } from '../../Core/interfaces/project';
import { UpdateCompanyComponent } from '../update-company/update-company.component';

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './company-view.component.html',
  styleUrl: './company-view.component.css',
})
export class CompanyViewComponent implements OnInit {
  @Input() company!: Company;
  @Output() companySelected = new EventEmitter<any>();
  @Output() projectSelected = new EventEmitter<number>();
  @Output() companyDeleted = new EventEmitter<void>();
  isOwner = false;
  userId!: any;
  // variables
  constructor(
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService,
    private companyService: CompanyService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private _profile: ProfileService
  ) {}
  isSidebarCollapsed = true;
  Owner: Owner | null = null;
  CompanyId: number = 0;
  SelectedProjectId: number = 0;
  ProjectIds: number[] = [];

  // ----------------------------------------
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.route.paramMap.subscribe(() => {
      this.getCompany();
    });
  }

  selectCompany() {
    this.companySelected.emit(this.company.id);
    this.CompanyId = parseInt(this.CompanyId as unknown as string);
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

  projectStats = [
    { title: 'Total Projects', count: 10, class: 'total-projects' },
    { title: 'Completed Projects', count: 5, class: 'completed-projects' },
    { title: 'Projects In Progress', count: 3, class: 'projects-inprogress' },
    { title: 'Projects Overdue', count: 4, class: 'overdue-projects' },
  ];

  cardClasses = [
    'cardBottomRight',
    'cardBottomLeft',
    'cardTopRight',
    'cardTopLeft',
  ];

  ProjectCategories: ProjectCategory[] = [
    {
      name: 'In Progress',
      icon: 'assets/images/Issue Status/in-progress.svg',
      class: 'inprogress-tag',
      status: 'working on',
      issues: [
        {
          id: 0,
          title: 'Project 3',
          startDate: '5-3',
          dueDate: '5-16',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'backend',
        },
        {
          id: 1,
          title: 'Project 4',
          startDate: '5-3',
          dueDate: '5-16',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'frontend',
        },
      ],
    },
    {
      name: 'Completed',
      icon: 'assets/images/Issue Status/Completed.svg',
      class: 'completed-tag',
      status: 'completed',
      issues: [
        {
          id: 0,
          title: 'Project 5',
          startDate: '5-5',
          dueDate: '5-18',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'frontend',
        },
      ],
    },
    {
      name: 'Overdue',
      icon: 'assets/images/Issue Status/Important Time.svg',
      class: 'overdue-tag',
      status: 'overdue',
      issues: [
        {
          id: 0,
          title: 'Project 1',
          startDate: '5-1',
          dueDate: '5-12',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'web',
        },
        {
          id: 1,
          title: 'Project 2',
          startDate: '5-2',
          dueDate: '5-15',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'mobile',
        },
      ],
    },
    {
      name: 'Planning',
      icon: 'assets/images/Issue Status/Important Time.svg',
      class: 'canceled-tag',
      status: 'canceled',
      issues: [
        {
          id: 0,
          title: 'Project 1',
          startDate: '5-1',
          dueDate: '5-12',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'web',
        },
        {
          id: 1,
          title: 'Project 2',
          startDate: '5-2',
          dueDate: '5-15',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'mobile',
        },
      ],
    },
    {
      name: 'Canceled',
      icon: 'assets/images/Issue Status/Important Time.svg',
      class: 'canceled-tag',
      status: 'canceled',
      issues: [
        {
          id: 0,
          title: 'Project 1',
          startDate: '5-1',
          dueDate: '5-12',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'web',
        },
        {
          id: 1,
          title: 'Project 2',
          startDate: '5-2',
          dueDate: '5-15',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'mobile',
        },
      ],
    },
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
    this._profile.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        const companyId = this.route.snapshot.paramMap.get('id');
        if (companyId) {
          this.companyService.getCompanyData(companyId).subscribe({
            next: (res) => {
              // console.log(res);
              this.company = res.result;
              this.Owner = res.result.owner;
              // console.log(this.Owner);
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

              if (this.company.owner.id !== this.userId) {
                this.isOwner = false; // hide delete button
              } else {
                this.isOwner = true; // show delete button
              }
            },
            error: (err) =>
              console.error('Error fetching company details:', err),
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

  isValidUrl(url: any): boolean {
    return !!(url && url !== 'string' && url.trim() !== '');
  }

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

  selectProject(projectId: any) {
    this.SelectedProjectId = parseInt(projectId);
    console.log('Selected Project ID:', this.SelectedProjectId);
    this.projectSelected.emit(this.SelectedProjectId); // Emit it
    this.router.navigate(['/MyDashboard/Project', projectId]);
  }

  getProjectData() {
    this.projectService.getProjectData(this.CompanyId).subscribe({
      next: (res: Project) => {
        console.log(res);
        let totalProjectsCounter = 0;
        let completedProjectsCounter = 0;
        let workingOnProjectsCounter = 0;
        let overdueProjectsCounter = 0;

        if (res.isSuccess && res.result) {
          totalProjectsCounter = res.result.length;

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
            issues: workingOnProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              category: project.priority,
            })),
          },
          {
            name: 'Completed',
            icon: 'assets/images/Issue Status/Completed.svg',
            class: 'completed-tag',
            status: 'completed',
            issues: completedProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              category: project.priority,
            })),
          },
          {
            name: 'Overdue',
            icon: 'assets/images/Issue Status/Important Time.svg',
            class: 'overdue-tag',
            status: 'overdue',
            issues: overdueProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              category: project.priority,
            })),
          },
          {
            name: 'Planning',
            icon: 'assets/images/Issue Status/Important Time.svg',
            class: 'planning-tag',
            status: 'planning',
            issues: planningProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              category: project.priority,
            })),
          },
          {
            name: 'Canceled',
            icon: 'assets/images/Issue Status/Important Time.svg',
            class: 'canceled-tag',
            status: 'canceled',
            issues: canceledProjects.map((project) => ({
              id: project.id,
              title: project.name,
              startDate: project.startDate,
              dueDate: project.endDate,
              description: project.description,
              category: project.priority,
            })),
          },
        ];
      },
      error: (err) => console.error('Error fetching project data:', err),
    });
  }
}
