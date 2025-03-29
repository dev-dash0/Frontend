import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../Core/Services/company.service';
import { FiledropComponent } from '../dragn-drop/dragn-drop.component';
import { ProfileService } from '../../Core/Services/profile.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-company',
  standalone: true,
  imports: [FiledropComponent, FiledropComponent, ReactiveFormsModule],
  templateUrl: './update-company.component.html',
  styleUrl: './update-company.component.css',
})
export class UpdateCompanyComponent {
  companyForm: FormGroup;
  userId!: any;
  company!: any;

  constructor(
    private dialogRef: MatDialogRef<UpdateCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _companyService: CompanyService,
    private _profile: ProfileService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      id: [''],
      tenantUrl: ['', Validators.pattern('https?://.+')],
      image: [''],
      keywords: [''],
      description: [''],
    });
  }

  selectedImage!: string | null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.getCompanyDetails();
  }

  getCompanyDetails() {
    if (this.data?.companyId) {
      this._companyService.getCompanyData(this.data.companyId).subscribe({
        next: (res) => {
          this.company = res.result;
          this.companyForm.patchValue({
            name: this.company.name,
            id: this.company.id,
            tenantUrl: this.company.tenantUrl,
            description: this.company.description,
            keywords: this.company.keywords,
          });

          this.selectedImage = this.company.image || null;
        },
        error: (err) => {
          console.error('Error fetching company details:', err);
        },
      });
    }
  }

  updateCompany() {
    if (this.companyForm.valid) {
      const companyData = this.companyForm.value;
      const requestBody = {
        name: companyData.name,
        tenantUrl: companyData.tenantUrl,
        description: companyData.description,
        keywords: companyData.keywords,
        image: this.selectedImage || companyData.image,
      };

      this._companyService
        .updateCompany(this.data.companyId, requestBody)
        .subscribe({
          next: (res) => {
            console.log('Company updated successfully:', res);
            this.dialogRef.close('updated');
          },
          error: (err) => {
            console.error('Error updating company:', err);
          },
        });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
