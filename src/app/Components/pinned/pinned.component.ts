import { NgClass, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { PinnedService } from '../../Core/Services/pinned.service';
import { ProjectResult, Tenant, TenantOwner, TenantResult } from '../../Core/interfaces/pinned';

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
  TenantsLists: TenantResult[] = [];
  // TenantOwner: TenantOwner[] = [];
  // Tenants: Tenant[] = [];

  constructor(private sidebarService: SidebarService) {}

  private readonly _PinnedService = inject(PinnedService);

  GetPinnedProjects() {
    this._PinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        this.ProjectsList = res.result;
      },
    });
  }

  getPinnedTenants() {
    this._PinnedService.getPinnedTenants().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        this.TenantsLists = res.result;
        // this.TenantOwner = res.owner;
        // this.Tenants = res;
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
