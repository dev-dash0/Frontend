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

  // onConfirm(): void {
  //   if (this.dontShowAgain) {
  //     localStorage.setItem('hideDeleteConfirm', 'true'); // ✅ Store preference
  //   }

  //   if (this.data.deleteFunction && this.data.itemId !== undefined) {
  //     this.data.deleteFunction(this.data.itemId);
  //     this._DialogService.showDeletionSuccess();
  //   }
  //   this.dialogRef.close('deleted');
  // }

  // onConfirm(): void {
  //   if (this.dontShowAgain) {
  //     localStorage.setItem('hideDeleteConfirm', 'true');
  //   }
  
  //   if (this.data.deleteFunction && this.data.itemId !== undefined) {
  //     try {
  //       const deletion$ = this.data.deleteFunction(this.data.itemId);
  
  //       // ✅ Ensure it’s an observable
  //       if (deletion$?.subscribe) {
  //         deletion$.subscribe({
  //           next: () => {
  //             this._DialogService.showDeletionSuccess();
  //             this.dialogRef.close('deleted'); 
  //           },
  //           error: (err: any) => {
  //             console.error('Delete failed:', err);
  //             this.dialogRef.close('error');
  //           }
  //         });
  //       } else {
  //         console.warn('deleteFunction did not return an observable.');
  //         this.dialogRef.close('error');
  //       }
  //     } catch (err) {
  //       console.error('Error executing deleteFunction:', err);
  //       this.dialogRef.close('error');
  //     }
  //   } else {
  //     this.dialogRef.close('canceled');
  //   }
  // }
  
  onConfirm(): void {
    console.log('✅ onConfirm triggered');
  
    if (this.dontShowAgain) {
      localStorage.setItem('hideDeleteConfirm', 'true');
    }
  
    if (this.data.deleteFunction && this.data.itemId !== undefined) {
      const deletion$ = this.data.deleteFunction(this.data.itemId);
      if (deletion$ && typeof deletion$.subscribe === 'function') {
        deletion$.subscribe({
          next: () => {
            console.log('✅ Deletion done in modal');
            this.dialogRef.close('deleted'); // ✅ مهمة جدًا
          },
          error: (err: any) => {
            console.error('❌ Deletion error:', err);
            this.dialogRef.close('error');
          }
        });
      }
    }
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

