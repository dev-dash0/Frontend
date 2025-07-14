import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileService } from '../../Core/Services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _Router: Router
  ) {}
  private readonly _ProfileService = inject(ProfileService);
  RemoveAccount() {
    this._ProfileService.RemoveAccount().subscribe({
      next: (res) => {
        console.log(res);
        this.close();
        this.showSuccess();
        localStorage.clear();
        this._Router.navigate(['/signin']);
      },
    });
  }
  close() {
    this.dialogRef.close();
  }

  showSuccess() {
    this.toastr.success(
      'This account has been removed',
      'Removed Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 10000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }
}
