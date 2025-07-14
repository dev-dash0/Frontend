import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { PinnedService } from '../../Core/Services/pinned.service';
import { ProjectResult, Tenant, TenantOwner, TenantResult } from '../../Core/interfaces/pinned';
import { Project } from '../../Core/interfaces/project';
import { Issue } from '../../Core/interfaces/Dashboard/Issue';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { FlipCardComponent } from '../../Shared/flip-card/flip-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Sprint } from '../../Core/interfaces/sprint';

@Component({
  selector: 'app-pinned',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './pinned.component.html',
  styleUrl: './pinned.component.css',
})
export class PinnedComponent {
  isSidebarCollapsed = true;
  // ProjectsList: ProjectResult[] = [];
  @Input() ProjectsList: ProjectResult[] = [];
  CardsProjectsList: ProjectResult[] = [];
  ProjectsRes: Project | null = null;
  TenantsRes: Tenant | null = null;
  // TenantsLists: TenantResult[] = [];
  @Input() TenantsLists: TenantResult[] = [];
  IssuesLists: Issue[] = []; //! Wait for the Issue Interface
  TenantOwner: TenantOwner[] = [];
  hovering: boolean = false;
  SprintsList: Sprint[] = [];
  SprintCurrentIndex = 0;

  // Tenants: Tenant[] = [];
  // defaultUserImage: string =
  //   'https://cdn-icons-png.flaticon.com/512/847/847969.png'; // fallback avatar
  defaultTenantImage = 'https://via.placeholder.com/64x64?text=T';
  defaultUserImage = 'https://via.placeholder.com/28x28?text=U';

  constructor(
    private sidebarService: SidebarService,
    private route: ActivatedRoute
  ) {}

