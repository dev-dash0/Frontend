import { Sprint } from './../../Core/interfaces/sprint';
import { DialogService } from './../../Core/Services/dialog.service';
import { SidebarService } from './../../Core/Services/sidebar.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { Issues } from '../../Core/interfaces/company/issues';
import { IssueCategory } from '../../Core/interfaces/company/issue-category';
import { SprintService } from '../../Core/Services/sprint.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sprint-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sprint-view.component.html',
  styleUrl: './sprint-view.component.css',
})
export class SprintViewComponent {
  isSidebarCollapsed = true;
  private dialogService = inject(DialogService);
  private sidebarService = inject(SidebarService);
  private _sprintService = inject(SprintService);
  private route = inject(ActivatedRoute);

  sprintDetails: Sprint[] = [];

  issueCategories: IssueCategory[] = [
    {
      name: 'Backlog',
      icon: 'assets/images/Issue Status/backlog.svg',
      class: 'backlog-tag',
      status: 'backlog',
      issues: [
        {
          title: 'Issue 1',
          startDate: '5-1',
          dueDate: '5-12',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'web',
          priority: 'Low',
          priorityIcon: 'assets/images/Issue Priorities/low.svg',
        },
        {
          title: 'Issue 2',
          startDate: '5-2',
          dueDate: '5-15',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'mobile',
          priority: 'High',
          priorityIcon: 'assets/images/Issue Priorities/high.svg',
        },
      ],
    },
    {
      name: 'To Do',
      icon: 'assets/images/Issue Status/todo.svg',
      class: 'todo-tag',
      status: 'todo',
      issues: [
        {
          title: 'Issue 3',
          startDate: '5-3',
          dueDate: '5-16',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'backend',
          priority: 'Normal',
          priorityIcon: 'assets/images/Issue Priorities/normal.svg',
        },
        {
          title: 'Issue 4',
          startDate: '5-3',
          dueDate: '5-16',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'frontend',
          priority: 'Urgent',
          priorityIcon: 'assets/images/Issue Priorities/urgent.svg',
        },
      ],
    },
    {
      name: 'Completed',
      icon: 'assets/images/Issue Status/Completed.svg',
      class: 'completed-tag',
      status: 'completed',
      issues: [
        {
          title: 'Issue 5',
          startDate: '5-5',
          dueDate: '5-18',
          description:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
          category: 'frontend',
          priority: 'Normal',
          priorityIcon: 'assets/images/Issue Priorities/normal.svg',
        },
      ],
    },
  ];

  Priorities = [
    {
      value: 'Low',
    },
    {
      value: 'Normal',
    },
    {
      value: 'High',
    },
    {
      value: 'Urgent',
    },
  ];

  issueStatus = ['backlog-wrapper', 'todo-wrapper', 'completed-wrapper'];
  spanStatus = ['backlog-span', 'todo-span', 'completed-span'];

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.getSprintDetails();
    this.route.paramMap.subscribe(() => {
      this.getSprintDetails();
    });
  }

  getSprintDetails() {
    const sprintId = this.route.snapshot.paramMap.get('id');
    this._sprintService.getSprintData(sprintId).subscribe({
      next: (res) => {
        const rawSprint = Array.isArray(res.result) ? res.result : [res.result];
        this.sprintDetails = rawSprint.map((sprint: Sprint) => ({
          ...sprint,
          startDate: this.dateFormatter(sprint.startDate),
          endDate: this.dateFormatter(sprint.endDate),
        }));
        console.log('Sprint Details:', res);
      },
      error: (err) => {
        console.error('Error fetching sprint details:', err);
      },
    });
  }

  openIssue() {
    this.dialogService.openIssueModal(6);
  }

  getWrapperClass(status: string): string {
    switch (status) {
      case 'backlog':
        return this.issueStatus[0];
      case 'todo':
        return this.issueStatus[1];
      case 'completed':
        return this.issueStatus[2];
      default:
        return '';
    }
  }

  getSpanStatus(status: string): string {
    switch (status) {
      case 'backlog':
        return this.spanStatus[0];
      case 'todo':
        return this.spanStatus[1];
      case 'completed':
        return this.spanStatus[2];
      default:
        return '';
    }
  }

  dateFormatter(dateString: string | Date): string {
    const dateFormat = new Date(dateString);
    const formatted = `${String(dateFormat.getDate()).padStart(
      2,
      '0'
    )}/${String(dateFormat.getMonth() + 1).padStart(
      2,
      '0'
    )}/${dateFormat.getFullYear()}`;
    return formatted;
  }
}
