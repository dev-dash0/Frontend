import { Component, Inject } from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    console.log(this.data); // ✅ Access the passed data
  }

  ProjectForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null,),
    status: new FormControl(null, Validators.required),
    priority: new FormControl(null, Validators.required),
  })

  close() {
    this.dialogRef.close();
  }

  selectedType: string = '';

  // status
  selectedStatus = 'backlog'; // Default selected status

  statuses = [
    { value: 'planing', label: 'Planning', icon: 'assets/images/Issue Status/todo.svg' },
    { value: 'reviewing', label: 'Reviewing', icon: 'assets/images/Issue Status/reviewing.svg' },
    { value: 'working-on', label: 'Working on', icon: 'assets/images/Issue Status/in-progress.svg' },
    { value: 'completed', label: 'Completed', icon: '../../assets/images/Issue Status/Completed.svg' },
    { value: 'canceled', label: 'Canceled', icon: 'assets/images/Issue Status/canceled.svg' },
    { value: 'postponed', label: 'PostPoned', icon: 'assets/images/Issue Status/postponed.svg' }
  ];

  //Priority
  selectedPriority = 'backlog'; // Default selected status

  Priorities = [
    { value: 'low', label: 'Low', icon: 'assets/images/Issue Priorities/low.svg' },
    { value: 'normal', label: 'Normal', icon: 'assets/images/Issue Priorities/normal.svg' },
    { value: 'high', label: 'High', icon: 'assets/images/Issue Priorities/high.svg' },
    { value: 'urgent', label: 'Urgent', icon: 'assets/images/Issue Priorities/urgent.svg' },
  ];


  // Submit Form 
  submitForm() {
    if (this.ProjectForm.valid) {
      console.log('Form submitted:', this.ProjectForm.value);
    }
  }

}

