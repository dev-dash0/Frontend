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
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SprintService } from '../../Core/Services/sprint.service';
import { ActivatedRoute } from '@angular/router';
export interface Label {
  name: string;
}

@Component({
  selector: 'app-sprint-modal',
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
  templateUrl: './sprint-modal.component.html',
  styleUrl: './sprint-modal.component.css',
})
export class SprintModalComponent {
  constructor(
    private dialogRef: MatDialogRef<SprintModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: string },
    private _sprintService: SprintService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.data); // ✅ Access the passed data
  }

  SprintForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null),
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
    status: new FormControl('Planned', Validators.required),
    // priority: new FormControl(null, Validators.required),
    summary: new FormControl(null),
  });

  close() {
    this.dialogRef.close();
  }

  selectedType: string = '';

  createSprint() {
    const formValue = this.SprintForm.value;
    if (!formValue.startDate || !formValue.endDate) {
      console.error('Start date or end date is missing');
      return;
    }
    const formattedStartDate = this.formatDateToApi(formValue.startDate);
    const formattedEndDate = this.formatDateToApi(formValue.endDate);
    const sprintPayload = {
      ...formValue,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    if (this.SprintForm.valid) {
      this._sprintService
        .createSprint(sprintPayload, this.data.projectId)
        .subscribe({
          next: (res) => {
            console.log(res);
            this._sprintService.notifySprintCreated();
            this.dialogRef.close(res);
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }
  // status
  // selectedStatus = 'backlog'; // Default selected status

  statuses = [
    {
      value: 'Planned',
      label: 'Planned',
      icon: 'assets/images/Issue Status/todo.svg',
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      icon: 'assets/images/Issue Status/in-progress.svg',
    },
    {
      value: 'Completed',
      label: 'Completed',
      icon: 'assets/images/Issue Status/Completed.svg',
    },
  ];

  formatDateToApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Submit Form
  submitForm() {
    if (this.SprintForm.valid) {
      console.log('Form submitted:', this.SprintForm.value);
    }
  }
}
