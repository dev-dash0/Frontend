import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Core/Services/company.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SidebarService } from '../../Core/Services/sidebar.service';

@Component({
  selector: 'app-join-company',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './join-company.component.html',
  styleUrl: './join-company.component.css',
})
export class JoinCompanyComponent {
  joinCompanyForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<JoinCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _companyService: CompanyService,
    private sidebarService: SidebarService,
    private fb: FormBuilder
  ) {
    this.joinCompanyForm = this.fb.group({
      tenantCode: ['', Validators.required],
    });
  }

  joinCompany() {
    if (this.joinCompanyForm.valid) {
      const companyCode = this.joinCompanyForm.value.tenantCode.trim();
      this._companyService.joinCompany(companyCode).subscribe({
        next: (res) => {
          console.log(res);
          this.sidebarService.notifyCompanyCreated();
          this.dialogRef.close();
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
