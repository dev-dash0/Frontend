import { Issue } from './../../Core/interfaces/Dashboard/Issue';
import { Component, ElementRef, HostListener, inject, Inject, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ModalComponent } from "../../Shared/modal/modal.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
import { AssignUsersToIssueComponent } from "../assign-users-to-issue/assign-users-to-issue.component";

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
    ReactiveFormsModule, SigninSignupNavbarComponent, AssignUsersToIssueComponent],
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

  private readonly _IssueService = inject(IssueService);
  private readonly _ProjectService = inject(ProjectService);
  private readonly _renderer = inject(Renderer2);
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
  issueUpdateForm!: FormGroup;
  isEditMode = false;
  showModal = true;
  allUsers: ProfileData[] = []; // Load this from your user service


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

    this.loadIssue();

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
        this.loading = false;

        // ✅ Populate the form after the issue is fetched
        this.issueUpdateForm.patchValue({
          title: this.issue?.title,
          description: this.issue?.description,
          startDate: this.issue?.startDate,
          deadline: this.issue?.deadline,
          deliveredDate: this.issue?.deliveredDate,
          type: this.issue?.type,
          status: this.issue?.status,
          priority: this.issue?.priority,
          attachment: this.issue.attachment,
          // labels: this.issue?.labels,
          labels: this.issue?.labels ? this.issue.labels.split(',').map(l => l.trim()) : [],

        });
        this.getUserJoinedToTheProject(this.issue.projectId);


      },
      error: (err) => {
        console.error('Error fetching issue:', err);
      },
    });
  }



  toggleEditMode() {
    this.isEditMode = true;

  }

  onCancelEdit() {
    this.isEditMode = false;
    // this.issueUpdateForm.reset(this.issue); // Reset to original values
  }


  onSubmit() {
    if (this.issueUpdateForm.valid) {
      this.issue = this.issueUpdateForm.value;
      this.isEditMode = false;

      const issueId = this.data?.issueId; // Get projectId from modal data
      // const issueData = this.issueUpdateForm.value;
      const issueData = new FormData();
      const values = this.issueUpdateForm.value;

      // Append fields manually with PascalCase keys
      issueData.append("Title", values.title);
      issueData.append("Description", values.description ?? "");
      issueData.append("StartDate", values.startDate ?? "");
      issueData.append("Deadline", values.deadline ?? "");
      issueData.append("DeliveredDate", values.deliveredDate ?? "");
      issueData.append("Type", values.type ?? "");
      issueData.append("Status", values.status ?? "");
      issueData.append("Priority", values.priority ?? "");

      // Append labels
      // Clean up labels: trim + remove duplicates + filter out empty
      // instead of: values.labels.forEach(...)
      const cleanedLabels = (values.labels as string[])
        .map(label => label.trim())
        .filter(l => !!l)
        .filter((l, i, arr) => arr.indexOf(l) === i);

      issueData.append('Labels', cleanedLabels.join(','));

      // Append file if selected
      if (this.selectedFile) {
        issueData.append("Attachment", this.selectedFile);
      }

      // Set sprintId manually based on current issue
      // issueData.sprintId = (this.issue.sprintId === 0) ? null : this.issue.sprintId;


      if (!issueId) {
        console.error('Project ID is missing!');
        return;
      }
      this._IssueService.updateIssue(issueId, issueData).subscribe({
        next: () => {
          console.log('Issue updated successfully:');
          this._IssueService.notifyIssueCreated();
          this.dialogRef.close('created'); // Close modal and return status
        },
        error: (err) => {
          console.error('Error creating issue:', err);
          // this.showError('Error creating Issue');
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
          this.allUsers = res.result?.userProjects ?? [];
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

}
