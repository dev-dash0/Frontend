import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../Core/Services/dialog.service';
import { Company } from '../../Core/interfaces/company/company';
import { CompanyService } from '../../Core/Services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCompanyModalComponent } from '../../Components/company-modal/company-modal.component';
import { ProjectService } from '../../Core/Services/project.service';
import { Project, ProjectResult } from '../../Core/interfaces/project';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  dropdownStates: { [key: string]: boolean } = {};
  constructor(
    private sidebarService: SidebarService,
    private dialogService: DialogService,
    private _companyService: CompanyService,
    private _ProjectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  companyData: Company[] = [];
  companyNames: { id: string; name: string }[] = [];
  projectsNames: { id: string; name: string }[] = [];
  SelectedCompanyId: number = 0;
  projects: ProjectResult[] = [];
  // ---------------------------------------
  mainServices = [
    {
      imagePath: 'assets/images/sidebar icons/Dashboard Layout.svg',
      path: '/MyDashboard/Dashboard',
      title: 'Dashboard',
    },
    {
      imagePath: 'assets/images/sidebar icons/Pin.svg',
      path: '/MyDashboard/Pinned',
      title: 'Pinned',
    },
    {
      imagePath: 'assets/images/sidebar icons/Group of Projects.svg',
      path: '/MyDashboard/allProjects',
      title: 'Projects',
    },
    {
      imagePath: 'assets/images/sidebar icons/Checklist.svg',
      path: '',
      title: 'Issues',
    },
  ];
  // -----------------------------------------
  otherServices = [
    {
      imagePath: 'assets/images/sidebar icons/Plus.svg',
      path: '',
      text: 'Integrations',
    },
    {
      imagePath: 'assets/images/sidebar icons/Add User Male.svg',
      path: '',
      text: 'Invite',
    },
    {
      imagePath: 'assets/images/sidebar icons/Help.svg',
      path: '',
      text: 'Help',
    },
  ];
  // ------------------------------------------
  collapsedIcons = [
    {
      path: '/MyDashboard/Dashboard',
      imagePath: 'assets/images/sidebar icons/Dashboard Layout.svg',
    },
    {
      path: '',
      imagePath: 'assets/images/sidebar icons/Pin.svg',
    },
    {
      imagePath: 'assets/images/sidebar icons/Group of Projects.svg',
      path: '',
    },
    {
      imagePath: 'assets/images/sidebar icons/Checklist.svg',
      path: '',
    },
    {
      path: '/MyDashboard/allcompanies',
      imagePath: 'assets/images/sidebar icons/Company.svg',
    },
    {
      path: '',
      imagePath: 'assets/images/sidebar icons/Project Management.svg',
    },
    {
      path: '',
      imagePath: 'assets/images/sidebar icons/Plus.svg',
    },
    {
      path: '',
      imagePath: 'assets/images/sidebar icons/Add User Male.svg',
    },
    {
      path: '',
      imagePath: 'assets/images/sidebar icons/Help.svg',
    },
  ];
  // -------------- collapse ------------------
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = window.innerWidth;
    this.collapsed = width <= 992;
  }
  toggleCollapseDropDown(id: string) {
    this.dropdownStates[id] = !this.dropdownStates[id];
    // this.getCompanies();
  }

  collapsed = false;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.sidebarService.setSidebarState(this.collapsed); // Notify other components
    // this.getCompanies();
  }
  // ----------- dropdown optimization ------------

  workspaceIssues = ['Issue 1', 'Issue 2'];

  getCollapseId(companyIndex: number, projectIndex?: number): string {
    if (projectIndex !== undefined) {
      return `collapse-${companyIndex}-${projectIndex}`;
    } else {
      return `collapse-${companyIndex}`;
    }
  }
  // ! <------- Project Modal ------->

  openProj() {
    this.dialogService.openProjModal();
  }

  // ! <------- Issue Modal ------->

  openIssue() {
    this.dialogService.openIssueModal(6);
  }

  // ! <------- Company Modal ------->

  openCompany() {
    this.dialogService.openCompanyModal();
  }

  // <!----- Sprint Modal ------>

  openSprint() {
    this.dialogService.openSprintModal();
  }

  //<!------ Company APi ------->

  companies = [
    {
      id: 0,
      name: 'Company A',
      projects: [
        {
          name: 'Project 1',
          sprints: [{ name: 'Sprint 1' }, { name: 'Sprint 2' }],
        },
      ],
    },
    {
      id: 1,
      name: 'Company B',
      projects: [
        {
          name: 'Project 1',
          sprints: [{ name: 'Sprint 1' }, { name: 'Sprint 2' }],
        },
      ],
    },
  ];

  ngOnInit() {
    this.getCompanies();
    this.sidebarService.companyCreated$.subscribe(() => {
      console.log('Refreshing sidebar after company creation...');
      this.getCompanies();
    });
    this.sidebarService.companyDeleted$.subscribe(() => {
      console.log('Refreshing sidebar after deletion...');
      this.getCompanies();
    });
  }

  // ! getCompanies(): void {
  //   this._companyService.getAllCompanies(null).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       if (res?.result && res.result.length > 0) {
  //         this.companyNames = res.result.map(
  //           (company: { id: string; name: string }) => ({
  //             id: company.id,
  //             name: company.name,
  //           })
  //         );
  //         this.companyData = res.result;

  //         // this.companies = [
  //         //   {
  //         //     // id: this.companyData.id,
  //         //     id: 0,
  //         //     name: 'Company A',
  //         //     projects: [
  //         //       {
  //         //         name: 'Project 1',
  //         //         sprints: [{ name: 'Sprint 1' }, { name: 'Sprint 2' }],
  //         //       },
  //         //     ],
  //         //   },
  //         // ]

  //         const companyIndex = this.companies.findIndex(
  //           (c) => c.id === this.SelectedCompanyId
  //         );

  //         // Call getProjectData only if SelectedCompanyId is defined
  //         if (this.SelectedCompanyId) {
  //           this.getProjectData();
  //         }
  //       }
  //     },
  //     error: (err) => console.error(err),
  //   });
  // }

  // getCompanies(): void {
  //   this._companyService.getAllCompanies(null).subscribe({
  //     next: (res) => {
  //       console.log('Companies API response:', res);
  //       if (res?.result && res.result.length > 0) {
  //         this.companyNames = res.result.map((company: any) => ({
  //           id: company.id,
  //           name: company.name,
  //         }));
  //         this.companyData = res.result;

  //         // Store companies and initialize projects as empty
  //         this.companies = this.companyData.map((company) => ({
  //           id: company.id,
  //           name: company.name,
  //           projects: [],
  //         }));

  //         // Automatically select the first company (Optional)
  //         this.SelectedCompanyId = this.companyData[0]?.id || 0;
  //         console.log('Selected Company ID:', this.SelectedCompanyId);

  //         if (this.SelectedCompanyId) {
  //           this.getProjectData(); // Fetch projects after setting company
  //         }
  //       }
  //     },
  //     error: (err) => console.error('Error fetching companies:', err),
  //   });
  // }

  getCompanies(): void {
    this._companyService.getAllCompanies(null).subscribe({
      next: (res) => {
        console.log('Companies API response:', res);
        if (res?.result && res.result.length > 0) {
          this.companyNames = res.result.map((company: any) => ({
            id: company.id,
            name: company.name,
          }));
          this.companyData = res.result;

          // Store companies and initialize projects as empty
          this.companies = this.companyData.map((company) => ({
            id: company.id,
            name: company.name,
            projects: [],
          }));

          console.log('Companies after processing:', this.companies);

          // Fetch projects for each company
          this.fetchProjectsForAllCompanies();
        }
      },
      error: (err) => console.error('Error fetching companies:', err),
    });
  }

  selectCompany(companyId: string) {
    this.router.navigate(['/MyDashboard/Company', companyId]);
    this.SelectedCompanyId = parseInt(companyId);
    console.log(this.SelectedCompanyId);
  }

  fetchProjectsForAllCompanies() {
    this.companies.forEach((company, index) => {
      this._ProjectService.getProjectData(company.id).subscribe({
        next: (res) => {
          console.log(`Project API response for company ${company.id}:`, res);

          if (res && res.result && res.result.length > 0) {
            this.companies[index].projects = res.result.map((project: any) => ({
              name: project.name,
              sprints: [{ name: 'Sprint 1' }, { name: 'Sprint 2' }],
            }));
          } else {
            console.warn(`No projects found for company ID: ${company.id}`);
          }
        },
        error: (err) =>
          console.error(
            `Error fetching project data for company ${company.id}:`,
            err
          ),
      });
    });
  }

  // getProjectData() {
  //   if (!this.SelectedCompanyId) {
  //     console.error(
  //       'SelectedCompanyId is undefined, skipping project data fetch.'
  //     );
  //     return;
  //   }

  //   this._ProjectService.getProjectData(this.SelectedCompanyId).subscribe({
  //     next: (res) => {
  //       if (res.isSuccess && res.result.length > 0) {
  //         console.log('Project data received:', res.result);
  //         this.projects = res.result;

  //         // Find the selected company in the array
  //         const companyIndex = this.companies.findIndex(
  //           (c) => c.id === this.SelectedCompanyId
  //         );

  //         if (companyIndex !== -1) {
  //           // Assign projects with static sprints
  //           this.companies[companyIndex].projects = this.projects.map(
  //             (project) => ({
  //               name: project.name,
  //               sprints: [{ name: 'Sprint 1' }, { name: 'Sprint 2' }],
  //             })
  //           );
  //         } else {
  //           console.warn('Company not found in companies array.');
  //         }
  //       } else {
  //         console.warn(
  //           'No projects found or API response error:',
  //           res.errorMessages
  //         );
  //       }
  //     },
  //     error: (err) => console.error('Error fetching project data:', err),
  //   });
  // }
}
