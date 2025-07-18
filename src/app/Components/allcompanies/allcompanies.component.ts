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
import { PinnedService } from '../../Core/Services/pinned.service';
import { DialogService } from '../../Core/Services/dialog.service';

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
    private _router: Router,
    private _pinService: PinnedService,
    private dialogService: DialogService
  ) {}

  //---------------------------------
  joinedCompanies: Company[] = [];
  ownedCompanies: Company[] = [];
  allCompanies: Company[] = [];
  companyData: Company[] = [];
  userId!: any;
  companyId!: any;
  isSidebarCollapsed = true;
  showCompanies = false;
  loading = true;
  pinnedTenantIds: Set<number> = new Set();
  //---------------------------------
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.sidebarService.companyCreated$.subscribe(() => {
      // console.log('company is being created...');
      this.getCompanies();
    });
    this.getPinnedCompanies();
    this.getCompanies();
    // this.getCompaniesids();
  }

  // get all tenants api and show all the companies i am in
  getCompanies(): void {
    this._profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        this._companyService.getAllCompanies(null).subscribe({
          next: (res) => {
            if (res && res.result && res.result.length > 0) {
              this.allCompanies = res.result;
              this.joinedCompanies = this.allCompanies.filter(
                (company) => company.owner.id !== this.userId
              );
              this.ownedCompanies = this.allCompanies.filter(
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

  getPinnedCompanies() {
    this._pinService.getPinnedTenants().subscribe({
      next: (res) => {
        const ids = res.result.map((t: any) => t.id);
        this.pinnedTenantIds = new Set(ids);
      },
      error: (err) => {
        console.error('Fetching pinned companies failed:', err);
      },
    });
  }

  onPinChanged(event: { id: number; pinned: boolean }) {
    if (event.pinned) {
      this.pinnedTenantIds.add(event.id);
    } else {
      this.pinnedTenantIds.delete(event.id);
    }
  }

  // routing to every comapny by id
  viewCompany(companyId: string): void {
    this._router.navigate(['/MyDashboard/Company', companyId]);
  }

  join() {
    const dialogRef = this.dialog.open(JoinCompanyComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '40vh',
      maxHeight: '50vh',
      disableClose: true,
    });
  }

  openCompany() {
    this.dialogService.openCompanyModal();
  }
}
