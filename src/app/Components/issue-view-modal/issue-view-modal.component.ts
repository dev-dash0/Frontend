import { Issue } from './../../Core/interfaces/Dashboard/Issue';
import { Component, ElementRef, HostListener, inject, Inject, Input, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ModalComponent } from "../../Shared/modal/modal.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProfileData } from '../../Core/interfaces/profile';
import { ProjectService } from '../../Core/Services/project.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { SigninSignupNavbarComponent } from "../../Shared/signin-signup-navbar/signin-signup-navbar.component";
import { AssignUsersToIssueComponent } from '../assign-users-to-issue/assign-users-to-issue.component';
import { SprintService } from '../../Core/Services/sprint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Sprint } from '../../Core/interfaces/sprint';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfileService } from '../../Core/Services/profile.service';
import { UserProject } from '../../Core/interfaces/notification';
import { DashboardLoaderComponent } from "../../Shared/dashboard-loader/dashboard-loader.component";
import { SharedDeleteModalComponent } from '../../Shared/delete-modal/delete-modal.component';
import { PinnedService } from '../../Core/Services/pinned.service';


@Component({
  selector: 'app-issue-view-modal',
  standalone: true,
  imports: [ModalComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    MatOptionModule,
    MatChipsModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    AssignUsersToIssueComponent,
    MatTooltipModule, DashboardLoaderComponent],
  templateUrl: './issue-view-modal.component.html',
  styleUrl: './issue-view-modal.component.css',
  animations: [
    trigger('pulseAnimation', [
      transition(':enter', [
        animate(
          '0.8s',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.05)', offset: 0.5 }),
            style({ transform: 'scale(1)', offset: 1 })
          ])
        )
      ])
    ])
  ]

})
export class IssueViewModalComponent {
  // isModalOpen: boolean = false;

  private readonly _IssueService = inject(IssueService);
  private readonly _ProjectService = inject(ProjectService);
  private readonly _renderer = inject(Renderer2);
  private _sprintService = inject(SprintService);
  private readonly route = inject(ActivatedRoute);
  private readonly toaster = inject(ToastrService);
  private readonly _ProfileService=inject(ProfileService);
  private _router = inject(Router);
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder) {
  }

  loading: boolean = true;

  // status
  statuses = this._IssueService.statuses;

  //Priority
  Priorities = this._IssueService.Priorities;

  issue!: Issue;
  issueId?: number; //current issue id
  sprintId?:number |null;
  issueUpdateForm!: FormGroup;
  isEditMode = false;
  showModal = true;
  allUsers: UserProject[] = []; // Load this from your user service
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
  sprintsList: Sprint[] = [];
  selectedSprintId: number | null = null;

  userId!: number;
  currentUserRole: string = '';
  isRoleLoaded: boolean = false;


  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  ngOnInit() {

    this.issueUpdateForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [''],
      deadline: [''],
      deliveredDate: [''],
      type: ['', Validators.required],
      status: [''],
      priority: [''],
      labels: [[] as string[]],
      attachment: [null]

    });
   this.getCurrentUser();
    // this.loadIssue();

    this._IssueService.issueUpdated$.subscribe(() => {
      this.loadIssue(); // أو أي ميثود بتعمل refresh للبيانات
    });

    this._IssueService.assignedUsersUpdated$.subscribe((updatedIssueId) => {
      if (updatedIssueId === this.issueId) {
        this.loadIssue(); // أو أي function تعمل refresh
      }
    });
    
    // this._renderer.listen('window', 'click', () => {
    //   this.showUserDropdown = false;
    // });
  }
  loadIssue(): void {
    const issueId = this.data.issueId;

    
    this.issueId = issueId;
    this._IssueService.getIssueById(issueId).subscribe({
      next: (res) => {
        console.log('Issue fetched:', res);
        this.issue = res.result;
        this.issueId = this.issue.id;
        this.checkIfPinned();
        this.sprintId = res.result.sprintId;      
        this.selectedSprintId = this.data.issue?.sprintId ?? null;
        console.log('Sprint Id',this.sprintId);
        this.loading = false;
        if (this.issue.isBacklog) {
          this.selectedSprintId = null;
        } else {
          this.selectedSprintId = this.issue.sprintId;
        }
        

        // ✅ Populate the form after the issue is fetched
        this.issueUpdateForm.patchValue({
          title: this.issue?.title,
          description: this.issue?.description,
         startDate: this.issue?.startDate ? new Date(this.issue.startDate) : '',
  deadline: this.issue?.deadline ? new Date(this.issue.deadline) : '',
  deliveredDate: this.issue?.deliveredDate ? new Date(this.issue.deliveredDate) : '',
          type: this.issue?.type,
          status: this.issue?.status,
          priority: this.issue?.priority,
          attachment: this.issue.attachment,
          labels: this.issue?.labels ? this.issue.labels.split(',').map(l => l.trim()) : [],
          // sprintId: res.result.sprintId,
        });
        console.log('🎯 Form raw values:', this.issueUpdateForm.value);

        this.getUserJoinedToTheProject(this.issue.projectId);

        this.getAllSprints(this.issue.projectId); // for sprint dropdown in the modal 


      },
      error: (err) => {
        console.error('Error fetching issue:', err);
      },
    });
  }




  // 
  toggleEditMode() {
    this.isEditMode = true;

  }

  onCancelEdit() {
    this.isEditMode = false;
    // this.issueUpdateForm.reset(this.issue); // Reset to original values
  }

