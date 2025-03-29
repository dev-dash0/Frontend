import { Component, inject, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { IssueService } from '../../Core/Services/issue/issue.service';
import { DialogService } from '../../Core/Services/dialog.service';
import { FormsModule } from '@angular/forms';


export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  itemId?: number; // The ID of the item to delete
  deleteFunction?: (id: number) => any; // Function to call when confirming
}


@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class SharedDeleteModalComponent {
  dontShowAgain = false;
  constructor(
    public dialogRef: MatDialogRef<SharedDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    // private toastr: ToastrService,
    private _DialogService: DialogService,
  ) { }

  onConfirm(): void {
    if (this.dontShowAgain) {
      localStorage.setItem('hideDeleteConfirm', 'true'); // ✅ Store preference
    }

    if (this.data.deleteFunction && this.data.itemId !== undefined) {
      this.data.deleteFunction(this.data.itemId);
      this._DialogService.showDeletionSuccess();
    }
    this.dialogRef.close('deleted');
  }

  onCancel(): void {
    this.dialogRef.close('canceled');
  }

  // showSuccess() {
  //   this.toastr.success(
  //     'The item has been removed',
  //     'Removed Successfully',
  //     {
  //       toastClass: 'toast-pink',
  //       timeOut: 5000,
  //       closeButton: true,
  //       progressBar: true,
  //       progressAnimation: 'decreasing',
  //     }
  //   );
  // }


}

