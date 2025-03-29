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
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  companyData: Company[] = [];
  companyNames: { id: string; name: string }[] = [];
  // ---------------------------------------
  mainServices = [
    {
      imagePath: 'assets/images/sidebar icons/Dashboard Layout.svg',
      path: '/MyDashboard/Dashboard',
      title: 'Dashboard',
    },
    {
      imagePath: 'assets/images/sidebar icons/Pin.svg',
      path: '',
      title: 'Pinned',
    },
    {
      imagePath: 'assets/images/sidebar icons/Group of Projects.svg',
      path: '',
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
  }

  collapsed = false;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.sidebarService.setSidebarState(this.collapsed); // Notify other components
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
      name: 'Company A',
      projects: [
        {
          name: 'Project 1',
          sprints: [{ name: 'Sprint 1' }, { name: 'Sprint 2' }],
        },
      ],
    },
    {
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

  getCompanies(): void {
    this._companyService.getAllCompanies(null).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.result?.length > 0) {
          this.companyNames = res.result.map(
            (company: { id: string; name: string }) => ({
              id: company.id,
              name: company.name,
            })
          );
          this.companyData = res.result;
        }
      },
      error: (err) => console.error(err),
    });
  }

  selectCompany(companyId: string) {
    this.router.navigate(['/MyDashboard/Company', companyId]);
  }
}
