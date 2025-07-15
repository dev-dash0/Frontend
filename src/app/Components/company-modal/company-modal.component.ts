import { Component, inject, Inject } from '@angular/core';
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
import { SidebarService } from '../../Core/Services/sidebar.service';
import { DashboardService } from '../../Core/Services/dashboard/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-modal',
  standalone: true,
  imports: [FormsModule, FiledropComponent, ReactiveFormsModule],
  templateUrl: './company-modal.component.html',
  styleUrl: './company-modal.component.css',
})
export class AddCompanyModalComponent {
  companyForm: FormGroup;
  private readonly _toaster=inject(ToastrService);
  private readonly _router=inject(Router)
  constructor(
    private dialogRef: MatDialogRef<AddCompanyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _companyService: CompanyService,
    private sidebarService: SidebarService,
    private fb: FormBuilder,
    private dashboardService:DashboardService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
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

  createNewCompany() {
    if (this.companyForm.valid) {
      const companyData = this.companyForm.value;
      const requestBody = {
        name: companyData.name,
        tenantUrl: companyData.tenantUrl,
        description: companyData.description,
        keywords: companyData.keywords,
        image: this.selectedImage,
      };
      this._companyService.createCompany(requestBody).subscribe({
        next: (res) => {
          console.log(res);
          this.sidebarService.notifyCompanyCreated();
          this.dashboardService.notifyCompanyCreated();
          this.dialogRef.close();
          this.showSuccess('Company created successfully!');
        },
        error: (err) => {
          console.error(err);
          this.showError(err.error.message);
          if(err.error.message === "You have reached the maximum number of tenants allowed for your account. Please upgrade to create more tenants."){
            this.dialogRef.close();
            this._router.navigate(['/MyDashboard/Pricing']);
          
          }
        },
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  // *********************Toaster**********************
 
  showError(err: string) {
    this._toaster.error(err, 'Error Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
  showSuccess(Message:string){
    this._toaster.success(Message, 'Success Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  
}
