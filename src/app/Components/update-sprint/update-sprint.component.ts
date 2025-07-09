import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SprintService } from '../../Core/Services/sprint.service';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-update-sprint',
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
  templateUrl: './update-sprint.component.html',
  styleUrl: './update-sprint.component.css',
})
export class UpdateSprintComponent {
  sprintForm: FormGroup;
  userId!: any;
  sprint!: any;

  constructor(
    private dialogRef: MatDialogRef<UpdateSprintComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sprintId: string },
    private _sprintService: SprintService,
    private fb: FormBuilder
  ) {
    this.sprintForm = this.fb.group({
      title: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      status: [''],
      summary: [''],
    });
  }

  ngOnInit() {
    this.getSprintDetails();
  }

  // SprintForm = new FormGroup({
  //   title: new FormControl(null, Validators.required),
  //   description: new FormControl(null),
  //   startDate: new FormControl(null, Validators.required),
  //   endDate: new FormControl(null, Validators.required),
  //   status: new FormControl('Planned', Validators.required),
  //   summary: new FormControl(null),
  // });

  close() {
    this.dialogRef.close();
  }

  selectedType: string = '';

  getSprintDetails() {
    if (this.data?.sprintId) {
      const formValue = this.sprintForm.value;
      // const formattedStartDate = this.formatDateToApi(formValue.startDate);
      // const formattedEndDate = this.formatDateToApi(formValue.endDate);
      // const sprintPayload = {
      //   ...formValue,
      //   startDate: formattedStartDate,
      //   endDate: formattedEndDate,
      // };
      this._sprintService.getSprintData(this.data.sprintId).subscribe({
        next: (res) => {
          this.sprint = res.result;
          this.sprintForm.patchValue({
            title: this.sprint.title,
            description: this.sprint.description,
            startDate: new Date(this.sprint.startDate),
            endDate: new Date(this.sprint.endDate),
            status: this.sprint.status,
            summary: this.sprint.summary,
          });
        },
        error: (err) => {
          console.error('Error fetching sprint details:', err);
        },
      });
    }
  }

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

  updateSprint() {
    if (this.sprintForm.valid) {
      const sprintData = this.sprintForm.value;
      const requestBody = {
        title: sprintData.title,
        description: sprintData.description,
        startDate: this.formatDateToApi(sprintData.startDate),
        endDate: this.formatDateToApi(sprintData.endDate),
        status: sprintData.status,
        summary: sprintData.summary,
      };

      this._sprintService
        .updateSprint(this.data.sprintId, requestBody)
        .subscribe({
          next: (res) => {
            console.log('sprint updated successfully:', res);
            this.dialogRef.close('updated');
          },
          error: (err) => {
            console.error('Error updating sprint:', err);
          },
        });
    }
  }
}
