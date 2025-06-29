import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

import { Company, Owner } from '../../Core/interfaces/company/company';
import { Project, ProjectResult } from '../../Core/interfaces/project';
import { TenantResult } from '../../Core/interfaces/pinned';
import { ProgressAnimationType } from 'ngx-toastr';
import { ProjectService } from '../../Core/Services/project.service';
import { CompanyService } from '../../Core/Services/company.service';
import { PinnedService } from '../../Core/Services/pinned.service';
import { ProfileService } from '../../Core/Services/profile.service';

@Component({
  selector: 'app-all-projects-card',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './all-projects-card.component.html',
  styleUrl: './all-projects-card.component.css',
})
export class AllProjectsCardComponent {
  @Input() company!: Company;
  @Input() project!: ProjectResult;

  @Output() companySelected = new EventEmitter<any>();
  @Output() projectSelected = new EventEmitter<any>();

  isPinned: boolean = false;
  SelectedProjectId: number = 0;
  hover: boolean = false;
  copied = { code: false, url: false };
  defaultUserImage = 'https://via.placeholder.com/28x28?text=U';
  projectUsers: any[] = [];
  isOwner: boolean = false;
  userId!: any;
    owner: Owner | null = null;

  private readonly _pinnedService = inject(PinnedService);
  private readonly _toaster = inject(ToastrService);
  private readonly _ProfileService = inject(ProfileService);
  private readonly _cdr = inject(ChangeDetectorRef);

  constructor(
    private projectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getProject();
    this.getPinnedProjects();

    console.log('Project Input:', this.project);
    console.log('Company Input:', this.company);
  }

  private toastOptions(): Partial<IndividualConfig> {
    return {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing' as ProgressAnimationType, // ✅ fixed
    };
  }

  // ------------------ UI Methods ------------------

  selectProject(): void {
    this.projectSelected.emit(this.project.id);
    this.SelectedProjectId = this.project.id;
  }

  isValidUrl(url: any): boolean {
    return !!(url && typeof url === 'string' && url.trim() !== '');
  }

  copyText(type: 'code' | 'url'): void {
    const content =
      type === 'code' ? this.project.projectCode : this.company.tenantUrl;

    navigator.clipboard.writeText(content).then(() => {
      this.copied[type] = true;
      this.cdr.markForCheck();

      setTimeout(() => {
        this.copied[type] = false;
        this.cdr.markForCheck();
      }, 2000);
    });
  }

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
        return '';
    }
  }

  getUserImage(userId: number): string | null {
    const matchedUser = this.project?.tenant?.joinedUsers?.find(
      (user) => user.id === userId
    );
    if (
      matchedUser &&
      matchedUser.imageUrl &&
      matchedUser.imageUrl.trim() !== ''
    ) {
      return matchedUser.imageUrl;
    }
    return null;
  }

  ngOnChanges() {
    this._ProfileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.owner = this.project?.creator
        this.isOwner = this.owner?.id === this.userId;
      },
    });
  }

  // ------------------ API Methods ------------------

  getProject(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.projectService.getProject(projectId).subscribe({
        next: (res) => {
          this.project = res.result;
          console.log('Project Fetched:', this.project);
        },
        error: (err) => {
          console.error('Error fetching project details:', err);
        },
      });
    }
  }

  getPinnedProjects(): void {
    this._pinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        const pinnedProjects = res.result;
        this.isPinned = pinnedProjects.some(
          (p: any) => p.id === this.project.id
        );
      },
      error: (err) => {
        console.error('Fetching pinned projects failed:', err);
        this.showFail(err?.error?.message || 'Failed to fetch pinned projects');
      },
    });
  }

  TogglePin(project: ProjectResult, event: MouseEvent): void {
    event.stopPropagation();

    const pinAction = this.isPinned
      ? this._pinnedService.UnPinItem('Project', project.id)
      : this._pinnedService.PinItem('Project', project.id);

    pinAction.subscribe({
      next: () => {
        this.isPinned = !this.isPinned;
        this.isPinned ? this.showSuccessUnPin() : this.showSuccessPin();
      },
      error: (err) => {
        console.error(this.isPinned ? 'Unpin failed:' : 'Pin failed:', err);
        this.showFail(err?.error?.message || 'Pin/Unpin failed');
      },
    });
  }

  // 🧠 Match userId from project.userProjects to profile data
  fetchFullUsers() {
    const userIds = this.project.userProjects?.map((u) => u.userId) || [];
    const uniqueIds = [...new Set(userIds)];

    this.projectUsers = [];

    uniqueIds.forEach((id) => {
      this._ProfileService.getProfileData().subscribe({
        next: (user) => {
          this.projectUsers.push(user.result);
          this._cdr.markForCheck();
        },
        error: (err) => {
          console.error(`Error fetching user ${id}:`, err);
        },
      });
    });
  }

  getUserById(userId: number) {
    return this.projectUsers.find((u) => u.id === userId);
  }

  // ------------------ Toasts ------------------

  private showSuccessPin(): void {
    this._toaster.success(
      'The Project has been Pinned',
      'Pinned Successfully',
      this.toastOptions()
    );
  }

  private showSuccessUnPin(): void {
    this._toaster.success(
      'The Project has been UnPinned',
      'UnPinned Successfully',
      this.toastOptions()
    );
  }

  private showFail(message: string): void {
    this._toaster.error(message, 'Action Failed', this.toastOptions());
  }
}
