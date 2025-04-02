import { Component, inject, Inject } from '@angular/core';
import { ModalComponent } from "../../Shared/modal/modal.component";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IssueService } from '../../Core/Services/issue/issue.service';

@Component({
  selector: 'app-issue-view-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './issue-view-modal.component.html',
  styleUrl: './issue-view-modal.component.css'
})
export class IssueViewModalComponent {

  private readonly _IssueService = inject(IssueService);

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
  }
  close(): void {
    this.dialogRef.close();
  }
}
