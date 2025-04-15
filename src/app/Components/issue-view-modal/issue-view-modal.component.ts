import { Component, inject, Inject, TemplateRef, ViewChild } from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { title } from 'process';
import { Issue } from '../../Core/interfaces/Dashboard/Issue';

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
  ],
  templateUrl: './issue-view-modal.component.html',
  styleUrl: './issue-view-modal.component.css'
})
export class IssueViewModalComponent {

  private readonly _IssueService = inject(IssueService);

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

  issue?: Issue;


  issueUpdateForm!: FormGroup;
  isEditMode = false;
  showModal = true;


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
    });

    this.loadIssue();

  }
  loadIssue(): void {
    const issueId = this.data.issueId
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
          priority: this.issue?.priority
        });

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
    this.issueUpdateForm.reset(this.issue); // Reset to original values
  }


  onSubmit() {
    if (this.issueUpdateForm.valid) {
      this.issue = this.issueUpdateForm.value;
      this.isEditMode = false;
    }

    if (this.issueUpdateForm.valid) {
      const issueData = this.issueUpdateForm.value;
      const issueId = this.data?.issueId; // Get projectId from modal data

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
    else if (this.issueUpdateForm.get('name')?.invalid) {
      // this.showError('Invalid Title');
      console.log('Invalid Title');

    } else if (this.issueUpdateForm.get('status')?.valid) {
      // this.showError('Invalid status');
    } else if (this.issueUpdateForm.get('priority')?.valid) {
      // this.showError('Invalid priority');
    } else if (this.issueUpdateForm.get('startDate')?.invalid) {
      // this.showError('Invalid start Date');
    } else if (this.issueUpdateForm.get('endDate')?.invalid) {
    } else if (this.issueUpdateForm.get('deliveredDate')?.invalid) {
      // this.showError('Invalid Delivered Date');
    } else if (this.issueUpdateForm.get('endDate')?.invalid) {
      // this.showError('Invalid End Date');
    } else {
      console.log(this.issueUpdateForm.errors);
      console.log('Form is invalid');
      // this.showError('Please fill all the fields');
      this.issueUpdateForm.markAllAsTouched();
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
}
