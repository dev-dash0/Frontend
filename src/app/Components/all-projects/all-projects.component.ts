import { Router } from '@angular/router';
import { Company } from '../../Core/interfaces/company/company';
import { MatTabsModule } from '@angular/material/tabs';
import { Component, Inject, inject } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { AllcompaniescardComponent } from '../allcompaniescard/allcompaniescard.component';
import { CompanyService } from '../../Core/Services/company.service';
import { ProfileService } from '../../Core/Services/profile.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AllProjectsCardComponent } from "../all-projects-card/all-projects-card.component";
import { ProjectService } from '../../Core/Services/project.service';
import { ProjectResult } from '../../Core/interfaces/project';
import { JoinProjectComponent } from '../join-project/join-project.component';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatChipsModule,
    AllcompaniescardComponent,
    AllProjectsCardComponent,
  ],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css',
})
export class AllProjectsComponent {
  constructor(
    private sidebarService: SidebarService,
    private _companyService: CompanyService,
    private _ProjectService: ProjectService,
    private _profileService: ProfileService,
    private dialog: MatDialog,
    private _router: Router
  ) {}

  //---------------------------------
  joinedCompanies: Company[] = [];
  ownedCompanies: Company[] = [];
  joinedProjects: ProjectResult[] = [];
  ownedProjects: ProjectResult[] = [];
  companyData: Company[] = [];
  userId!: any;
  companyId!: any;
  isSidebarCollapsed = true;
  loading = false;

  showProjects: boolean = false;

  //---------------------------------
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    // this.sidebarService.companyCreated$.subscribe(() => {
    //   console.log('company is being created...');
    //   this.getCompanies();
    // });
    // this.getCompanies();
    // this.getCompaniesids();
    this.sidebarService.companyCreated$.subscribe(() => {
      console.log('company is being created...');
      this.getProjects();
    });
    this.getProjects();
    // this.getCompaniesIds();
  }
  getProjects(): void {
    this.loading = true;

    this._profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;

        this._ProjectService.getAllProjects().subscribe({
          next: (res) => {
            if (res && res.result && res.result.length > 0) {
              const allProjects = res.result;

              this.ownedProjects = allProjects.filter(
                (project: any) => project.creator?.id === this.userId
              );

              this.joinedProjects = allProjects.filter(
                (project: any) => project.creator?.id !== this.userId
              );

              console.log('Owned Projects:', this.ownedProjects);
              console.log('Joined Projects:', this.joinedProjects);
            }

            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  // routing to every company by id
  viewCompany(companyId: string): void {
    this._router.navigate(['/MyDashboard/Company', companyId]);
  }

  // routing to every Project by id
  viewProject(ProjectId: string): void {
    this._router.navigate(['/MyDashboard/Project', ProjectId]);
  }

  // get all tenants api and show all the companies i am in
  // getCompanies(): void {
  //   this._profileService.getProfileData().subscribe({
  //     next: (user) => {
  //       this.userId = user.id;
  //       this._companyService.getAllCompanies(null).subscribe({
  //         next: (res) => {
  //           console.log(res);
  //           if (res && res.result && res.result.length > 0) {
  //             this.joinedProjects = res.result;
  //             this.ownedCompanies = this.joinedCompanies.filter(
  //               (company) => company.owner.id === this.userId
  //             );
  //           }
  //         },
  //         error: (err) => console.error(err),
  //       });
  //     },
  //   });
  // }

  //get all companies ids
  // getCompaniesids() {
  //   this._companyService.getAllCompanyIds().subscribe((companyId) => {
  //     console.log('Company IDs:', companyId);
  //   });
  // }

  join() {
    const dialogRef = this.dialog.open(JoinProjectComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '40vh',
      maxHeight: '50vh',
      disableClose: true,
      // data: { companyId: this.company.id }, // ✅ Pass company id to modal
    });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result === 'deleted') {
    //     console.log('Company deleted successfully');
    //     this.sidebarService.notifyCompanyDeleted();
    //     this.router.navigate(['/MyDashboard/allcompanies']);
    //   }
    // });
  }
}
