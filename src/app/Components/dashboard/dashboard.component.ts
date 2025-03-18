import { Component, inject, signal } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { CommonModule, NgClass } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { VisualizationComponent } from '../visualization/visualization.component';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { Project } from '../../Core/interfaces/Dashboard/Project';
import { Issue } from '../../Core/interfaces/Dashboard/Issue';
import { TreeNode } from '../../Core/interfaces/TreeNode';
import { TreeComponent } from "../../Shared/tree/tree.component";
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CalendarComponent,
    NgClass,
    VisualizationComponent,
    TreeComponent,
    RouterLink,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isSidebarCollapsed = true;
  AllProjectList: Project[] = [];
  AllIssueList: Issue[] = [];
  AllPinnedList: any = [];
  pinnedTenants: any[] = [];
  pinnedProjects: any[] = [];
  pinnedIssues: any[] = [];
  pinnedSprints: any[] = [];
  // treeData = signal<TreeNode[]>([]);
  treeData = new BehaviorSubject<TreeNode[]>([]);




  isDropdownOpen = {
    tenants: false,
    projects: false,
    issues: false,
    sprints: false
  };


  get treeNodes(): TreeNode[] {
    return this.treeData.value || []; // Ensure a default empty array
  }

  private readonly _DashboardService = inject(DashboardService);
  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.getDashboardAllIProject();
    this.getDashboardAllIssue();
    this.getDashboardPinned();

  }


  getDashboardAllIProject() {
    this._DashboardService.getDashboardAllProject().subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.AllProjectList = res.result;
        },
        error: (err) => {
          console.log(err);
          console.error(err);
        },
      }

    );

  }
  getDashboardAllIssue() {
    this._DashboardService.getDashboardAllIssue().subscribe(
      {
        next: (res) => {
          // console.log(res);
          this.AllIssueList = res.result;
        },
        error: (err) => {
          console.log(err);
          console.error(err);
        },
      }
    );
  }
  getDashboardPinned() {
    this._DashboardService.getDashboardPinned().subscribe({
      next: (res) => {
        console.log("API Response:", res);

        // Ensure we have valid data
        const result = res?.result ?? {};
        this.pinnedIssues = result.issues ?? [];
        this.pinnedProjects = result.projects ?? [];
        this.pinnedTenants = result.tenants ?? [];
        this.pinnedSprints = result.sprints ?? [];

        // Update treeData using .next()
        this.treeData.next([
          {
            id: 'tenants',
            name: 'Tenants',
            type: 'tenant',
            expanded: false,
            children: this.pinnedTenants.map(t => ({
              id: t?.id ?? 0,
              name: t?.name ?? 'Unnamed Tenant',
              type: 'tenant',
              expanded: Boolean(t?.expanded), // ✅ Force boolean
            })) || []
          },
          {
            id: 'projects',
            name: 'Projects',
            type: 'project',
            expanded: false,
            children: this.pinnedProjects.map(p => ({
              id: p?.id ?? 0,
              name: p?.name ?? 'Unnamed Project',
              type: 'project',
              expanded: p?.expanded ?? false, // ✅ Ensure boolean
            })) || []
          },
          {
            id: 'issues',
            name: 'Issues',
            type: 'issue',
            expanded: false,
            children: this.pinnedIssues.map(i => ({
              id: i?.id ?? 0,
              name: i?.title ?? 'Unnamed Issue',
              type: 'issue',
              expanded: !!i?.expanded, // ✅ Force boolean using !!
            })) || []
          },
          {
            id: 'sprints',
            name: 'Sprints',
            type: 'sprint',
            expanded: false,
            children: this.pinnedSprints.map(s => ({
              id: s?.id ?? 0,
              name: s?.title ?? 'Unnamed Sprint',
              type: 'sprint',
              expanded: Boolean(s?.expanded) // ✅ Ensure boolean
            })) || []
          }
        ]);
      },
      error: (err) => {
        console.error("Error fetching tree data", err);
      },
    });
  }


  capitalizeTitles(title: string) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
}
