import { Component, inject } from '@angular/core';
import { MainDarkBtnComponent } from '../../Shared/main-dark-btn/main-dark-btn.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SigninSignupNavbarComponent } from '../../Shared/signin-signup-navbar/signin-signup-navbar.component';
import { AuthService } from '../../Core/Services/Auth.service';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signupValidators } from '../../Shared/validators/validators.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MainDarkBtnComponent,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    SigninSignupNavbarComponent,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  isBtnSubmit: boolean = false;
  errorMessage: string = '';

  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly toastr = inject(ToastrService);
  
  private formatDateOnly(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
  

  registerForm: FormGroup = this._FormBuilder.group(
    {
      firstName: [null, signupValidators.name],
      lastName: [null, signupValidators.name],
      username: [null, signupValidators.name],
      email: [null, signupValidators.email],
      password: [null, signupValidators.password],
      phoneNumber: [null,],
      birthday: [null],
    }
    // { validators: [confirmPassword] }
  );

  // sendData() {
  //   this.isBtnSubmit = true;
  //   if (this.registerForm.valid) {

  //     this._AuthService.Register(this.registerForm.value).subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         if (res.message == 'Registration successful') {
  //           this._Router.navigate(['/signin']);
  //           this.isBtnSubmit = false;
  //         }
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         console.log(this.registerForm.value);
  //         console.log(err.error.message);
  //         this.errorMessage = err.error.message;
  //         this.showError(this.errorMessage);

  //       },
  //     });
  //   }
  //   else if (this.registerForm.get('password')?.invalid && this.registerForm.get('email')?.valid) {
  //     this.showError('Invalid Password');

  //   }
  //   else if (this.registerForm.get('password')?.valid && this.registerForm.get('email')?.invalid) {
  //     this.showError('Invalid email');

  //   }
  //   else if (this.registerForm.get('birthday')?.invalid) {
  //     this.showError('Invalid birthday');
  //   }
  //   else {
  //     // console.log(this.registerForm.errors);
  //     // console.log(this.registerForm.value);
  //     this.showError('Please fill all the fields');
  //     // this.register.get('rePassword')?.setValue("")
  //     this.registerForm.markAllAsTouched()
  //   }
  // }

  sendData() {
    this.isBtnSubmit = true;
  
    if (this.registerForm.valid) {
      const formData = { ...this.registerForm.value };
  
      // ✅ تأكيد تنسيق تاريخ الميلاد
      if (formData.birthday instanceof Date && !isNaN(formData.birthday)) {
        formData.birthday = this.formatDateOnly(formData.birthday);
      }
  
      this._AuthService.Register(formData).subscribe({
        next: (res) => {
          if (res.message === 'Registration successful') {
            this._Router.navigate(['/signin']);
            this.isBtnSubmit = false;
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.showError(this.errorMessage);
        },
      });
    }
    else if (this.registerForm.get('password')?.invalid && this.registerForm.get('email')?.valid) {
      this.showError('Invalid Password');
    }
    else if (this.registerForm.get('password')?.valid && this.registerForm.get('email')?.invalid) {
      this.showError('Invalid email');
    }
    else if (this.registerForm.get('birthday')?.invalid) {
      this.showError('Invalid birthday');
    }
    else {
      this.showError('Please fill all the fields');
      this.registerForm.markAllAsTouched();
    }
  }
  
  onSubmit(event: Event): void {
    event.preventDefault();
  }

  showError(err: string) {
    this.toastr.error(
      err,
      'Error Message',
      {
        toastClass: 'toast-pink',
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }

  // onDateChange(event: any) {
  //   if (event.value) {
  //     const date = new Date(event.value);
  //     const formattedDate = date.toISOString().split('T')[0]; // Converts to YYYY-MM-DD
  //     this.registerForm.patchValue({ birthday: formattedDate });
  //   }
  // }
  onDateChange(event: any) {
    if (event.value instanceof Date && !isNaN(event.value)) {
      const date = new Date(event.value);
  
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`; // YYYY-MM-DD
  
      this.registerForm.patchValue({ birthday: formattedDate });
    }
  }
  
}
