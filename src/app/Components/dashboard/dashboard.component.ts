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
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { DialogService } from '../../Core/Services/dialog.service';
import { AssignUsersToIssueComponent } from '../assign-users-to-issue/assign-users-to-issue.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectVisitService } from '../../Core/Services/project-visit.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CalendarComponent,
    NgClass,
    VisualizationComponent,
    TreeComponent,
    RouterLink,
    CommonModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('fadeSlideAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
  ]
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
  UrgentIssues:any[]=[];
  assignUsersComp!: AssignUsersToIssueComponent;
  isModalOpen: boolean = false;
  recentProjects:any[] = [];




  isDropdownOpen = {
    tenants: false,
    projects: false,
    issues: false,
    sprints: false
  };


  get treeNodes(): TreeNode[] {
    return this.treeData.value || []; // Ensure a default empty array
  }
  private dialogService = inject(DialogService);
  private _IssueService = inject(IssueService);
  private readonly _DashboardService = inject(DashboardService);
  private readonly _Router=inject(Router);
  private readonly _ProjectVisitService=inject(ProjectVisitService)
  constructor(private sidebarService: SidebarService) { }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.getDashboardAllIProject();
    this.getDashboardAllIssue();
    this.getDashboardPinned();


    this.visitCountMap = this._ProjectVisitService.getVisitCounts();


  }

// ========================================
// ************Recent & Most Visited Projects*********
activeTab: 'recent' | 'visited' = 'recent';
visitCountMap: Record<number, number> = {};
mostVisitedProjects: any[] = [];

get displayedProjects() {
  return this.activeTab === 'recent'
    ? this.recentProjects
    : this.mostVisitedProjects;
}


  getDashboardAllIProject() {
    this._DashboardService.getDashboardAllProject().subscribe({
      next: (res) => {
        console.log(res)
        this.AllProjectList = res.result;
        this.recentProjects = [...this.AllProjectList]
          .sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
          .slice(0, 5);
  
          this.mostVisitedProjects = this.AllProjectList
          .filter(project => this.visitCountMap[project.id]) // Filter projects with visit count
          .sort((a, b) => this.visitCountMap[b.id] - this.visitCountMap[a.id])
          .slice(0, 5);
        
      },
      error: (err) => console.error(err)
    });

  }

  getVisitPercentage(id: number): number {
    const total = Object.values(this.visitCountMap).reduce((acc, val) => acc + val, 0);
    if (!total) return 0;
    return Math.round((this.visitCountMap[id] || 0) / total * 100);
  }
  

  //==========================================
  //************Urgent Issues*******************
  
  getDashboardAllIssue() {
    this._DashboardService.getDashboardAllIssue().subscribe(
      {
        next: (res) => {
          console.log(res);
          this.AllIssueList = res.result;

              this.UrgentIssues = this.AllIssueList.filter((issue) => {
                const isHighPriority =
                  issue.priority?.toLowerCase() === 'high' ||
                  issue.priority?.toLowerCase() === 'critical';
              
                const dueDate = new Date(issue.deadline); 
                const today = new Date();
                const daysLeft = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
              
                return isHighPriority && daysLeft <= 2;
              });
              

        },
        error: (err) => {
          console.error(err);
        },
      }
    );
  }
  getDeadlineStatus(deadline: string): 'upcoming' | 'passed' {
    if (!deadline) return 'upcoming';
    const now = new Date();
    const dueDate = new Date(deadline);
    return dueDate.getTime() < now.getTime() ? 'passed' : 'upcoming';
  }
  
  getPriorityIcon(priority: string): string | null {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'assets/images/Issue Priorities/urgent.svg';
      case 'high':
        return 'assets/images/Issue Priorities/high.svg';
      default:
        return null;
    }
  }


  //==========================================

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
              expanded: Boolean(t?.expanded), //  Force boolean
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
              expanded: p?.expanded ?? false, //  Ensure boolean
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
              expanded: !!i?.expanded, //  Force boolean using !!
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
              expanded: Boolean(s?.expanded) //  Ensure boolean
            })) || []
          }
        ]);
      },
      error: (err) => {
        console.error("Error fetching tree data", err);
      },
    });
  }


  // Open the issue view in a modal
  loadIssue(issueId: number): void {
    this._IssueService.getIssueById(issueId).subscribe({
      next: (res) => {
        // console.log('Issue fetched:', res);
        // this.issue = res;
        this.openIssueView(issueId);
        this.isModalOpen = true;

        // Load assigned users after the issue is loaded
        setTimeout(() => {
          if (this.assignUsersComp) {
            this.assignUsersComp.loadAssignedUsers();
          }
        }, 0);
      },
      error: (err) => {
        console.error('Error fetching issue:', err);
      },
    });
  }
  openIssueView(issueId: number) {
    this.dialogService.openIssueViewModal(issueId);
  }


  
}
