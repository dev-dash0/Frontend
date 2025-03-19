import { SidebarService } from './../../Core/Services/sidebar.service';
import { CompanyService } from './../../Core/Services/company.service';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Company } from '../../Core/interfaces/company/company';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCompanyModalComponent } from '../company-modal/company-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '../deletemodal/deletemodal.component';
import { ProfileService } from '../../Core/Services/profile.service';
import { ProjectCategory } from '../../Core/interfaces/company/project-category';

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
  @Output() companyDeleted = new EventEmitter<void>();
  isOwner = false;
  userId!: any;

  selectCompany() {
    this.companySelected.emit(this.company.id);
  }

  contactInfo: any = [
    {
      icon: 'assets/images/Email.svg',
      label: 'Email',
      value: 'john@company.com',
    },
    {
      icon: 'assets/images/LinkedIn.svg',
      label: 'LinkedIn',
      value: 'linkedin.com/in/johndoe',
    },
    {
      icon: 'assets/images/WhatsApp.svg',
      label: 'WhatsApp',
      value: '01036411895',
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
      status: 'inprogress',
      issues: [
        {
          title: 'Project 3',
          startDate: '5-3',
          dueDate: '5-16',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'backend',
        },
        {
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
          title: 'Project 1',
          startDate: '5-1',
          dueDate: '5-12',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'web',
        },
        {
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
  ];

  spanStatus = ['inprogress-span', 'completed-span', 'overdue-span'];

  // variables
  constructor(
    private cdr: ChangeDetectorRef,
    private sidebarService: SidebarService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private _profile: ProfileService
  ) {}
  isSidebarCollapsed = true;
  // ----------------------------------------
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.route.paramMap.subscribe(() => {
      this.getCompany();
    });
  }

  // get tenant data
  getCompany(): void {
    this._profile.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        const companyId = this.route.snapshot.paramMap.get('id');
        if (companyId) {
          this.companyService.getCompanyData(companyId).subscribe({
            next: (res) => {
              console.log(res);
              this.company = res.result;
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
      case 'inprogress':
        return this.projectStatus[0];
      case 'completed':
        return this.projectStatus[1];
      case 'overdue':
        return this.projectStatus[2];
      default:
        return '';
    }
  }

  getSpanStatus(status: string): string {
    switch (status) {
      case 'inprogress':
        return this.spanStatus[0];
      case 'completed':
        return this.spanStatus[1];
      case 'overdue':
        return this.spanStatus[2];
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
}
