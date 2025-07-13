import { DashboardService } from './../../Core/Services/dashboard/dashboard.service';
import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { AllProjectsDashboardComponent } from "../all-projects-dashboard/all-projects-dashboard.component";
import { CompanyService } from '../../Core/Services/company.service';
import { ProfileService } from '../../Core/Services/profile.service';
import { Company } from '../../Core/interfaces/company/company';
import { ChartLoaderComponent } from "../../Shared/chart-loader/chart-loader.component";
import { DashboardLoaderComponent } from "../../Shared/dashboard-loader/dashboard-loader.component";
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogService } from '../../Core/Services/dialog.service';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-visualization',
  standalone: true,
  imports: [MatTabsModule, AllProjectsDashboardComponent, ChartLoaderComponent, DashboardLoaderComponent, CommonModule],
  templateUrl: './visualization.component.html',
  styleUrl: './visualization.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [ // fade in
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [ // fade out
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class VisualizationComponent implements OnInit {
  //variables
  lotsOfTabs: { name: string, id: number }[] = [];
  joinedCompanies: Company[] = [];
  userId!: any;
  companyId!: any;
  isLoading: boolean = true;

  //services
  private readonly _companyService = inject(CompanyService);
  private readonly _profileService = inject(ProfileService);
  private readonly dialogService=inject(DialogService);
  private readonly _DashboardService=inject(DashboardService);
  constructor() { }


  ngOnInit(): void {
    this.getCompanies();

    this._DashboardService.companyCreated$.subscribe(() => {
      this.getCompanies();
    });

  }

  getCompanies(): void {
    this._profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        this._companyService.getAllCompanies(null).subscribe({
          next: (res) => {
            this.isLoading = false;
            // console.log("All Companies Response", res);
            if (res && res.result && res.result.length > 0) {
              this.joinedCompanies = res.result;
              this.lotsOfTabs = this.joinedCompanies.map((company) => ({
                name: company.name,
                id: company.id,
              }));
            }
          },
          error: (err) => {
            console.error(err)
            this.isLoading = false;
          },
        });
      },
    });
  }


    // ! <------- Company Modal ------->

    openCompany() {
      
      this.dialogService.openCompanyModal()  
    }




    


}
