import { ProjectService } from '../../Core/Services/project.service';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Company } from '../../Core/interfaces/company/company';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../Core/Services/company.service';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectResult } from '../../Core/interfaces/project';
import { NameShortcutPipe } from '../../Core/pipes/name-shortcut.pipe';
import { PinnedService } from '../../Core/Services/pinned.service';
import { TenantResult } from '../../Core/interfaces/pinned';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-projects-card',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './all-projects-card.component.html',
  styleUrl: './all-projects-card.component.css',
})
export class AllProjectsCardComponent {
  isPinned: boolean = false;
  SelectedProjectId: number = 0;

  @Input() company!: Company;
  @Input() project!: ProjectResult;

  // injections and variables
  constructor(
    private ProjectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  private readonly _PinnedService = inject(PinnedService);
  private readonly _toaster = inject(ToastrService);

  @Output() companySelected = new EventEmitter<any>();
  @Output() projectSelected = new EventEmitter<any>();

  selectProject() {
    this.projectSelected.emit(this.project.id);
    this.SelectedProjectId = this.project.id;
  }

  copied = { code: false, url: false };

  // ------------------------------------------------------

  ngOnInit(): void {
    // this.getCompany();
    this.getProject();
    this.getPinnedProjects(); // <-- Check pin status on init
  }
  //-------------------------------------------------------
  // CSS-Style --> To add the class to the priority related to the value
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

  //-------------------------------------------------------
  copyText(text: 'code' | 'url') {
    navigator.clipboard
      .writeText(
        text === 'code' ? this.company.tenantCode : this.company.tenantUrl
      )
      .then(() => {
        this.copied[text] = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.copied[text] = false;
          this.cdr.markForCheck();
        }, 2000);
      });
  }

  isValidUrl(url: any): boolean {
    return !!(url && url !== 'string' && url.trim() !== '');
  }

  getProject() {
    // const companyId = this.route.snapshot.paramMap.get('id');
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.ProjectService.getProject(projectId).subscribe({
        next: (res) => {
          this.project = res.result;
          console.log(res.result);
        },
        error: (err) => console.error('Error fetching project details:', err),
      });
    }
  }

  // onPinProject(project: ProjectResult, event: MouseEvent) {
  //   event.stopPropagation(); // prevent triggering card animation click

  //   const projectId = project.id; // Or project.projectId depending on your model
  //   this._PinnedService.PinItem('Project', projectId).subscribe({
  //     next: (res) => {
  //       console.log('Pinned successfully:', res);
  //       this.isPinned = true;
  //     },
  //     error: (err) => {
  //       console.error('Pinning failed:', err);
  //     },
  //   });
  // }

  // UnPinProject(project: ProjectResult, event: MouseEvent) {
  //   event.stopPropagation(); // prevent triggering card animation click

  //   const projectId = project.id;
  //   this._PinnedService.UnPinItem('Project', projectId).subscribe({
  //     next: (res) => {
  //       console.log('UnPinned successfully:', res);
  //       this.isPinned = false;
  //       this.showSuccess();
  //     },
  //     error: (err) => {
  //       console.error('UnPinning failed:', err);
  //       this.showFail(err.error?.message);
  //     },
  //   });
  // }

  getPinnedProjects() {
    this._PinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        const pinnedProjects = res.result; // Adjust based on actual response structure
        const isFound = pinnedProjects.some(
          (p: any) => p.id === this.project.id
        );
        this.isPinned = isFound;
      },
      error: (err) => {
        console.error('Fetching pinned projects failed:', err);
        this.showFail(err?.error?.message || 'Failed to fetch pinned projects');
      },
    });
  }

  TogglePin(project: ProjectResult, event: MouseEvent) {
    event.stopPropagation();
    if (this.isPinned) {
      this._PinnedService.UnPinItem('Project', project.id).subscribe({
        next: (res) => {
          this.isPinned = false;
          this.showSuccessPin();
        },
        error: (err) => {
          console.error('Unpin failed:', err);
          this.showFail(err?.error?.message || 'Unpin failed');
        },
      });
    } else {
      this._PinnedService.PinItem('Project', project.id).subscribe({
        next: (res) => {
          this.isPinned = true;
          this.showSuccessUnPin();
        },
        error: (err) => {
          console.error('Pin failed:', err);
          this.showFail(err?.error?.message || 'Pin failed');
        },
      });
    }
  }

  showSuccessPin() {
    this._toaster.success(
      'The Project has been Pinned',
      'Pinned Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 10000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }
  showSuccessUnPin() {
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

  showFail(err: any) {
    this._toaster.error('err', 'Pinned Failed', {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
