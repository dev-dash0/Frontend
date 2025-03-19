import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Core/Services/company.service';
import { ProfileService } from '../../Core/Services/profile.service';
declare var bootstrap: any;
@Component({
  selector: 'app-deletemodal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deletemodal.component.html',
  styleUrls: ['./deletemodal.component.scss'],
})
export class DeleteModalComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _company: CompanyService,
    private _profile: ProfileService
  ) {}

  RemoveCompany() {
    if (this.data) {
      this._company.deleteCompany(this.data.companyId).subscribe({
        next: () => {
          console.log('Company deleted successfully');
          this.dialogRef.close('deleted');
        },
        error: (err) => {
          console.log('Error deleting tenant', err);
        },
      });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
