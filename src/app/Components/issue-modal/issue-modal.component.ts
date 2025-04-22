import { Component, Inject, ChangeDetectionStrategy, signal, inject, ViewChild, TemplateRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ModalComponent } from '../../Shared/modal/modal.component';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
export interface Label {
  name: string;
}
@Component({
  selector: 'app-issue-modal',
  standalone: true,
  imports: [
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
    ModalComponent,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './issue-modal.component.html',
  styleUrl: './issue-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueModalComponent {
  @ViewChild('issueContent', { static: true }) issueContent!: TemplateRef<any>;
  issueForm: FormGroup;
  isBacklog: Boolean = true;
  readonly separatorKeysCodes: number[] = [13, 188]; // Enter, Comma
  readonly addOnBlur = true;
  private readonly _IssueService = inject(IssueService);
  // private readonly router = inject(Router);
  private readonly toaster = inject(ToastrService);

  ngOnInit(): void {
    // if (!this.issueContent) {
    //   console.error('issueContent template is not defined!');
    // } else {
    //   console.log('issueContent is loaded:', this.issueContent);
    // }
  }


  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.issueForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
      startDate: new FormControl(''),
      deadline: new FormControl(''),
      deliveredDate: new FormControl(''),
      type: new FormControl('', Validators.required),
      status: new FormControl('BackLog'), // Default value
      priority: new FormControl('Medium'), // Default value
      // labels: new FormControl([]) // Initialize as an empty array
    });

  }

  close(): void {
    this.dialogRef.close();
  }


  ///////////////////////////////////
  ///////////// Labels/////////////////

  add(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      const labels = this.issueForm.controls['labels'].value;
      labels.push(value);
      this.issueForm.controls['labels'].setValue(labels);
    }
    event.chipInput!.clear();
  }

  remove(index: number): void {
    const labels = this.issueForm.controls['labels'].value;
    labels.splice(index, 1);
    this.issueForm.controls['labels'].setValue(labels);
  }

  edit(index: number, newValue: string): void {
    const labels = this.issueForm.controls['labels'].value;
    labels[index] = newValue.trim();
    this.issueForm.controls['labels'].setValue(labels);
  }

  limitLabelLength(event: KeyboardEvent, index: number): void {
    if (this.issueForm.controls['labels'].value[index]?.length >= 100) {
      event.preventDefault();
    }
  }
  // ///////////////////////////////////////////////
  // status
  statuses = this._IssueService.statuses;

  //Priority
  Priorities = this._IssueService.Priorities;

  submitForm() {
    if (this.issueForm.valid) {
      const issueData = this.issueForm.value;
      const projectId = this.data?.projectId; // Get projectId from modal data

      if (!projectId) {
        console.error('Project ID is missing!');
        return;
      }
      this._IssueService.createBacklogIssue(projectId, issueData).subscribe({
        next: (response) => {
          console.log('Issue created successfully:', response);
          this._IssueService.notifyIssueCreated();
          this.dialogRef.close('created'); // Close modal and return status
        },
        error: (err) => {
          console.error('Error creating issue:', err);
          this.showError('Error creating Issue');
        },
      });
    }
    else if (this.issueForm.get('title')?.invalid) {
      this.showError('Invalid Title');
      console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

    } else if (this.issueForm.get('status')?.invalid) {
      this.showError('Invalid status');
    } else if (this.issueForm.get('priority')?.invalid) {
      this.showError('Invalid priority');
    } else if (this.issueForm.get('startDate')?.invalid) {
      this.showError('Invalid start Date');
    } else if (this.issueForm.get('deliveredDate')?.invalid) {
      this.showError('Invalid Delivered Date');
    } else if (this.issueForm.get('deadline')?.invalid) {
      this.showError('Invalid End Date');
    } else {
      console.log(this.issueForm.errors);
      console.log('Form is invalid');
      this.showError('Please fill all the fields');
      this.issueForm.markAllAsTouched();
    }
  }

  showError(err: string) {
    this.toaster.error(err, 'Error Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }


}
