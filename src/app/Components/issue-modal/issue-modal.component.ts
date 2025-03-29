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
  private readonly router = inject(Router);


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
  statuses = [
    { value: 'BackLog', label: 'Backlog', icon: 'assets/images/Issue Status/backlog.svg' },
    { value: 'to do', label: 'To Do', icon: 'assets/images/Issue Status/todo.svg' },
    { value: 'In Progress', label: 'In Progress', icon: 'assets/images/Issue Status/in-progress.svg' },
    { value: 'Reviewing', label: 'Reviewing', icon: 'assets/images/Issue Status/reviewing.svg' },
    { value: 'Completed', label: 'Completed', icon: '../../assets/images/Issue Status/Completed.svg' },
    { value: 'Canceled', label: 'Canceled', icon: 'assets/images/Issue Status/canceled.svg' },
    { value: 'Postponed', label: 'Postponed', icon: 'assets/images/Issue Status/postponed.svg' }
  ];

  //Priority
  Priorities = [
    { value: 'Low', label: 'Low', icon: 'assets/images/Issue Priorities/low.svg' },
    { value: 'Medium', label: 'Normal', icon: 'assets/images/Issue Priorities/normal.svg' },
    { value: 'High', label: 'High', icon: 'assets/images/Issue Priorities/high.svg' },
    { value: 'Critical', label: 'Urgent', icon: 'assets/images/Issue Priorities/urgent.svg' },
  ];

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
          // this._snackBar.open('Issue created successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close('created'); // Close modal and return status
        },
        error: (err) => {
          console.error('Error creating issue:', err);
          // this._snackBar.open('Failed to create issue. Try again!', 'Close', { duration: 3000 });
        },
      });
    } else {
      console.log('Form is invalid');
      // this._snackBar.open('Please fill all required fields!', 'Close', { duration: 3000 });
    }
  }



}
