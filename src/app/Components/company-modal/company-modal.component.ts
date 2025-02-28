import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { FiledropComponent } from '../dragn-drop/dragn-drop.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [FormsModule, FiledropComponent],
  templateUrl: './company-modal.component.html',
  styleUrl: './company-modal.component.css',
})
export class AddCompanyModalComponent {
  close: boolean = false;
  companyForm: FormGroup;

  // constructor(private fb: FormBuilder) {
  //   this.companyForm = this.fb.group({
  //     companyName: ['', Validators.required],
  //     websiteURL: [
  //       '',
  //       [Validators.required, Validators.pattern('https?://.+')],
  //     ],
  //     profileImage: [''],
  //     keywords: ['', Validators.required],
  //     description: ['', Validators.required],
  //   });
  // }
  constructor(
    private dialogRef: MatDialogRef<AddCompanyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      websiteURL: [
        '',
        [Validators.required, Validators.pattern('https?://.+')],
      ],
      profileImage: [''],
      keywords: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      console.log('Company Data:', this.companyForm.value);
    } else {
      console.log('Form is invalid');
    }
  }

  closeModal() {
    console.log('Close modal');
    this.close = true;
  }

  // isDragging = false;
  // uploadedFiles: File[] = [];

  // onDragOver(event: DragEvent) {
  //   event.preventDefault();
  //   this.isDragging = true;
  // }

  // onDragLeave(event: DragEvent) {
  //   event.preventDefault();
  //   this.isDragging = false;
  // }

  // onDrop(event: DragEvent) {
  //   event.preventDefault();
  //   this.isDragging = false;

  //   if (event.dataTransfer && event.dataTransfer.files) {
  //     const files = Array.from(event.dataTransfer.files);
  //     this.handleFiles(files);
  //   }
  // }

  // onFileSelect(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files) {
  //     const files = Array.from(input.files);
  //     this.handleFiles(files);
  //   }
  // }

  // handleFiles(files: File[]) {
  //   this.uploadedFiles = [...this.uploadedFiles, ...files];
  //   console.log('Files:', this.uploadedFiles);
  //   // Add logic to upload files to the server if needed
  // }
}
