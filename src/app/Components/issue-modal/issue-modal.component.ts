import { Component, Inject, ChangeDetectionStrategy, signal, inject, ViewChild, TemplateRef, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
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
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      startDate: new FormControl(null),
      deadline: new FormControl(null),
      deliveredDate: new FormControl(null),
      type: new FormControl('', Validators.required),
      status: new FormControl('BackLog', Validators.required),
      priority: new FormControl('Medium', Validators.required),
      labels: new FormControl<string[]>([]),
      attachment: new FormControl(null)
    });


  }

  close(): void {
    this.dialogRef.close();
  }


  ///////////////////////////////////
  ///////////// Labels/////////////////

  add(event: MatChipInputEvent): void {
    const input = event.chipInput?.inputElement;
    const value = (event.value || '').trim();

    if (value) {
      const labels = [...this.issueForm.controls['labels'].value];
      labels.push(value);
      this.issueForm.controls['labels'].setValue(labels);
    }

    if (input) {
      input.value = '';
    }
  }


  remove(index: number): void {
    const labels = [...this.issueForm.controls['labels'].value];
    labels.splice(index, 1);
    this.issueForm.controls['labels'].setValue(labels);
  }

  edit(index: number, newValue: string): void {
    const labels = [...this.issueForm.controls['labels'].value];
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

  // submitForm() {
  //   if (this.issueForm.valid) {
  //     console.log(this.issueForm.value);
  //     const issueData = this.issueForm.value;
  //     const projectId = this.data?.projectId; // Get projectId from modal data

  //     if (!projectId) {
  //       console.error('Project ID is missing!');
  //       return;
  //     }

  //     const labels = issueData.labels?.filter((label: string) => label.trim() !== '').join(',');
  //     issueData.append('Labels', labels || '');

  //     // Attach file if selected
  //     if (this.selectedFile) {
  //       issueData.append('Attachment', this.selectedFile);
  //     }

  //     this._IssueService.createBacklogIssue(projectId, issueData).subscribe({
  //       next: (response) => {
  //         console.log('Issue created successfully:', response);
  //         this._IssueService.notifyIssueCreated();
  //         this.dialogRef.close('created'); // Close modal and return status

  //       },
  //       error: (err) => {
  //         console.error('Error creating issue:', err);
  //         this.showError('Error creating Issue');
  //       },
  //     });
  //   }
  //   else if (this.issueForm.get('title')?.invalid) {
  //     this.showError('Invalid Title');
  //     console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

  //   } else if (this.issueForm.get('status')?.invalid) {
  //     this.showError('Invalid status');
  //   } else if (this.issueForm.get('priority')?.invalid) {
  //     this.showError('Invalid priority');
  //   } else if (this.issueForm.get('startDate')?.invalid) {
  //     this.showError('Invalid start Date');
  //   } else if (this.issueForm.get('deliveredDate')?.invalid) {
  //     this.showError('Invalid Delivered Date');
  //   } else if (this.issueForm.get('deadline')?.invalid) {
  //     this.showError('Invalid End Date');
  //   } else {
  //     console.log(this.issueForm.errors);
  //     console.log('Form is invalid');
  //     this.showError('Please fill all the fields');
  //     this.issueForm.markAllAsTouched();
  //   }
  // }



  // Form submission
  submitForm(): void {
    if (this.issueForm.invalid) {
      this.handleFormErrors();
      return;
    }

    const formData = this.prepareFormData();
    const projectId = this.data.projectId;

    this._IssueService.createBacklogIssue(projectId, formData).subscribe({
      next: (response) => {
        this.toaster.success('Issue created successfully', 'Success');
        this._IssueService.notifyIssueCreated();
        this.dialogRef.close('created');
      },
      error: (err) => {
        console.error('Error creating issue:', err);
        this.showError('Error creating issue. Please try again.');
      }
    });
  }


  private prepareFormData(): FormData {
    const formData = new FormData();
    const v = this.issueForm.value;

    // Required
    formData.append('Title', v.title);
    formData.append('Type', v.type);
    formData.append('Priority', v.priority);
    formData.append('Status', v.status);
    // formData.append('IsBacklog', ); // Pascal-case if .NET

    // Optional
    if (v.description) formData.append('Description', v.description);
    formData.append('Labels', this.issueForm.value.labels.join(','));


    // Dates (ISO)
    if (v.startDate) formData.append('StartDate', new Date(v.startDate).toISOString());
    if (v.deadline) formData.append('Deadline', new Date(v.deadline).toISOString());
    if (v.deliveredDate) formData.append('DeliveredDate', new Date(v.deliveredDate).toISOString());

    // File
    if (this.selectedFile) {
      formData.append('Attachment', this.selectedFile, this.selectedFile.name);
    }

    return formData;
  }

  // Format date for API
  private formatDate(date: Date): string {
    return date.toISOString();
  }

  // Handle form validation errors
  private handleFormErrors(): void {
    const controls = this.issueForm.controls;

    if (controls['title'].invalid) {
      this.showError('Title is required');
    } else if (controls['type'].invalid) {
      this.showError('Issue type is required');
    } else if (controls['status'].invalid) {
      this.showError('Status is required');
    } else if (controls['priority'].invalid) {
      this.showError('Priority is required');
    } else {
      this.showError('Please fill all required fields');
    }

    this.issueForm.markAllAsTouched();
  }


  handleValidationErrors() {
    if (this.issueForm.get('title')?.invalid) {
      this.showError('Invalid Title');
    } else if (this.issueForm.get('status')?.invalid) {
      this.showError('Invalid Status');
    } else if (this.issueForm.get('priority')?.invalid) {
      this.showError('Invalid Priority');
    } else if (this.issueForm.get('startDate')?.invalid) {
      this.showError('Invalid Start Date');
    } else if (this.issueForm.get('deliveredDate')?.invalid) {
      this.showError('Invalid Delivered Date');
    } else if (this.issueForm.get('deadline')?.invalid) {
      this.showError('Invalid Deadline');
    } else {
      this.showError('Please fill all required fields correctly.');
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
  // ///////////////////////////////////////////
  // ***********UPLOAD********************
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.issueForm.patchValue({ attachment: this.selectedFile });
    }
  }

}