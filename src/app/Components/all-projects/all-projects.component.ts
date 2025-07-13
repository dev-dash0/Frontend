import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { SidebarService } from '../../Core/Services/sidebar.service';
import { CompanyService } from '../../Core/Services/company.service';
import { ProfileService } from '../../Core/Services/profile.service';
import { ProjectService } from '../../Core/Services/project.service';

import { Company } from '../../Core/interfaces/company/company';
import { ProjectResult } from '../../Core/interfaces/project';

import { AllcompaniescardComponent } from '../allcompaniescard/allcompaniescard.component';
import { AllProjectsCardComponent } from '../all-projects-card/all-projects-card.component';
import { JoinProjectComponent } from '../join-project/join-project.component';
import { DashboardLoaderComponent } from '../../Shared/dashboard-loader/dashboard-loader.component';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatChipsModule,
    AllcompaniescardComponent,
    AllProjectsCardComponent,
    DashboardLoaderComponent,
  ],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css',
})
export class AllProjectsComponent {
  joinedProjects: ProjectResult[] = [];
  ownedProjects: ProjectResult[] = [];

  userId!: string;
  isSidebarCollapsed = true;
  loading = false;

  constructor(
    private sidebarService: SidebarService,
    private _projectService: ProjectService,
    private _profileService: ProfileService,
    private _router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.sidebarService.companyCreated$.subscribe(() => {
      this.getProjects();
    });

    this.getProjects();
  }

  getProjects(): void {
    this.loading = true;

    this._profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;

        this._projectService.getAllProjects().subscribe({
          next: (res) => {
            const allProjects = res.result || [];
            this.ownedProjects = allProjects.filter(
              (project: any) => project.creator?.id === this.userId
            );

            this.joinedProjects = allProjects.filter(
              (project: any) => project.creator?.id !== this.userId
            );

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

  viewProject(projectId: string): void {
    this._router.navigate(['/MyDashboard/Project', projectId]);
  }

  join(): void {
    this.dialog.open(JoinProjectComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '40vh',
      maxHeight: '50vh',
      disableClose: true,
    });
  }
}
