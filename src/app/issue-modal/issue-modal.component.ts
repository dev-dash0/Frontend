import { Component, Inject, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
    NgFor,
    MatOptionModule,
    MatChipsModule,
    MatButtonToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './issue-modal.component.html',
  styleUrl: './issue-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueModalComponent {
  constructor(
    private dialogRef: MatDialogRef<IssueModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
  }

  issueForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    description: new FormControl(null,),
    issueType: new FormControl(null,),
    status: new FormControl(null, Validators.required),
    priority: new FormControl(null, Validators.required),
  })

  close() {
    this.dialogRef.close();
  }

  selectedType: string = '';
  issueTypes: string[] = ['Bug', 'Feature', 'Task', 'Epic'];


  ///////////////////////////////////
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly labels = signal<Label[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add label
    if (value) {
      this.labels.update(labels => [...labels, { name: value }]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(label: Label): void {
    this.labels.update(labels => {
      const index = labels.indexOf(label);
      if (index < 0) {
        return labels;
      }

      labels.splice(index, 1);
      this.announcer.announce(`Removed ${label.name}`);
      return [...labels];
    });
  }

  edit(label: Label, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove label if it no longer has a name
    if (!value) {
      this.remove(label);
      return;
    }

    // Edit existing label
    this.labels.update(labels => {
      const index = labels.indexOf(label);
      if (index >= 0) {
        labels[index].name = value;
        return [...labels];
      }
      return labels;
    });
  }
  // ///////////////////////////////////////////////
  // status
  selectedStatus = 'backlog'; // Default selected status

  statuses = [
    { value: 'backlog', label: 'Backlog', icon: 'assets/images/Issue Status/backlog.svg' },
    { value: 'todo', label: 'ToDo', icon: 'assets/images/Issue Status/todo.svg' },
    { value: 'in-progress', label: 'In Progress', icon: 'assets/images/Issue Status/in-progress.svg' },
    { value: 'reviewing', label: 'Reviewing', icon: 'assets/images/Issue Status/reviewing.svg' },
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
    if (this.issueForm.valid) {
      console.log('Form submitted:', this.issueForm.value);
    }
  }

}
