import { ChangeDetectorRef, Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SideMenuComponent } from "../../Shared/side-menu/side-menu.component";
import { SearchBarComponent } from "../../Shared/search-bar/search-bar.component";
import { AllIssuesDashboardComponent } from "../all-issues-dashboard/all-issues-dashboard.component";
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
import { ToastrService } from 'ngx-toastr';
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
import { log } from 'console';
import { DashboardLoaderComponent } from "../../Shared/dashboard-loader/dashboard-loader.component";

@Component({
  selector: 'app-project-over-view',
  standalone: true,
  imports: [
    AllIssuesDashboardComponent,
    CommonModule,
    SigninSignupNavbarComponent,
    AssignUsersToIssueComponent,
    DashboardLoaderComponent
],
  templateUrl: './project-over-view.component.html',
  styleUrl: './project-over-view.component.css',
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
  loading:boolean = true;
  issueStatus: string = '';
  issueStatusConfig: any
  priorityConfig: any = {
    Critical: {
      icon: 'assets/images/Issue Priorities/urgent.svg',
      color: '#F44336',
    }, // Red
    High: { icon: 'assets/images/Issue Priorities/high.svg', color: '#FFC107' }, // Orange
    Medium: {
      icon: 'assets/images/Issue Priorities/normal.svg',
      color: '#4854F1',
    }, // Yellow
    Low: { icon: 'assets/images/Issue Priorities/low.svg', color: '#908F8F' }, // Green
  };

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
  private cdr=inject(ChangeDetectorRef);

  @ViewChildren('sprintCard') sprintCards!: QueryList<ElementRef>;

  // ngOnInit(): void {
  //   // Get The Id from the Path
  //   this.ProjectId = this.route.snapshot.paramMap.get('id');

  //   this.sidebarService.isCollapsed$.subscribe((collapsed) => {
  //     this.isSidebarCollapsed = collapsed;
  //   });

  //   this.GetProjectData();

  //   this.getPinnedProjects();

  //   // Listen for new issue events and refresh backlog
  //   this.RefreshBacklogAfterAddingIssue();
  //   // Get Project id from url
  //   this.getProjectId(); //for issue

  //   this._sprintService.sprintCreated$.subscribe(() => {
  //     this.getAllSprints();
  //   });

  //   this._IssueService.issueUpdated$.subscribe(() => {
  //     this.fetchBacklogIssues(); //for refreshing after issue updated
  //   });

  //   this._IssueService.assignedUsersUpdated$.subscribe((updatedIssueId) => {
  //     // لو الـ issue المتحدث تابع للمشروع الحالي، اعملي refresh
  //     if (this.projectIdNum) {
  //       this.fetchBacklogIssues(); // ✅ تحديث تلقائي للـ backlog
  //       this.getAllSprints(); // ✅ كمان لو عايزة تحدث السبرنتس
  //     }
  //   });

  //   // add the sprint with ai without refresh
  //   this.state.sprintAdded$.subscribe((sprint) => {
  //     if (sprint) {
  //       // this.sprints.push(sprint); // أو أي طريقة عرض عند
  //       }})
  // }

  ngOnInit(): void {
    // Get The Id from the Path
    this.ProjectId = this.route.snapshot.paramMap.get('id');

    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });

    this.GetProjectData();

    this.getPinnedProjects();

    this.getAllSprints();

    // Listen for new issue events and refresh backlog
    this.RefreshBacklogAfterAddingIssue();
    // Get Project id from url
    this.getProjectId(); //for issue

    this._sprintService.sprintCreated$.subscribe(() => {
      this.getAllSprints();
    });

    this._sprintService.sprintUpdated$.subscribe(() => {
      this.getAllSprints();
    });

    this._projectService.projectUpdated$.subscribe(() => {
      this.GetProjectData();
      this.getAllSprints();
      this.getProjectId();
    });

    this.route.paramMap.subscribe(() => {
      this.GetProjectData();
      this.getAllSprints();
      this.getProjectId();
    });

    this._IssueService.issueUpdated$.subscribe(() => {
      this.fetchBacklogIssues(); //for refreshing after issue updated
    });

    this._IssueService.assignedUsersUpdated$.subscribe((updatedIssueId) => {
      // لو الـ issue المتحدث تابع للمشروع الحالي، اعملي refresh
      if (this.projectIdNum) {
        this.fetchBacklogIssues(); // ✅ تحديث تلقائي للـ backlog
        this.getAllSprints(); // ✅ كمان لو عايزة تحدث السبرنتس
      }
    });


    // add the sprint with ai without refresh
    this.state.sprintAdded$.subscribe((sprint) => {
      if (sprint) {
        const formattedSprint = {
          ...sprint,
          startDate: this.dateFormatter(sprint.startDate),
          endDate: this.dateFormatter(sprint.endDate),
        };

        setTimeout(() => {
          const lastSprint = this.sprintCards.last;
          if (lastSprint) {
            lastSprint.nativeElement.classList.add('highlight-sprint');
            lastSprint.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });

            // remove the animation class after it's done
            setTimeout(() => {
              lastSprint.nativeElement.classList.remove('highlight-sprint');
            }, 1500);
          }
        }, 100);
        

        this.sprintDetails.push(formattedSprint);

      }
    });
  }

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
    const projectId = this.route.snapshot.paramMap.get('id');
    this.dialog.open(SprintModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '70vw',
      minHeight: '60vh',
      maxHeight: '90vh',
      data: { projectId },
    });
  }

  openDeleteIssueModal(issueId: number, issueTitle: string) {
    const hideConfirm = localStorage.getItem('hideDeleteConfirm');
    if (hideConfirm === 'true') {
      this._IssueService.RemoveIssue(issueId);
      setTimeout(() => {
        this.fetchBacklogIssues(); // ✅ Ensures backlog refreshes after deletion
      }, 100); // Small delay to ensure delete operation finishes
      return;
    }

    const dialogRef = this.dialog.open(SharedDeleteModalComponent, {
      width: '450px',
      data: {
        title: 'Delete Issue',
        message: `Are you sure you want to delete ${issueTitle}issue? `,
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        itemId: issueId,
        deleteFunction: (id: number) => this._IssueService.RemoveIssue(id), // Pass function reference
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deleted') {
        console.log('Issue deleted successfully');
        // this.dialogService.showDeletionSuccess();  //Want to show toaster
        // this.showSuccess();
        // this._IssueService.showSuccess();
        this.fetchBacklogIssues();
      } else {
        // this.fetchBacklogIssues();
        console.log('Deletion canceled');
      }
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
  GetProjectData() {
    const ProjectId = this.route.snapshot.paramMap.get('id');
    // this.ProjectId = ProjectId;
    this._projectService.getProject(ProjectId).subscribe({
      next: (res) => {
        this.ProjectDetails = res.result;
        console.log('Project Details',this.ProjectDetails);
        this.loadProjectUsers();
        this.loading=false
        this._ProfileService.getProfileData().subscribe({
          next: (user) => {
            if (
              user.id == res.result.tenant?.owner.id ||
              user.id == res.result.creator.id
            ) {
              this.isOwner = true;
            }
                // if (res.result.userProjects.id == user.userId) {
                //   this.ProjectMembers.push = user;
                //   console.log(this.ProjectMembers);
                // }
                // if (res.owner.id !== user.userId || res.creat.id !== user.userId) {
                //   this.isOwner = false; // hide delete button
                // } else {
                //   this.isOwner = true; // show delete button
                // }
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
  fetchBacklogIssues(): void {
    console.log('Fetching backlog issues for project ID:', this.projectIdNum);
    this._IssueService.getBacklogIssues(this.projectIdNum, 0, 1).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          console.log('backlog issues', res);
          this.backlogIssues = res.result;
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

        // بعد ما المودال يفتح (يمكن تستخدم setTimeout لتأخير بسيط لو حصل تأخير في انشاء الـ ViewChild)
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
  getAllSprints() {
    const ProjectId = this.route.snapshot.paramMap.get('id');
    this._projectService.getProject(ProjectId).subscribe({
      next: (res) => {
        this._sprintService.getAllSprints(res.result.id).subscribe({
          next: (res) => {
            console.log('Sprints in project view',res);


            // let completedCount = 0;
            // let totalCount = 0;

            // //count the number of completed issues in each sprint
            // res.result.forEach((sprint: any) => {
            //   sprint.issues?.forEach((issue: any) => {
            //     totalCount++;
            //     if (issue.status=== 'Completed') {
            //       completedCount++;
            //     }
            //   });
            // });
  
            // //store the number of completed issues in the sprintDetails array
            // this.issuesCompleted = completedCount;
            // this.totalIssues = totalCount;

            // //get the completion percentage of the sprint
            // this.completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            // this.sprintDetails = res.result.map((sprint: Sprint) => ({
            //   ...sprint,
            //   startDate: this.dateFormatter(sprint.startDate),
            //   endDate: this.dateFormatter(sprint.endDate),
            // }));

            // for (let i = 0; i < res.result(0).issues.length; i++) {
            //   if (res.result(0).issue(i).status == 'Completed') {
            //     // var Counter = 0
            //     // Counter ++
            //     this.issuesCompleted = Number(this.issuesCompleted);
            //     this.issuesCompleted++;
            //     this.issuesCompleted = this.issuesCompleted.toString();
            //     console.log('CompletedIssues' + this.issuesCompleted);
            //   }
            // }

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
            
              const completionPercentage = total > 0 ? (completed / total) * 100 : 0;
            
              return {
                ...sprint,
                startDate: this.dateFormatter(sprint.startDate),
                endDate: this.dateFormatter(sprint.endDate),
                totalIssues: total,
                completedIssues: completed,
                progress: completionPercentage, // 💡 ده اللي هتستخدميه في progress bar
              }as SprintWithProgress;
            });
            
          },
        });
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

  // -----------------------------------------------------------
  // pin & unpin
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

  getPinnedProjects() {
    this._PinnedService.getPinnedProjects().subscribe({
      next: (res) => {
        const pinnedProjects = res.result; // Adjust based on actual response structure
        const isFound = pinnedProjects.some(
          (p: any) => p.id === this.ProjectId
        );
        this.isPinned = isFound;
      },
      error: (err) => {
        console.error('Fetching pinned projects failed:', err);
        this.showFail(err?.error?.message || 'Failed to fetch pinned projects');
      },
    });
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


  // -----------------------------------------------------------
  // Get Project Users
  loadProjectUsers() {
    this._projectService.getProject(this.ProjectId).subscribe({
      next: (res) => {
        const joinedUsers = res.result?.tenant.joinedUsers || [];
        const userProjects = res.result?.userProjects || [];
  
        this.ProjectMembers = joinedUsers.map((user: any) => {
        
          const matchedProject = userProjects.find((proj: any) => proj.userId === user.id);
  
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            imageUrl: user.imageUrl,
            role: matchedProject?.role || 'Unknown'
          };
        });
  
        console.log('Project users with roles:', this.ProjectMembers);
      },
      error: (err) => {
        console.error('Error loading project users', err);
      }
    });
  }
  
  // -----------------------------------------------------------
    // copy function
    copied = { code: false, url: false };
    copyText(text: 'code' | 'url') {
      navigator.clipboard
        .writeText(
          text === 'code' ? this.ProjectDetails?.projectCode || '' : ''
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
