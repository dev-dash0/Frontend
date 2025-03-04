import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateService } from '../../Core/Services/update.service';
import { Router } from '@angular/router';
import { signupValidators } from '../../Shared/validators/validators.component';

@Component({
  selector: 'app-update-pass',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-pass.component.html',
  styleUrl: './update-pass.component.css',
})
export class UpdatePassComponent {
  constructor(
    private dialogRef: MatDialogRef<UpdatePassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  private readonly _UpdateService = inject(UpdateService);
  private readonly _Router = inject(Router);

  ngOnInit() {
    console.log(this.data); // ✅ Access the passed data
  }

  UpdatePassForm = new FormGroup({
    currentPassword: new FormControl(null, signupValidators.password),
    newPassword: new FormControl(null, signupValidators.password),
  });

  sendData() {
    if (this.UpdatePassForm.valid) {
      this._UpdateService.UpdatePass(this.UpdatePassForm.value).subscribe({
        next: (res) => {
          // if (res.message == 'success') {
          console.log('Tmaaaam');
          this.close();
          this._Router.navigate(['/signin']);
          // }
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
    if (this.UpdatePassForm.valid) {
      console.log('Form submitted:', this.UpdatePassForm.value);
    }
  }
}
