import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SideMenuComponent } from '../../Shared/side-menu/side-menu.component';
import { SearchBarComponent } from '../../Shared/search-bar/search-bar.component';
import { AllIssuesDashboardComponent } from '../all-issues-dashboard/all-issues-dashboard.component';
import { CommonModule } from '@angular/common';
import { SidebarService } from './../../Core/Services/sidebar.service';
import { ProjectService } from '../../Core/Services/project.service';
import {
  fetchedProjectDetails,
  ProjectResult,
} from '../../Core/interfaces/project';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileData } from '../../Core/interfaces/profile';
import { ProfileService } from '../../Core/Services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../Core/Services/dialog.service';
import { IssueService } from '../../Core/Services/issue/issue.service';
import {
  IndividualConfig,
  ProgressAnimationType,
  ToastrService,
} from 'ngx-toastr';
import { SprintService } from '../../Core/Services/sprint.service';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { SprintModalComponent } from '../sprint-modal/sprint-modal.component';
import { SharedDeleteModalComponent } from '../../Shared/delete-modal/delete-modal.component';
import { Sprint, SprintWithProgress } from '../../Core/interfaces/sprint';
import { Issue } from '../../Core/interfaces/Dashboard/Issue';
import { PinnedService } from '../../Core/Services/pinned.service';
import { AssignUsersToIssueComponent } from '../assign-users-to-issue/assign-users-to-issue.component';
import { SigninSignupNavbarComponent } from '../../Shared/signin-signup-navbar/signin-signup-navbar.component';
import { UpdateProjectComponent } from '../update-project/update-project.component';
import { ProjectStateService } from '../../Core/Services/project-state.service';
import { DashboardLoaderComponent } from '../../Shared/dashboard-loader/dashboard-loader.component';
import { ProjectVisitService } from '../../Core/Services/project-visit.service';
import { InviteModalComponent } from '../project-invite-modal/project-invite-modal.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-project-over-view',
  standalone: true,
  imports: [
    AllIssuesDashboardComponent,
    CommonModule,
    SigninSignupNavbarComponent,
    AssignUsersToIssueComponent,
    DashboardLoaderComponent,
  ],
  templateUrl: './project-over-view.component.html',
  styleUrl: './project-over-view.component.css',
  animations: [
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate(
          '700ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class ProjectOverViewComponent {
  // variables
  isSidebarCollapsed = true;
  isMenuOpen = true;
  parentActiveCard: number = 0;
  projectIdNum!: number; //for issue-apis usage
  ProjectId: any = 0;
  ProjectDetails?: fetchedProjectDetails;
  ProjectMembers: ProfileData[] = [];
  isOwner: boolean = false;
  sprintDetails: SprintWithProgress[] = [];
  issue?: Issue;
  backlogIssues: Issue[] = [];
  issuesCompleted: string | number = '';
  totalIssues: number = 0;
  completionPercentage: number = 0;
  isPinned = false;
  issueLabelsList = [];
  loading: boolean = true;
  issueStatus: string = '';
  issueStatusConfig: any;
  isPinLoading: boolean = false;
  priorityConfig: any = {
    Critical: {
      icon: 'assets/images/Issue Priorities/urgent.svg',
      color: '#F44336',
    }, // Red
    High: { icon: 'assets/images/Issue Priorities/high.svg', color: '#D07805' }, // Orange
    Medium: {
      icon: 'assets/images/Issue Priorities/normal.svg',
      color: '#4854F1',
    }, // Yellow
    Low: { icon: 'assets/images/Issue Priorities/low.svg', color: '#908F8F' }, // Green
  };

  @Input() project!: ProjectResult;

  private dialogService = inject(DialogService);
  private dialog = inject(MatDialog);
  private sidebarService = inject(SidebarService);
  private readonly _projectService = inject(ProjectService);
  private readonly _ProfileService = inject(ProfileService);
  private _IssueService = inject(IssueService);
  private _sprintService = inject(SprintService);
  private _PinnedService = inject(PinnedService);
  private _toaster = inject(ToastrService);
  private _router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly state = inject(ProjectStateService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.ProjectId = id;
        this.projectIdNum = +id;
        this.GetProjectData();
        this.getAllSprints();
        this.fetchBacklogIssues();
        this.getPinnedProjects();
      }
    });

    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this._sprintService.sprintCreated$.subscribe(() => {
      this.getAllSprints();
    });

    this._projectService.projectUpdated$.subscribe(() => {
      this.GetProjectData();
      this.getAllSprints();
    });

    this._IssueService.issueUpdated$.subscribe(() => {
      this.fetchBacklogIssues(); //for refreshing after issue updated
    });
    this._IssueService.issueDeleted$.subscribe(() => {
      this.fetchBacklogIssues(); //for refreshing after issue deleted
    });

    this._IssueService.assignedUsersUpdated$.subscribe(() => {
      this.fetchBacklogIssues();
      this.getAllSprints();
    });

    this._IssueService.issueMoved$.subscribe(() => {
      this.fetchBacklogIssues();
    });

    this.state.sprintAdded$.subscribe((sprint) => {
      if (sprint) {
        this.sprintDetails.push({
          ...sprint,
          startDate: this.dateFormatter(sprint.startDate),
          endDate: this.dateFormatter(sprint.endDate),
        });

        setTimeout(() => {
          const lastSprint = this.sprintCards.last;
          if (lastSprint) {
            lastSprint.nativeElement.classList.add('highlight-sprint');
            lastSprint.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            setTimeout(() => {
              lastSprint.nativeElement.classList.remove('highlight-sprint');
            }, 1500);
          }
        }, 100);
      }
    });

    // ✅ 🆕 تحديث الباكلوج تلقائيًا عند إنشاء issue من الـ AI
    this.state.issueAdded$.subscribe((issue) => {
      if (issue) {
        this.fetchBacklogIssues();
      }
    });

    this.getPinnedProjects(); // لازم تتنده بعد ProjectId يتحدد
    // this.isPinned = this.ProjectDetails?.isPinned ?? false;
  }

  private readonly _ProjectVisitService = inject(ProjectVisitService);

  @ViewChildren('sprintCard') sprintCards!: QueryList<ElementRef>;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onCardClicked(cardIndex: number) {
    this.parentActiveCard = cardIndex;
  }

  // In parent component
  @ViewChild(AllIssuesDashboardComponent)
  dashboardComponent!: AllIssuesDashboardComponent;

  cards = [{ projectId: 116 }];

  moveCardToBack(index: number) {
    const card = this.cards.splice(index, 1)[0];
    this.cards.push(card);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  // --------------------------------------------------
  // modals
  openCreateIssue() {
    // this.dialogService.openIssueModal(this.projectIdNum);
    const dialogRef = this.dialog.open(IssueModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw', // Limits width to 70% of viewport
      minHeight: '60vh',
      data: { projectId: this.projectIdNum, message: 'project' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'created') {
        this.fetchBacklogIssues(); // Refresh the backlog issues
      }
    });
  }
  openIssueView(issueId: number) {
    this.dialogService.openIssueViewModal(issueId);
  }

  openSprint() {
    // const projectId = this.route.snapshot.paramMap.get('id');
    const projectId = this.projectIdNum;

    this.dialog.open(SprintModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw',
      minHeight: '60vh',
      maxHeight: '90vh',
      data: { projectId },
    });
  }

  // openDeleteIssueModal(issueId: number, issueTitle: string) {
  //   const hideConfirm = localStorage.getItem('hideDeleteConfirm');
  //   if (hideConfirm === 'true') {
  //     this._IssueService.RemoveIssue(issueId);
  //     setTimeout(() => {
  //       this.fetchBacklogIssues(); // ✅ Ensures backlog refreshes after deletion
  //     }, 100); // Small delay to ensure delete operation finishes
  //     return;
  //   }

  //   const dialogRef = this.dialog.open(SharedDeleteModalComponent, {
  //     width: '450px',
  //     data: {
  //       title: 'Delete Issue',
  //       message: `Are you sure you want to delete ${issueTitle}issue? `,
  //       confirmText: 'Confirm',
  //       cancelText: 'Cancel',
  //       itemId: issueId,
  //       deleteFunction: (id: number) => this._IssueService.RemoveIssue(id), // Pass function reference
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result === 'deleted') {
  //       // this.dialogService.showDeletionSuccess();  //Want to show toaster
  //       this.showSuccessDelete();
  //       // this._IssueService.showSuccess();
  //       console.log('Issue deleted successfully');
  //       this.fetchBacklogIssues();
  //     } else {
  //       // this.fetchBacklogIssues();
  //       console.log('Deletion canceled');
  //     }
  //   });
  // }

  openDeleteIssueModal(issueId: number, issueTitle: string) {
    const hideConfirm = localStorage.getItem('hideDeleteConfirm');

    const deleteAndRefresh = () => {
      this._IssueService.deleteIssue(issueId).subscribe({
        next: () => {
          this.showSuccessDelete();
          this._IssueService.notifyIssueDeleted();
          console.log('Issue deleted and backlog refreshed');
          this._IssueService.notifyIssueDeleted();
          this.fetchBacklogIssues();
        },
        error: (err) => {
          console.error('Failed to delete issue:', err);
          this.showFailDelete(err.error?.message || 'Failed to delete issue');
        },
      });
    };

    if (hideConfirm === 'true') {
      deleteAndRefresh();
      return;
    }

    const dialogRef = this.dialog.open(SharedDeleteModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Issue',
        message: `Are you sure you want to delete "${issueTitle}" issue?`,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        itemId: issueId,
        deleteFunction: (id: number) => {
          return this._IssueService.deleteIssue(id);
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deleted') {
        this.showSuccessDelete();
        // this.fetchBacklogIssues();
        this._IssueService.notifyIssueDeleted();
      } else {
        this.showFailDelete('Deletion canceled or failed');
      }
    });
  }

  showSuccessDelete() {
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

  showFailDelete(err: any) {
    this._toaster.error('err', 'Pinned Failed', {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
  openDeleteProjectModal(projectId: number, projectTitle: string) {
    const dialogRef = this.dialog.open(SharedDeleteModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete ${projectTitle}Project? `,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        itemId: projectId,
        deleteFunction: () => this.deleteProject(), // Pass function reference
      },
    });
  }

  openUpdateProject() {
    this.dialogService.openUpdateProjModal(this.projectIdNum);
  }

  // ---------------------------------------------------

  // Projects Api
  // GetProjectData() {
  //   const ProjectId = this.route.snapshot.paramMap.get('id');
  //   // this.ProjectId = ProjectId;
  //   this._projectService.getProject(ProjectId).subscribe({
  //     next: (res) => {
  //       console.log('Project fetched:', res);
  //       this.ProjectDetails = res.result;
  //       this._ProfileService.getProfileData().subscribe({
  //         next: (user) => {
  //           if (
  //             user.id == res.result.tenant?.owner.id ||
  //             user.id == res.result.creator.id
  //           ) {
  //             this.isOwner = true;
  //           }
  //           //     if (res.result.userProjects.id == user.userId) {
  //           //       this.ProjectMembers.push = user;
  //           //       console.log(this.ProjectMembers);
  //           //     }
  //           //     if (res.owner.id !== user.userId || res.creat.id !== user.userId) {
  //           //       this.isOwner = false; // hide delete button
  //           //     } else {
  //           //       this.isOwner = true; // show delete button
  //           //     }
  //         },
  //       });
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
  GetProjectData() {
    this._projectService.getProject(this.ProjectId).subscribe({
      next: (res) => {
        this.ProjectDetails = res.result;
        console.log('Project Details', this.ProjectDetails);
        this.loadProjectUsers();
        this.loading = false;

        this._ProfileService.getProfileData().subscribe({
          next: (user) => {
            if (
              user.id == res.result.tenant?.owner.id ||
              user.id == res.result.creator.id
            ) {
              this.isOwner = true;
            }
          },
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateProject() {}

  deleteProject() {
    // this.openDeleteProjectModal(
    //   Number(this.ProjectId),
    //   this.ProjectDetails!.name
    // );
    this._projectService.deleteProject(this.ProjectId).subscribe({
      next: (res) => {
        this._router.navigate([
          'MyDashboard/Company',
          this.ProjectDetails?.tenantId,
        ]);
        console.log('Project deleted:', res);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      },
      error(err) {
        console.log(err);
      },
    });
  }

  // ---------------------------------------------------

  // ---------------------------------------------------

  // issues Api
  // fetchBacklogIssues(): void {
  //   console.log('Fetching backlog issues for project ID:', this.projectIdNum);
  //   this._IssueService.getBacklogIssues(this.projectIdNum, 0, 1).subscribe({
  //     next: (res) => {
  //       if (res.isSuccess) {
  //         console.log('backlog issues', res);
  //         this.backlogIssues = res.result;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching backlog issues:', err);
  //     },
  //   });
  // }

  fetchBacklogIssues(): void {
    if (!this.projectIdNum) {
      console.warn('⚠️ projectIdNum is undefined!');
      return;
    }
    this._IssueService.getBacklogIssues(this.projectIdNum, 0, 1).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // console.log('backlog issues', res);
          this.backlogIssues = [...res.result];
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error fetching backlog issues:', err);
      },
    });
  }

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
  @ViewChild(AssignUsersToIssueComponent)
  assignUsersComp!: AssignUsersToIssueComponent;
  isModalOpen: boolean = false;

  // *************Issue From issue-api**********************
  getProjectId() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.projectIdNum = +id;
        this.fetchBacklogIssues();
        this._IssueService.issueMoved$.subscribe(() => {
          this.fetchBacklogIssues(); // أو getBacklogIssues / getSprintIssues
        });
      }
    });
  }

  RefreshBacklogAfterAddingIssue() {}
  // ---------------------------------------------------

  // Sprints Api
  // getAllSprints() {
  //   const ProjectId = this.route.snapshot.paramMap.get('id');
  //   this._projectService.getProject(ProjectId).subscribe({
  //     next: (res) => {
  //       this._sprintService.getAllSprints(res.result.id).subscribe({
  //         next: (res) => {
  //           console.log(res);
  //           this.sprintDetails = res.result.map((sprint: Sprint) => ({
  //             ...sprint,
  //             startDate: this.dateFormatter(sprint.startDate),
  //             endDate: this.dateFormatter(sprint.endDate),
  //           }));
  //           // for (let i = 0; i < res.result(0).issues.length; i++) {
  //           //   if (res.result(0).issue(i).status == 'Completed') {
  //           //     // var Counter = 0
  //           //     // Counter ++
  //           //     this.issuesCompleted = Number(this.issuesCompleted);
  //           //     this.issuesCompleted++;
  //           //     this.issuesCompleted = this.issuesCompleted.toString();
  //           //     console.log('CompletedIssues' + this.issuesCompleted);
  //           //   }
  //           // }
  //         },
  //       });
  //     },
  //   });
  // }
  getAllSprints() {
    if (!this.projectIdNum) {
      console.warn('⚠️ projectIdNum is undefined!');
      return;
    }

    console.log('📦 Sprint API projectIdNum:', this.projectIdNum);

    this._sprintService.getAllSprints(this.projectIdNum).subscribe({
      next: (res) => {
        this.sprintDetails = res.result.map((sprint: any) => {
          let completed = 0;
          let total = 0;

          if (Array.isArray(sprint.issues)) {
            sprint.issues.forEach((issue: any) => {
              total++;
              if (issue.status?.trim().toLowerCase() === 'completed') {
                completed++;
              }
            });
          }

          const completionPercentage =
            total > 0 ? (completed / total) * 100 : 0;

          return {
            ...sprint,
            startDate: this.dateFormatter(sprint.startDate),
            endDate: this.dateFormatter(sprint.endDate),
            totalIssues: total,
            completedIssues: completed,
            progress: completionPercentage,
          } as SprintWithProgress;
        });
      },
      error: (err) => {
        console.error('❌ Error loading sprints:', err);
      },
    });
  }

  viewSprint(sprintId: any): void {
    this._router.navigate(['/MyDashboard/Sprint', sprintId]);
  }

  // ---------------------------------------------------
  // normal functions

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

  getPriorityStyle(priority: string) {
    return { color: this.priorityConfig[priority]?.color || 'white' };
  }

  getPriorityIcon(priority: string) {
    return this.priorityConfig[priority]?.icon || 'assets/icons/default.svg'; // Default icon
  }
  getPriorityBorderStyle(priority: string) {
    const color = this.priorityConfig[priority]?.color || 'transparent';
    return {
      borderLeft: `6px solid ${color}`,
    };
  }
  //--------// -----------------------------------------------------------
  // pin & unpin

  //------------ Pinned Part --------------------
  getPinnedProjects(): void {
    this._PinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        const pinnedProjects = res.result;
        const myProjectId = this.ProjectDetails?.id || this.ProjectId;

        this.isPinned = pinnedProjects.some((p: any) => p.id === myProjectId);
        console.log('✅ isPinned =', this.isPinned); // 🟢 أضيفي ده للتأكد
      },
      error: (err) => {
        console.error('Fetching pinned projects failed:', err);
        this.showFail(err?.error?.message || 'Failed to fetch pinned projects');
      },
    });
  }

  TogglePin(event: MouseEvent): void {
    event.stopPropagation();

    const itemId = this.ProjectDetails?.id;
    if (!itemId) {
      this.showFail('Project ID is missing!');
      return;
    }

    console.log('📌 TogglePin clicked. isPinned =', this.isPinned); // 🟢

    if (this.isPinned) {
      this._PinnedService.UnPinItem('Project', itemId).subscribe({
        next: () => {
          this.isPinned = false;
          this.showSuccessUnPin();
        },
        error: (err) => {
          console.error('❌ Unpin failed:', err);
          this.showFail(err?.error?.message || 'Unpin failed');
        },
      });
    } else {
      this._PinnedService.PinItem('Project', itemId).subscribe({
        next: () => {
          this.isPinned = true;
          this.showSuccessPin();
        },
        error: (err) => {
          console.error('❌ Pin failed:', err);
          this.showFail(err?.error?.message || 'Pin failed');
        },
      });
    }
  }

  // ------------------ Toasts ------------------

  private toastOptions(): Partial<IndividualConfig> {
    return {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing' as ProgressAnimationType, // ✅ fixed
    };
  }
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
  //-----------// -------------------------------------------------------
  // Get Project Users
  //-----------// -------------------------------------------------------
  // Get Project Users
  loadProjectUsers() {
    this._projectService.getProject(this.ProjectId).subscribe({
      next: (res) => {
        const joinedUsers = res.result?.tenant.joinedUsers || [];
        const userProjects = res.result?.userProjects || [];

        // رجّع بس الناس المشاركين فعلياً في المشروع
        this.ProjectMembers = joinedUsers
          .filter((user: any) =>
            userProjects.some((proj: any) => proj.userId === user.id)
          )
          .map((user: any) => {
            const matchedProject = userProjects.find(
              (proj: any) => proj.userId === user.id
            );

            return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              imageUrl: user.imageUrl,
              role: matchedProject?.role || 'Unknown',
            };
          });
      },
    });
  }

  // -----------------------------------------------------------
  // invite members into the Project
  openInviteModal(): void {
    this.dialog.open(InviteModalComponent, {
      data: { type: 'project', projectId: this.ProjectId },
      panelClass: 'invite-dialog-panel',
      backdropClass: 'blurred-backdrop',
    });
  }

  // -----------------------------------------------------------
  // copy function
  copied = { code: false, url: false };
  copyText(text: 'code' | 'url') {
    navigator.clipboard
      .writeText(text === 'code' ? this.ProjectDetails?.projectCode || '' : '')
      .then(() => {
        this.copied[text] = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.copied[text] = false;
          this.cdr.markForCheck();
        }, 2000);
      });
  }

  // -----------------------------------------------------------
  // Get Priority Class
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'low':
        return 'low-tag';
      case 'medium':
        return 'medium-tag';
      case 'high':
        return 'high-tag';
      case 'critical':
        return 'critical-tag';
      default:
        return '';
    }
  }
}