  private readonly _PinnedService = inject(PinnedService);
  private readonly dialog = inject(MatDialog);
  private readonly _toaster = inject(ToastrService);
  private readonly _router = inject(Router);

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.GetPinnedProjects();
    this.getPinnedTenants();
    this.getPinnedSprints();
    this.getPinnedIssues();
  }

  showSuccess() {
    this._toaster.success(
      'The Project has been UnPinned',
      'UnPinned Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 10000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }

  showFail() {
    this._toaster.error(
      'The Project has not been UnPinned',
      'UnPinned Failed',
      {
        toastClass: 'toast-pink',
        timeOut: 10000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }

  isValidUrl(url: any): boolean {
    return !!(url && url !== 'string' && url.trim() !== '');
  }

  GetPinnedProjects() {
    this._PinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        this.ProjectsList = res.result;
        this.currentIndex = 0; // reset the loop to show the newest data
        this.CardsProjectsList;
        this.ProjectsRes = res;
      },
    });
  }

  UnPinProject(project: ProjectResult, event: MouseEvent) {
    event.stopPropagation(); // prevent triggering card animation click

    const projectId = project.id;
    this._PinnedService.UnPinItem('Project', projectId).subscribe({
      next: (res) => {
        console.log('UnPinned successfully:', res);
        this.showSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error: (err) => {
        console.error('UnPinning failed:', err);
        this.showFail();
      },
    });
  }
  UnPinTenant(TenantResult: TenantResult, event: MouseEvent) {
    event.stopPropagation(); // prevent triggering card animation click

    const tenantId = TenantResult.id;
    this._PinnedService.UnPinItem('Tenant', tenantId).subscribe({
      next: (res) => {
        console.log('UnPinned successfully:', res);
        this.showSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error: (err) => {
        console.error('UnPinning failed:', err);
        this.showFail();
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
        this.TenantCurrentIndex = 0;
        // this.Tenants = res;
      },
    });
  }

  NavigateProject(ProjectId: number) {
    this._router.navigate(['/MyDashboard/Project', ProjectId]);
  }
  NavigateTenant(TenantId: number) {
    this._router.navigate(['/MyDashboard/Company', TenantId]);
  }
  NavigateSprint(SprintId: number) {
    this._router.navigate(['/MyDashboard/Sprint', SprintId]);
  }

  getPinnedIssues() {
    this._PinnedService.getPinnedIssues().subscribe({
      next: (res) => {
        console.log(res);
        console.log(res.result);
        this.IssuesLists = res.result; //! Wait for the Issue Interface
        this.IssueCurrentIndex = 0;
      },
    });
  }

  // --------- sprint details
  getPinnedSprints() {
    this._PinnedService.getPinnedSprints().subscribe({
      next: (res) => {
        this.SprintsList = res.result;
        this.SprintCurrentIndex = 0;
      },
    });
  }

  get visibleSprints() {
    const visibleCount = Math.min(3, this.SprintsList.length);
    return Array.from(
      { length: visibleCount },
      (_, i) =>
        this.SprintsList[
          (this.SprintCurrentIndex + i) % this.SprintsList.length
        ]
    );
  }

  getSprintsColor(index: number): string {
    const visibleCount = Math.min(3, this.SprintsList.length);
    const adjustedIndex = (this.SprintCurrentIndex + index) % visibleCount;
    return this.cardColors[adjustedIndex];
  }

  onSprintCardClick() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const card = document.querySelector('.card.SprintFront') as HTMLElement;
    card.classList.add('drop');

    setTimeout(() => {
      card.classList.remove('drop');
      this.SprintCurrentIndex =
        (this.SprintCurrentIndex + 1) % this.SprintsList.length;
      this.isAnimating = false;
    }, 500);
  }

  UnPinSprint(Sprint: Sprint, event: MouseEvent) {
    event.stopPropagation();
    const sprintId = Sprint.id;
    this._PinnedService.UnPinItem('Sprint', sprintId).subscribe({
      next: () => {
        this.showSuccess();
        setTimeout(() => window.location.reload(), 3000);
      },
      error: () => this.showFail(),
    });
  }
  //---------- project details

  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'critical-priority';
      case 'high':
        return 'high-priority';
      case 'medium':
        return 'medium-priority';
      case 'low':
        return 'low-priority';
      default:
        return ''; // Default class (optional)
    }
  }

  //  --------- card stack ---------------------------

  // --------- Projects
  cardColors = [
    'linear-gradient(135deg, rgba(33, 38, 79, 0.95), rgba(79, 49, 131, 0.95))',
    'linear-gradient(135deg, rgba(40, 51, 103, 0.95), rgba(105, 60, 154, 0.95))',
    'linear-gradient(135deg, rgba(49, 61, 113, 0.95), rgba(130, 72, 179, 0.95))',
  ];

  // cardColors = [
  //   'linear-gradient(145deg,rgb(24, 45, 91),rgb(91, 45, 68))',
  //   'linear-gradient(145deg,rgb(32, 62, 121),rgb(34, 59, 105))',
  //   'linear-gradient(145deg,rgb(35, 69, 102),rgb(21, 57, 123))',
  // ]; // The Most most
  // cardColors = ['#21264F', '#322B4E', '#3F2E4D']; // project colors
  // cardColors = ['#4B5D67', '#38434F', '#2C2F3A']; //
  // cardColors = ['#5A4E7C', '#3D3B4F', '#2A2933']; // lavender
  //cardColors = ['#2A2E43', '#3E4463', '#525B7A'];  // The Most
  // cardColors = [
  //   'linear-gradient(145deg, #1B2A47,rgb(47, 70, 113))',
  //   'linear-gradient(145deg,rgb(32, 62, 121),rgb(34, 59, 105))',
  //   'linear-gradient(145deg,rgb(35, 69, 102),rgb(21, 57, 123))',
  // ]; // The Most most
  // cardColors = [
  //   'rgba(30, 50, 90, 0.75)',
  //   'rgba(31, 54, 101, 0.75)',
  //   'rgba(30, 55, 104, 0.75)',
  // ]; // Glass

  currentIndex = 0;
  TenantCurrentIndex = 0;
  IssueCurrentIndex = 0;
  isAnimating = false;

  get visibleProjects() {
    const visibleCount = Math.min(3, this.ProjectsList.length);
    return Array.from(
      { length: visibleCount },
      (_, i) =>
        this.ProjectsList[(this.currentIndex + i) % this.ProjectsList.length]
    );
  }

  getColor(index: number): string {
    const visibleCount = Math.min(3, this.ProjectsList.length);
    const adjustedIndex = (this.currentIndex + index) % visibleCount;
    return this.cardColors[adjustedIndex];
  }

  getZIndex(index: number): number {
    return this.cardColors.length - index;
  }

  onCardClick() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const card = document.querySelector('.card.front') as HTMLElement;
    card.classList.add('drop');

    setTimeout(() => {
      card.classList.remove('drop');
      this.currentIndex = (this.currentIndex + 1) % this.ProjectsList.length;
      this.isAnimating = false;
    }, 500);
  }

  // --------------- Issues

  get visibleIssues() {
    const visibleCount = Math.min(3, this.IssuesLists.length);
    return Array.from(
      { length: visibleCount },
      (_, i) =>
        this.IssuesLists[(this.IssueCurrentIndex + i) % this.IssuesLists.length]
    );
  }

  getIssuesColor(index: number): string {
    const visibleCount = Math.min(3, this.IssuesLists.length);
    const adjustedIndex = (this.IssueCurrentIndex + index) % visibleCount;
    return this.cardColors[adjustedIndex];
  }

  onIssueCardClick() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const card = document.querySelector('.card.IssueFront') as HTMLElement;
    card.classList.add('drop');

    setTimeout(() => {
      card.classList.remove('drop');
      this.IssueCurrentIndex =
        (this.IssueCurrentIndex + 1) % this.IssuesLists.length;
      this.isAnimating = false;
    }, 500);
  }

  UnPinIssue(issue: Issue, event: MouseEvent) {
    event.stopPropagation(); // يمنع كليك الكارد الأساسي

    const issueId = issue.id;
    this._PinnedService.UnPinItem('Issue', issueId).subscribe({
      next: (res) => {
        console.log('UnPinned Issue successfully:', res);
        this.showSuccess();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error: (err) => {
        console.error('UnPinning issue failed:', err);
        this.showFail();
      },
    });
  }

  // --------------- Tenants
  get visibleTenants() {
    const visibleCount = Math.min(3, this.TenantsLists.length);
    return Array.from(
      { length: visibleCount },
      (_, i) =>
        this.TenantsLists[
          (this.TenantCurrentIndex + i) % this.TenantsLists.length
        ]
    );
  }

  getTenantsColor(index: number): string {
    const visibleCount = Math.min(3, this.TenantsLists.length);
    const adjustedIndex = (this.TenantCurrentIndex + index) % visibleCount;
    return this.cardColors[adjustedIndex];
  }

  onTenantCardClick() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const card = document.querySelector('.card.TenantFront') as HTMLElement;
    card.classList.add('drop');

    setTimeout(() => {
      card.classList.remove('drop');
      this.TenantCurrentIndex =
        (this.TenantCurrentIndex + 1) % this.TenantsLists.length;
      this.isAnimating = false;
    }, 500);
  }

  // NavigateToItem(id: number, type: 'project' | 'tenant' | 'sprint') {
  //   switch (type) {
  //     case 'project':
  //       this._router.navigate(['/MyDashboard/Project', id]);
  //       break;
  //     case 'tenant':
  //       this._router.navigate(['/MyDashboard/Company', id]);
  //       break;
  //     case 'sprint':
  //       // Navigate to sprint page if available
  //       this._router.navigate(['/MyDashboard/Company', id]);
  //       break;
  //   }
  // }
}
