import { Component, Inject, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule, } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProjectService } from '../../Core/Services/project.service';
import { ToastrService } from 'ngx-toastr';
export interface Label {
  name: string;
}

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatChipsModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css',
})
export class ProjectModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  private readonly _ProjectService = inject(ProjectService);
  private readonly toastr = inject(ToastrService);

  // --------- Variables ---------- \\
  CompanyId: string | null = '';

  ngOnInit() {
    console.log(this.data); // ✅ Access the passed data
    this.CompanyId = localStorage.getItem('CompanyId');
  }

  ProjectForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    startDate: new FormControl<string | null>(null),
    endDate: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null, Validators.required),
    priority: new FormControl<string | null>(null, Validators.required),
  });

  close() {
    this.dialogRef.close();
  }

  selectedType: string = '';

  // status
  selectedStatus = 'Planning'; // Default selected status

  statuses = [
    {
      value: 'Planning',
      label: 'Planning',
      icon: 'assets/images/Issue Status/todo.svg',
    },
    {
      value: 'Reviewing',
      label: 'Reviewing',
      icon: 'assets/images/Issue Status/reviewing.svg',
    },
    {
      value: 'Working on',
      label: 'Working on',
      icon: 'assets/images/Issue Status/in-progress.svg',
    },
    {
      value: 'Completed',
      label: 'Completed',
      icon: '../../assets/images/Issue Status/Completed.svg',
    },
    {
      value: 'Canceled',
      label: 'Canceled',
      icon: 'assets/images/Issue Status/canceled.svg',
    },
    {
      value: 'Postponed',
      label: 'Postponed',
      icon: 'assets/images/Issue Status/postponed.svg',
    },
  ];

  //Priority
  selectedPriority = 'Low'; // Default selected status

  Priorities = [
    {
      value: 'Low',
      label: 'Low',
      icon: 'assets/images/Issue Priorities/low.svg',
    },
    {
      value: 'Medium',
      label: 'Normal',
      icon: 'assets/images/Issue Priorities/normal.svg',
    },
    {
      value: 'High',
      label: 'High',
      icon: 'assets/images/Issue Priorities/high.svg',
    },
    {
      value: 'Critical',
      label: 'Urgent',
      icon: 'assets/images/Issue Priorities/urgent.svg',
    },
  ];

  // Submit Form
  submitForm() {
    if (this.ProjectForm.valid) {
      console.log('Form submitted:', this.ProjectForm.value);
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  showError(err: string) {
    this.toastr.error(err, 'Error Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  onDateChange1(event: any) {
    if (event.value) {
      const date = new Date(event.value);
      const formattedDate = date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
      this.ProjectForm.patchValue({
        startDate: formattedDate,
      });
    }
  }

  onDateChange2(event: any) {
    if (event.value) {
      const date = new Date(event.value);
      const formattedDate = date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
      this.ProjectForm.patchValue({
        endDate: formattedDate,
      });
    }
  }

  sendData() {
    if (this.ProjectForm.valid) {
      this._ProjectService
        .CreateProject(this.CompanyId, this.ProjectForm.value)
        .subscribe({
          next: (response) => {
            console.log('Project created successfully:', response);
            console.log(this.CompanyId);
            this.close();
            window.location.reload();
          },
          error: (error) => {
            console.error('Error creating project:', error);
            console.log(this.ProjectForm.get('name'));
            console.log(this.ProjectForm.get('status'));
            console.log(this.ProjectForm.get('priority'));
            console.log(this.ProjectForm.get('startDate'));
            console.log(this.ProjectForm.get('endDate'));
            this.showError('Error creating project');
          },
        });
    } else if (this.ProjectForm.get('name')?.invalid) {
      this.showError('Invalid Title');
    } else if (this.ProjectForm.get('status')?.valid) {
      this.showError('Invalid status');
    } else if (this.ProjectForm.get('priority')?.valid) {
      this.showError('Invalid priority');
    } else if (this.ProjectForm.get('startDate')?.invalid) {
      this.showError('Invalid startDate');
    } else if (this.ProjectForm.get('endDate')?.invalid) {
      this.showError('Invalid endDate');
    } else {
      // console.log(this.ProjectForm.errors);
      // console.log(this.ProjectForm.value);
      this.showError('Please fill all the fields');
      this.ProjectForm.markAllAsTouched();
    }
  }
}

