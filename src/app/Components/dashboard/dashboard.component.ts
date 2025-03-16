import { Component, inject, signal } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { NgClass } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { VisualizationComponent } from '../visualization/visualization.component';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { Project } from '../../Core/interfaces/Project';
import { Issue } from '../../Core/interfaces/Issue';
import { TreeNode } from '../../Core/interfaces/TreeNode';
import { TreeComponent } from "../../Shared/tree/tree.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CalendarComponent,
    NgClass,
    VisualizationComponent,
    TreeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isSidebarCollapsed = true;
  AllProjectList: Project[] = [];
  AllIssueList: Issue[] = [];
  AllPinnedList: any = [];
  pinnedIssues: any[] = [];
  // CalenderIssues: any[] = [];
  // treeData = signal<TreeNode[]>([]);


  private readonly _DashboardService = inject(DashboardService);

  constructor(private sidebarService: SidebarService) {


  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.getDashboardAllIProject();
    this.getDashboardAllIssue();
    // this.getDashboardCalender();
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
    this._DashboardService.getDashboardPinned().subscribe(
      {
        next: (res) => {
          console.log(res.result);
          this.AllPinnedList = res.result.issues;

          if (res.isSuccess && res.result.issues.length > 0) {
            const pinnedIssueIds = res.result.issues.map((issue: any) => issue.itemId);

            // Fetch issue details for each pinned issue
            this.fetchPinnedIssueDetails(pinnedIssueIds);
          }
          // this.AllPinnedList = Array.isArray(res.result) ? res.result : [];
          // this.treeData.set(res.result)
          // this.completedIssues = res.result.completedIssues
        },
        error: (err) => {
          console.log(err);
          // console.error("Error fetching tree data", err);
        },
      }

    );

  }

  fetchPinnedIssueDetails(issueIds: number[]) {
    const issueRequests = issueIds.map((id) =>
      this._DashboardService.getIssueById(id).subscribe({
        next: (issue) => {
          if (issue.isSuccess) {
            this.pinnedIssues.push(issue.result);
          }
        },
        error: (err) => console.error('Error fetching issue details', err),
      })
    );
  }

  capitalizeTitles(title: string) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  // treeData: TreeNode[] = [
  //   {
  //     name: 'Root 1',
  //     children: [
  //       { name: 'Child 1' },
  //       {
  //         name: 'Child 2',
  //         children: [{ name: 'Subchild 1' }]
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Root 2',
  //     children: [{ name: 'Child 3' }]
  //   }
  // ];
}
