import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { UpdateService } from '../../Core/Services/update.service';
import { Router } from '@angular/router';
import { FiledropComponent } from "../dragn-drop/dragn-drop.component";

@Component({
  selector: 'app-update-info',
  standalone: true,
  imports: [ReactiveFormsModule, FiledropComponent],
  templateUrl: './update-info.component.html',
  styleUrl: './update-info.component.css',
})
export class UpdateInfoComponent {
  constructor(
    private dialogRef: MatDialogRef<UpdateInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  private readonly _UpdateService = inject(UpdateService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  ngOnInit() {
    console.log(this.data); // ✅ Access the passed data
  }

  UpdateInfoForm = new FormGroup({
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    userName: new FormControl(null),
    imageUrl: new FormControl(null),
    phoneNumber: new FormControl(null),
    birthday: new FormControl(null),
  });

  sendData() {
    if (this.UpdateInfoForm.valid) {
      this._UpdateService.UpdateInfo(this.UpdateInfoForm.value).subscribe({
        next: (res) => {
          // if (res.message == 'success') {
          console.log('Tmaaaam');
          // this.close();
        },
        error: (err) => {
          console.log('ERRRRRRRRR');
          // this.errorMessage = err.error.message;
          // this.isBtnSubmit = false;
        },
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  // Submit Form
  submitForm() {
    if (this.UpdateInfoForm.valid) {
      console.log('Form submitted:', this.UpdateInfoForm.value);
    }
  }
}
