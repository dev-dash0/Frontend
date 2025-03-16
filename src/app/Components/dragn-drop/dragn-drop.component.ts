import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ControlContainer, FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dragn-drop',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dragn-drop.component.html',
  styleUrl: './dragn-drop.component.css',
})
export class FiledropComponent implements OnInit {
  @Input() label: string = '';
  @Input() allowedExtensions: string[] = [];
  @Input() allowMultipleFiles: boolean = false;
  @Input() imagePath: string = ''; // New input for an initial image
  @Input() formControlName!: string; // ✅ Use formControlName instead

  @Output() onFilesDropped: EventEmitter<FileList> =
    new EventEmitter<FileList>();

  allowedList: string | null = 'null';
  incorrectInput: boolean = false;
  errorMessage: string = '';
  files: File[] = [];

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.allowedList =
      this.allowedExtensions.length > 0
        ? this.allowedExtensions.join(', ')
        : 'any';
  }

  onFiledrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.handleDrop(e.dataTransfer.files);
  }

  onFileSelected(e: any) {
    this.handleDrop(e.target.files);
  }

  private handleDrop(files: FileList) {
    this.errorMessage = '';
    this.incorrectInput = false;
    this.files = [];

    // ❌ Prevent multiple files if not allowed
    this.incorrectInput = !this.allowMultipleFiles && files.length > 1;
    if (this.incorrectInput) {
      this.errorMessage = 'Only one file can be specified';
      return;
    }

    // ❌ Validate file extensions
    this.incorrectInput = !this.validateExtensions(files);
    if (this.incorrectInput) {
      this.errorMessage = 'Incorrect extension noticed';
      return;
    }

    // ✅ Convert FileList to an array and update component state
    this.files = Array.from(files);

    // ✅ Get the form control from the parent FormGroup using formControlName
    const formGroup = this.controlContainer.control as FormGroup;
    if (formGroup && this.formControlName) {
      formGroup.get(this.formControlName)?.setValue(this.files);
      formGroup.get(this.formControlName)?.markAsTouched(); // Mark as touched
      formGroup.get(this.formControlName)?.markAsDirty(); // Mark as dirty for validation
    }

    // ✅ Emit files to parent component if needed
    this.onFilesDropped.emit(files);
  }

  private validateExtensions(files: FileList): boolean {
    if (this.allowedExtensions.length === 0) {
      return true;
    }

    const extensions = Array.from(files).map(
      (file) => file.name.split('.').pop()?.toLowerCase() || ''
    );

    return extensions.every((ext) => this.allowedExtensions.includes(ext));
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
