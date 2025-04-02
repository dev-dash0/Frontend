import { Component, inject, Inject } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../Core/Services/project.service';

@Component({
  selector: 'app-join-project',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './join-project.component.html',
  styleUrl: './join-project.component.css',
})
export class JoinProjectComponent {
  // !--------- Everything need to be changed from company to project --------- ! \\
  private readonly toastr = inject(ToastrService);

  joinProjectForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<JoinProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _companyService: CompanyService,
    private _ProjectService: ProjectService,
    private sidebarService: SidebarService,
    private fb: FormBuilder
  ) {
    this.joinProjectForm = this.fb.group({
      ProjectCode: ['', Validators.required],
    });
  }

  joinProject() {
    if (this.joinProjectForm.valid) {
      const projectCode = this.joinProjectForm.value.ProjectCode.trim();
      this._ProjectService.JoinProject(projectCode).subscribe({
        next: (res) => {
          console.log(res);
          this.showSuccess();
          this.sidebarService.notifyCompanyCreated();
          this.dialogRef.close();
          window.location.reload();

        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  showSuccess() {
    this.toastr.success(
      'You have joined to the project successfully',
      'Joined Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 10000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
