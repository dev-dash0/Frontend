import { Router, RouterLink } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../Core/Services/dialog.service';
import { Company } from '../../Core/interfaces/company/company';
import { CompanyService } from '../../Core/Services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../Core/Services/project.service';
import { SprintService } from '../../Core/Services/sprint.service';
import { SprintModalComponent } from '../../Components/sprint-modal/sprint-modal.component';
import { ProfileService } from '../../Core/Services/profile.service';
import { Projects } from '../../Core/interfaces/company/projects';

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
    private companyService: CompanyService,
    private projectService: ProjectService,
    private router: Router,
    private profileService: ProfileService,
    private dialog: MatDialog
  ) {}
  private _sprintService = inject(SprintService);

  companyData: Company[] = [];
  companyNames: { id: string; name: string }[] = [];
  projectsNames: { id: string; name: string }[] = [];
  SelectedCompanyId: number = 0;
  SelectedProjectId: number = 0;
  SelectedSprintId: number = 0;
  projectTest: { [projectId: string]: any[] } = {};
  // projects: ProjectResult[] = [];
  showSprints: { [projectId: string]: any[] } = {};
  loadedCompanies = true;
  loadedProjects = true;
  loadedSprints = true;

  collapsed = false;
  isTransitioning = false;
  isSmallScreen = false;

  userId: any = 0;

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
    // {
    //   imagePath: 'assets/images/sidebar icons/Plus.svg',
    //   path: '',
    //   text: 'Integrations',
    // },
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
    // {
    //   path: '',
    //   imagePath: 'assets/images/sidebar icons/Plus.svg',
    // },
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
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth < 768;
    if (this.isSmallScreen) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
      this.sidebarService.setSidebarState(false);
    }
  }

  toggleCollapseSmall() {
    this.sidebarService.setSidebarState(!this.collapsed);
    if (!this.isSmallScreen) {
      this.collapsed = !this.collapsed;
    }
  }

  toggleCollapseDropDown(id: string) {
    this.dropdownStates[id] = !this.dropdownStates[id];
  }

  // toggleCollapse(): void {
  //   if (this.isTransitioning) return;
  //   this.isTransitioning = true;
  //   this.collapsed = !this.collapsed;
  //   this.sidebarService.setSidebarState(this.collapsed);
  //   this.cdRef.markForCheck();
  //   setTimeout(() => {
  //     this.isTransitioning = false;
  //   }, 300);
  // }
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

  openSprint(projectId: any) {
    this.dialog.open(SprintModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw',
      minHeight: '60vh',
      maxHeight: '90vh',
      data: { projectId },
    });
  }

  //<!------ Company APi ------->

  companies = [
    {
      id: 0,
      name: 'Company A',
      projects: [
        {
          id: 0,
          name: 'Project 1',
        },
      ],
    },
    // {
    //   id: 1,
    //   name: 'Company B',
    //   projects: [
    //     {
    //       id: 0,
    //       name: 'Project 1',
    //     },
    //   ],
    // },
  ];

  ngOnInit() {
    // this.getCompanies();
    // this.getSprints();
    // this.getProjects();
    // this.checkScreenSize();

    // 🧹 Clear old data
    this.companyData = [];
    this.companyNames = [];
    this.projectsNames = [];
    this.projectTest = {};
    this.showSprints = {};
    this.userId = 0;
    this.loadedCompanies = true;
    this.loadedProjects = true;
    this.loadedSprints = true;

    // 🔄 Reload fresh data
    this.getCompanies();
    this.getSprints();
    this.getProjects();
    this.checkScreenSize();

    this.sidebarService.companyCreated$.subscribe(() => {
      this.getCompanies();
    });

    this.sidebarService.companyDeleted$.subscribe(() => {
      this.getCompanies();
    });

    this._sprintService.sprintCreated$.subscribe(() => {
      this.getSprints();
    });

    this._sprintService.sprintUpdated$.subscribe(() => {
      this.getSprints();
    });

    this._sprintService.sprintDeleted$.subscribe(() => {
      this.getSprints();
    });

    this.projectService.projectCreated$.subscribe(() => {
      this.getProjects();
    });

    this.projectService.projectUpdated$.subscribe(() => {
      this.getProjects();
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

  // companies API
  getCompanies(): void {
    this.profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.companyService.getAllCompanies(null).subscribe({
          next: (res) => {
            if (res?.result && res.result.length > 0) {
              this.companyNames = res.result.map((company: any) => ({
                id: company.id,
                name: company.name,
              }));
              this.companyData = res.result;
              this.loadedCompanies = false;
              // Store companies and initialize projects as empty
              // this.companies = this.companyData.map((company) => ({
              //   id: company.id,
              //   name: company.name,
              //   projects: [],
              // }));
              // console.log('Companies after processing:', this.companies);
              // // Fetch projects for each company
              // this.fetchProjectsForAllCompanies();
            }
          },
          error: (err) => console.error('Error fetching companies:', err),
        });
      },
    });
  }

  // Routing to companies,projects,sprints
  selectCompany(companyId: any) {
    this.router.navigate(['/MyDashboard/Company', companyId]);
    this.SelectedCompanyId = parseInt(companyId);
    console.log(this.SelectedCompanyId);
  }

  selectProject(projectId: any) {
    this.router.navigate(['/MyDashboard/Project', projectId]);
    this.SelectedProjectId = parseInt(projectId);
    console.log(this.SelectedProjectId);
  }

  selectSprint(sprintId: any) {
    this.router.navigate(['/MyDashboard/Sprint', sprintId]);
    this.SelectedSprintId = parseInt(sprintId);
    console.log(this.SelectedSprintId);
  }

  // fetchProjectsForAllCompanies() {
  //   this.companies.forEach((company, index) => {
  //     this._ProjectService.getProjectData(company.id).subscribe({
  //       next: (res) => {
  //         console.log(`Project API response for company ${company.id}:`, res);
  //         if (res && res.result && res.result.length > 0) {
  //           this.companies[index].projects = res.result.map((project: any) => ({
  //             id: project.id,
  //             name: project.name,
  //           }));
  //         } else {
  //           console.warn(`No projects found for company ID: ${company.id}`);
  //         }
  //       },
  //       error: (err) =>
  //         console.error(
  //           `Error fetching project data for company ${company.id}:`,
  //           err
  //         ),
  //     });
  //   });
  // }

  //Project API
  getProjects() {
    this.companyService.getAllCompanyIds().subscribe({
      next: (companyIds) => {
        companyIds.forEach((companyId) => {
          this.projectService.getProjectData(companyId).subscribe({
            next: (response) => {
              // console.log(
              //   `Project API response for company ${companyId}:`,
              //   response
              // );
              const projects = response.result.map((project: any) => ({
                id: project.id,
                name: project.name,
              }));
              this.projectTest[companyId] = projects;
            },
            error: (err) => {
              console.error(
                `Error fetching projects for company ${companyId}:`,
                err
              );
            },
          });
        });
      },
      error: (err) => console.error('Error fetching company IDs:', err),
    });
  }

  // Sprint API
  getSprints() {
    this.profileService.getProfileData().subscribe({
      next: (user) => {
        const userId = user.id;
        this.companyService.getAllCompanyIds().subscribe({
          next: (res) => {
            res.forEach((companyId) => {
              this.projectService.getProjectData(companyId).subscribe({
                next: (project) => {
                  project.result.forEach((proj: Projects) => {
                    const members = this.getProjectMembers(proj);
                    // console.log(`Project ${proj.id} members:`, members);
                    const userIsMember = members.some(
                      (member: any) => member.id === userId
                    );
                    if (!userIsMember) return;
                    this._sprintService.getAllSprints(proj.id, null).subscribe({
                      next: (sprint) => {
                        const sprints = Array.isArray(sprint.result)
                          ? sprint.result
                          : [sprint.result];
                        this.showSprints[proj.id] = sprints;
                      },
                      error: (err) => {
                        console.error(
                          `Error fetching sprints for project ${project.id}:`,
                          err
                        );
                      },
                    });
                  });
                },
              });
            });
          },
        });
      },
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
