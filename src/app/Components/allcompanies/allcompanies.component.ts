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
import { MatDialog } from '@angular/material/dialog';
import { JoinCompanyComponent } from '../join-company/join-company.component';
import { transition, trigger, style, animate } from '@angular/animations';
import { DashboardLoaderComponent } from '../../Shared/dashboard-loader/dashboard-loader.component';

@Component({
  selector: 'app-allcompanies',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatChipsModule,
    AllcompaniescardComponent,
    DashboardLoaderComponent,
  ],
  templateUrl: './allcompanies.component.html',
  styleUrl: './allcompanies.component.css',
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
export class AllcompaniesComponent {
  constructor(
    private sidebarService: SidebarService,
    private _companyService: CompanyService,
    private _profileService: ProfileService,
    private dialog: MatDialog,
    private _router: Router
  ) {}

  //---------------------------------
  joinedCompanies: Company[] = [];
  ownedCompanies: Company[] = [];
  companyData: Company[] = [];
  userId!: any;
  companyId!: any;
  isSidebarCollapsed = true;
  showCompanies = false;
  loading = true;
  //---------------------------------
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.sidebarService.companyCreated$.subscribe(() => {
      console.log('company is being created...');
      this.getCompanies();
    });
    this.getCompanies();
    this.getCompaniesids();
  }

  // get all tenants api and show all the companies i am in
  getCompanies(): void {
    this._profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        this._companyService.getAllCompanies(null).subscribe({
          next: (res) => {
            console.log(res);
            if (res && res.result && res.result.length > 0) {
              this.joinedCompanies = res.result;
              this.ownedCompanies = this.joinedCompanies.filter(
                (company) => company.owner.id === this.userId
              );
              this.showCompanies = true;
              this.loading = false;
            }
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
    });
  }

  // routing to every comapny by id
  viewCompany(companyId: string): void {
    this._router.navigate(['/MyDashboard/Company', companyId]);
  }

  //get all companies ids
  getCompaniesids() {
    this._companyService.getAllCompanyIds().subscribe((companyId) => {
      console.log('Company IDs:', companyId);
    });
  }

  join() {
    const dialogRef = this.dialog.open(JoinCompanyComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '40vh',
      maxHeight: '50vh',
      disableClose: true,
      // data: { companyId: this.company.id }, // ✅ Pass company id to modal
    });
  }
}
