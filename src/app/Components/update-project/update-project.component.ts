import { Component, inject, Inject, Renderer2, TemplateRef, ViewChild } from '@angular/core';
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
import { CommonModule, NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ProjectService } from '../../Core/Services/project.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from '../../Shared/modal/modal.component';
import { Project } from '../../Core/interfaces/project';

@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css',
})
export class UpdateProjectComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {}

  @ViewChild('UpdateModal') UpdateModal!: TemplateRef<any>;

  private readonly _ProjectService = inject(ProjectService);
  private readonly toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);

  // --------- Variables ---------- \\

  ProjectForm = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    startDate: new FormControl<string | null>(null),
    endDate: new FormControl<string | null>(null),
    status: new FormControl<string | null>(null, Validators.required),
    priority: new FormControl<string | null>(null, Validators.required),
  });

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

  ngOnInit() {
    this.ProjectId = this.data?.projectId || this.route.snapshot.params['id'];
    console.log(this.ProjectId);

    this.loadProjectData();
  }

  // Submit Form
  submitForm() {
    if (this.ProjectForm.valid) {
      console.log('Form submitted:', this.ProjectForm.value);
    }
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

  showSuccess() {
    this.toastr.success('','Project updated successfully', {
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

  close() {
    this.dialogRef.close();
  }

  loading: boolean = true;
  projectData: Project[] = [];
  ProjectId: number | null = null; //current project id
  isEditMode = false;
  showModal = true;
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

  toggleEditMode() {
    this.isEditMode = true;
  }

  onCancelEdit() {
    this.isEditMode = false;
  }

  loadProjectData() {
    this._ProjectService.getProject(this.ProjectId).subscribe({
      next: (res) => {
        this.projectData = res.result;
        console.log(this.projectData);
        // Patch the form values instead of the template
        this.ProjectForm.patchValue({
          name: res.result.name,
          description: res.result.description,
          startDate: res.result.startDate,
          endDate: res.result.endDate,
          status: res.result.status,
          priority: res.result.priority,
        });
        console.log(' Project Data Loaded');
      },
    });
  }

  onSubmit() {
      if (this.ProjectForm.valid && this.ProjectId) {
        const projectData = {
          ...this.ProjectForm.value,
          id: this.ProjectId // Include the project ID
        };
    
        this._ProjectService.updateProject(this.ProjectId, projectData).subscribe({
          next: (res) => {
            this.showSuccess()
            console.log(res);
            this.close();
            setTimeout(() => {
              window.location.reload();
            }, 3000); 
          },
          error: (err) => {
            this.showError(err.error.message);
            console.error('Update error:', err);
          }
        });
      }
  }

  handleModalClose() {
    if (this.isEditMode) {
      this.onCancelEdit();
    } else {
      this.close();
    }
  }

  getStatusConfig(status: string | undefined) {
    return this.statuses.find(
      (s) => s.value.toLowerCase() === status?.toLowerCase()
    );
  }

}
