import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FiledropComponent } from '../dragn-drop/dragn-drop.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Core/Services/company.service';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [FormsModule, FiledropComponent, ReactiveFormsModule],
  templateUrl: './company-modal.component.html',
  styleUrl: './company-modal.component.css',
})
export class AddCompanyModalComponent {
  companyForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddCompanyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _companyService: CompanyService,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      tenantUrl: ['', Validators.pattern('https?://.+')],
      image: [''],
      keywords: [''],
      description: [''],
    });
  }

  createNewCompany() {
    if (this.companyForm.valid) {
      this._companyService.createCompany(this.companyForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.dialogRef.close();
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
