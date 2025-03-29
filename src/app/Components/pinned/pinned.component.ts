import { NgClass, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { PinnedService } from '../../Core/Services/pinned.service';
import { ProjectResult, Tenant, TenantOwner, TenantResult } from '../../Core/interfaces/pinned';
import { Project } from '../../Core/interfaces/project';

@Component({
  selector: 'app-pinned',
  standalone: true,
  imports: [NgClass, NgForOf],
  templateUrl: './pinned.component.html',
  styleUrl: './pinned.component.css',
})
export class PinnedComponent {
  isSidebarCollapsed = true;
  ProjectsList: ProjectResult[] = [];
  ProjectsRes: Project | null = null;
  TenantsRes: Tenant | null = null;
  TenantsLists: TenantResult[] = [];
  // IssuesLists : IssueResult[] = [];  //! Wait for the Issue Interface
  TenantOwner: TenantOwner[] = [];
  // Tenants: Tenant[] = [];

  constructor(private sidebarService: SidebarService) {}

  private readonly _PinnedService = inject(PinnedService);

  GetPinnedProjects() {
    this._PinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        this.ProjectsList = res.result;
        this.ProjectsRes = res;
        this.ProjectsRes = res;
      },
    });
  }

  getPinnedTenants() {
    this._PinnedService.getPinnedTenants().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        this.TenantsRes = res;
        this.TenantsLists = res.result;
        this.TenantOwner = res.result.owner;
        // this.Tenants = res;
      },
    });
  }

  getPinnedIssues() {
    this._PinnedService.getPinnedIssues().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        // this.IssuesLists = res.result;   //! Wait for the Issue Interface
      },
    });
  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.GetPinnedProjects();
    this.getPinnedTenants();
  }
}