// onSubmit() {
//   if (this.issueUpdateForm.valid) {
//     this.issue = this.issueUpdateForm.value;
//     this.isEditMode = false;

//     const issueId = this.data?.issueId;
//     const issueData = new FormData();
//     const values = this.issueUpdateForm.value;

//     // Append basic fields
//     issueData.append("Title", values.title);
//     issueData.append("Description", values.description ?? "");
//     issueData.append("StartDate", values.startDate ?? "");
//     issueData.append("Deadline", values.deadline ?? "");
//     issueData.append("DeliveredDate", values.deliveredDate ?? "");
//     issueData.append("Type", values.type ?? "");
//     issueData.append("Status", values.status ?? "");
//     issueData.append("Priority", values.priority ?? "");

//     // Clean and append labels
//     const cleanedLabels = (values.labels as string[])
//       .map(label => label.trim())
//       .filter(l => !!l)
//       .filter((l, i, arr) => arr.indexOf(l) === i);

//     issueData.append('Labels', cleanedLabels.join(','));

//     // Append file if selected
//     if (this.selectedFile) {
//       issueData.append("Attachment", this.selectedFile);
//     }

//     // ✅ Append SprintId and IsBacklog based on selectedSprintId
//     if (this.selectedSprintId === null) {
//       issueData.append("IsBacklog", "true");
//       issueData.append("SprintId", ""); // optional: you can skip this if your API handles it
//     } else {
//       issueData.append("IsBacklog", "false");
//       issueData.append("SprintId", this.selectedSprintId.toString());
//     }

//     // Append optional last update date
//     issueData.append("LastUpdate", new Date().toISOString());

//     // Send the update request
//     if (!issueId) {
//       console.error('Issue ID is missing!');
//       return;
//     }

