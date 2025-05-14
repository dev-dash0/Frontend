import { Component, inject, SimpleChanges } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MainDarkBtnComponent } from "../../Shared/main-dark-btn/main-dark-btn.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { signupValidators } from '../../Shared/validators/validators.component';
import { ForgetPasswordService } from '../../Core/Services/forget-password.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MainDarkBtnComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  steps: number = 1;

  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ForgetPassService = inject(ForgetPasswordService);
  private readonly _toaster = inject(ToastrService);

  ForgetForm: FormGroup = this._FormBuilder.group({
    email: [null, Validators.required],
  });

  OTPForm: FormGroup = this._FormBuilder.group({
    token: [null, Validators.required],
  });

  ResetForm: FormGroup = this._FormBuilder.group({
    newPassword: [null, Validators.required],
  });

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  ForgetPassword() {
    // if (this.ForgetForm.valid) {
    this._ForgetPassService.ForgotPassword(this.ForgetForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.navigateVerify();
        this.showSuccess(res.message);
      },
      error: (err) => {
        console.log(err);
      },
    });
    // }
  }

  VerifyOTP() {
    // if (this.ForgetForm.valid) {
    this._ForgetPassService.VerifyOTP(this.OTPForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.navigateReset();
      },
      error: (err) => {
        console.log(err);
      },
    });
    // }
  }

  ResetPassword() {
    // if (this.ForgetForm.valid) {
    this._ForgetPassService.ResetPassword(this.ResetForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.DonePass();
      },
      error: (err) => {
        console.log(err);
      },
    });
    // }
  }

  navigateForgot = () => {
    this.steps = 1;
    localStorage.setItem('currentStep', this.steps.toString());
  };

  navigateVerify = () => {
    this.steps = 2;
    localStorage.setItem('currentStep', this.steps.toString()); //! this step will be added when we add form to submit in the res
    // if (parseInt(localStorage.getItem('currentStep') || '1') > this.steps) {  // !and this will be replaced  with the pervious line
    //   this.steps = 2;
    // }
  };
  navigateReset = () => {
    this.steps = 3;
    localStorage.setItem('currentStep', this.steps.toString());
    // if (parseInt(localStorage.getItem('currentStep') || '1') > this.steps) {
    //   this.steps = 3;
    // }
  };
  DonePass = () => {
    this.steps = 4;
    localStorage.setItem('currentStep', this.steps.toString());
    // if (parseInt(localStorage.getItem('currentStep') || '1') > this.steps) {
    //   this.steps = 3;
    // }
  };

  showSuccess(msg: string) {
    this._toaster.success(msg, 'Success Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  ngOnInit(): void {
    localStorage.setItem('currentStep', this.steps.toString());
    // this.steps = parseInt(localStorage.getItem('currentStep') || '1');
    // this.resetPassword
    //   .get('email')
    //   ?.setValue(localStorage.getItem('currentEmail'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.steps = parseInt(localStorage.getItem('currentStep')! || '1');
    localStorage.setItem('currentStep', this.steps.toString());
  }
}