//     this._IssueService.updateIssue(issueId, issueData).subscribe({
//       next: () => {
//         console.log('Issue updated successfully');
//         this._IssueService.notifyIssueUpdated();
//         this.dialogRef.close('created');
//       },
//       error: (err) => {
//         console.error('Error updating issue:', err);
//         this.showError('Error updating issue');
//       },
//     });
//   }
// }
onSubmit(){
  if (this.issueUpdateForm.valid) {
    
    const issueId = this.data?.issueId;
    const issueData = new FormData();
    const values = this.issueUpdateForm.value;
    console.log('Raw deadline type:', typeof values.deadline);
    console.log('Raw deliveredDate value:', values.deliveredDate);
    
    issueData.append("Title", values.title);
    issueData.append("Description", values.description ?? "");
  
    const formatDateOnly = (date: Date) =>
      `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    
    if (values.startDate instanceof Date && !isNaN(values.startDate)) {
      issueData.append("StartDate", formatDateOnly(values.startDate));
    }
    
    if (values.deadline instanceof Date && !isNaN(values.deadline)) {
      issueData.append("Deadline", formatDateOnly(values.deadline));
    }
    
    if (values.deliveredDate instanceof Date && !isNaN(values.deliveredDate)) {
      issueData.append("DeliveredDate", formatDateOnly(values.deliveredDate));
    }
    
  
    issueData.append("Type", values.type ?? "");
    issueData.append("Status", values.status ?? "");
    issueData.append("Priority", values.priority ?? "");
  
    const cleanedLabels = (values.labels as string[])
      .map(label => label.trim())
      .filter(l => !!l)
      .filter((l, i, arr) => arr.indexOf(l) === i);
  
    issueData.append('Labels', cleanedLabels.join(','));
  
    if (this.selectedFile) {
      issueData.append("Attachment", this.selectedFile);
    }
  
    if (this.selectedSprintId === null) {
      issueData.append("IsBacklog", "true");
      issueData.append("SprintId", "");
    } else {
      issueData.append("IsBacklog", "false");
      issueData.append("SprintId", this.selectedSprintId.toString());
    }
  
    issueData.append("LastUpdate", new Date().toISOString());
  console.log(issueData.get('StartDate'));
  
  console.log("🔎 FormData contents:");
  (issueData as FormData).forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
  
  
    this._IssueService.updateIssue(issueId, issueData).subscribe({
      next: () => {
        console.log('Issue updated successfully');
        this._IssueService.notifyIssueUpdated();
        this.dialogRef.close('created');
      },
      error: (err) => {
        console.error('Error updating issue:', err);
        this.showError('Error updating issue');
      },
    });
  }
  
}

  close(): void {
    this.dialogRef.close();
    // this.showModal = false;

  }
  handleModalClose() {
    if (this.isEditMode) {
      this.onCancelEdit();
    } else {
      this.close();
    }
  }

  getStatusConfig(status: string | undefined) {
    return this.statuses.find(s => s.value.toLowerCase() === status?.toLowerCase());
  }

  getStatusBadgeClass(status: string | undefined): string {
    const config = this.getStatusConfig(status);
    return config?.colorClass ?? 'text-muted';
  }
  // //////////////////////////////////////////////////////////////////////////////
  //********************Assigning users*************************************


  //Get All joined users in the project the issue created in.
  getUserJoinedToTheProject(issueProjectId: number) {
    return this._ProjectService.getProject(issueProjectId).subscribe(
      {
        next: (res) => {
          this.allUsers = res.result?.userProjects as UserProject[] ?? [];
          const userProject = this.allUsers.find(user => user.userId === this.userId);
          this.currentUserRole = userProject?.role ?? '';
          this.isRoleLoaded = true;
          
    

      console.log('Current Role:', this.currentUserRole);
      console.log('All Users:', this.allUsers);
      
        },
        error: (err) => {
          console.error("Error Assigning User", err);
        }
      }
    )
  }
  // //////////////////////////////////////////////////////////////////////
  // /upload 
  readonly addOnBlur = true;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.issueUpdateForm.patchValue({ attachment: this.selectedFile });
    }
  }
  ///////////// Labels/////////////////
  readonly separatorKeysCodes: number[] = [13, 188]; // Enter, Comma

  add(event: MatChipInputEvent): void {
    const input = event.chipInput?.inputElement;
    const value = (event.value || '').trim();

    if (value) {
      const labels = [...this.issueUpdateForm.controls['labels'].value];
      labels.push(value);
      this.issueUpdateForm.controls['labels'].setValue(labels);
    }

    if (input) {
      input.value = '';
    }
  }


  remove(index: number): void {
    const labels = [...this.issueUpdateForm.controls['labels'].value];
    labels.splice(index, 1);
    this.issueUpdateForm.controls['labels'].setValue(labels);
  }

  edit(index: number, newValue: string): void {
    const labels = [...this.issueUpdateForm.controls['labels'].value];
    const trimmed = newValue.trim();

    if (!trimmed || labels.includes(trimmed)) return; // prevent duplicates / empty

    labels[index] = trimmed;
    this.issueUpdateForm.controls['labels'].setValue(labels);
    this.issueUpdateForm.controls['labels'].updateValueAndValidity(); // force update
  }


  limitLabelLength(event: KeyboardEvent, index: number): void {
    if (this.issueUpdateForm.controls['labels'].value[index]?.length >= 100) {
      event.preventDefault();
    }
  }
  // ///////////////////////////////////////////////
  getFileIcon(url: string): string {
    const ext = url.split('.').pop()?.toLowerCase() ?? '';

    switch (ext) {
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'doc':
      case 'docx': return 'fa-file-word text-primary';
      case 'xls':
      case 'xlsx': return 'fa-file-excel text-success';
      case 'ppt':
      case 'pptx': return 'fa-file-powerpoint text-warning';
      case 'zip':
      case 'rar': return 'fa-file-zipper text-muted';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
      case 'svg': return 'fa-file-image text-info';
      default: return 'fa-file text-secondary';
    }
  }

  getFileName(url: string): string {
    return url.split('/').pop() ?? 'Attachment';
  }
  downloadAttachment(url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = this.getFileName(url);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }



  // ////////////////////////////
  get issueHasValidLabels(): boolean {
    return typeof this.issue?.labels === 'string' && this.issue.labels.trim() !== '';
  }
  // ////////////////////////////////////////////////////////////////
  getPriorityStyle(priority: string) {
    return { color: this.priorityConfig[priority]?.color || 'white' };
  }

  getPriorityIcon(priority: string) {
    return this.priorityConfig[priority]?.icon || 'assets/icons/default.svg'; // Default icon
  }
// /////////////////////////////////////////////////////////////////////
// **********Assign Issue to Sprint **********

getAllSprints(projectId: number) {
  console.log('Getting sprints for project:', projectId);

  this._ProjectService.getProject(projectId).subscribe({
    next: (res) => {
      this._sprintService.getAllSprints(res.result.id).subscribe({
        next: (res) => {
          this.sprintsList = res.result.map((sprint: Sprint) => ({
            ...sprint,
            startDate: this.dateFormatter(sprint.startDate),
            endDate: this.dateFormatter(sprint.endDate),
          }));
        },
        error: (err) => {
          console.error('Failed to load sprints:', err);
        }
      });
    },
    error: (err) => {
      console.error('Failed to load project:', err);
    }
  });
}


onSprintChange() {
  const issueId = this.data.issueId;

  const issueData = new FormData();

  const selectedSprint = this.sprintsList.find(s => s.id === this.selectedSprintId);
  if (selectedSprint?.status === 'Canceled') {
    this.showError("You can't move the issue to a canceled sprint.");
    this.selectedSprintId = null;
    return;
  }

// 🟢 Issue Data
  issueData.append("Title", this.issue.title ?? '');
  issueData.append("Description", this.issue.description ?? '');
  issueData.append("StartDate", this.issue.startDate ?? '');
  issueData.append("Deadline", this.issue.deadline ?? '');
  issueData.append("Type", this.issue.type ?? '');
  issueData.append("Status", this.issue.status ?? '');
  issueData.append("Priority", this.issue.priority ?? '');
  issueData.append("Labels", this.issue.labels ?? '');

  // 🟢 SprintId & isBacklog
  if (this.selectedSprintId === null) {
    issueData.append("IsBacklog", "true");   // Send to backlog
    issueData.append("SprintId", "");        // SprintId should be empty
  } else {
    issueData.append("IsBacklog", "false");  // Assigned to a sprint
    issueData.append("SprintId", this.selectedSprintId.toString());
  }


  if (this.selectedFile) {
    issueData.append("Attachment", this.selectedFile);
  }

  issueData.append("LastUpdate", new Date().toISOString());

  this._IssueService.updateIssue(issueId, issueData).subscribe({
    next: () => {
      this.showSuccess('Issue moved successfully');
      this.dialogRef.close('updated');
      this._IssueService.notifyIssueMoved();

    },
    error: (err) => {
      this.showError(err);
    }
  });
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
getSprintNameById(id: number): string {
  const sprint = this.sprintsList.find(s => s.id === id);
  return sprint ? sprint.title : 'Unknown Sprint';
}

getSprintTooltip(id: number): string {
  const sprint = this.sprintsList.find(s => s.id === id);
  if (sprint) {
    return `${sprint.title}: ${sprint.startDate} → ${sprint.endDate}`;
  }
  return '';
}

////////////////////////////////////////////////
/***************Toaster******************** */

showError(err: string) {
  this.toaster.error(err, 'Error Message', {
    toastClass: 'toast-pink',
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing',
  });
}
showSuccess(Message:string){
  this.toaster.success(Message, 'Success Message', {
    toastClass: 'toast-pink',
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing',
  });
}

////////////////////////////////////////////////
/***************Navigate To The Sprint******************** */

viewSprint(sprintId: any,projectId: any): void {
  this.dialogRef.close(); //close the modal first before navigating 
  setTimeout(() => {

    if (sprintId) {
      this._router.navigate(['/MyDashboard/Sprint', sprintId]); //Navigate to the sprint page if the sprintId is provided
    } else {
      this._router.navigate(['/MyDashboard/Project',projectId ]); //Navigate to the project page if the sprintId is not provided 
    }
  }, 0);
}

////////////////////////////////////////////////
/***************Role Based Access******************** */
getCurrentUser() {
  this._ProfileService.getProfileData().subscribe({
    next: (user) => {
      this.userId = user.id;
      this.loadIssue();
    },
    error: (err) => console.error('Error fetching profile:', err)
  });
}
// ***************Delete Issue ****************
private dialog = inject(MatDialog);
private _toaster = inject(ToastrService);

openDeleteIssueModal(issueId: number, issueTitle: string) {
  const hideConfirm = localStorage.getItem('hideDeleteConfirm');

  const handleDeletion = () => {
    this._IssueService.deleteIssue(issueId).subscribe({
      next: () => {
        this.showSuccessDelete();
        this._IssueService.notifyIssueDeleted();
        this.dialogRef.close('deleted'); // Close the modal after deletion
      },
      error: (err) => {
        console.error('Error deleting issue:', err);
        this.showFailDelete(err.error?.message || 'Failed to delete issue');
      }
    });
  };

  if (hideConfirm === 'true') {
    handleDeletion();
    return;
  }

  const dialogRef = this.dialog.open(SharedDeleteModalComponent, {
    width: '450px',
    data: {
      title: 'Delete Issue',
      message: `Are you sure you want to delete the issue "${issueTitle}"?`,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      itemId: issueId,
      deleteFunction: (id: number) => {
        return this._IssueService.deleteIssue(id); 
      }
      
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === 'deleted') {
      this.showSuccessDelete();
      this._IssueService.notifyIssueDeleted();
      this.dialogRef.close('deleted'); // Close the Issue modal after deletion
    } else {
      this.showFailDelete('Deletion was cancelled');
    }
  });
}


showSuccessDelete() {
  this._toaster.success(
    'The issue deleted successfully',
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
  this._toaster.error('err', 'Deletion Failed', {
    toastClass: 'toast-pink',
    timeOut: 10000,
    closeButton: true,
    progressBar: true,
    progressAnimation: 'decreasing',
  });
}


// ***************Pin Issue ****************
private readonly _PinnedService = inject(PinnedService);

isPinned = false; // current pin status

togglePin() {
  if (!this.issue?.id) return;

  const itemType = 'issue';
  const itemId = this.issue.id;

  if (this.isPinned) {
    this._PinnedService.UnPinItem(itemType, itemId).subscribe({
      next: () => {
        this.isPinned = false;
        this.showSuccess("Issue unpinned successfully");
      },
      error: (err) => {
        this.showError("Failed to unpin issue");
        console.error(err);
      }
    });
  } else {
    this._PinnedService.PinItem(itemType, itemId).subscribe({
      next: () => {
        this.isPinned = true;
        this.showSuccess("Issue pinned successfully");
      },
      error: (err) => {
        this.showError("Failed to pin issue");
        console.error(err);
      }
    });
  }
}


checkIfPinned() {
  const itemId = this.issue?.id; 
  if (!itemId) return;

  this._PinnedService.getPinnedIssues().subscribe({
    next: (res) => {
      console.log('pinnedItems',res);
      const pinnedItems = res.result || [];
      this.isPinned = pinnedItems.some((item: any) => item.id === itemId);
    },
    error: (err) => {
      console.error("Error checking pinned issues:", err);
    }
  });
}





}