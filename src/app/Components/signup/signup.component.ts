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

  sendData() {
    this.isBtnSubmit = true;
    if (this.registerForm.valid) {
      // console.log(this.register);
      // console.log(this.register.value);   دي كدا ال هبعتهل للباك اند
      this._AuthService.Register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message == 'Registration successful') {
            this._Router.navigate(['/signin']);
            this.isBtnSubmit = false;
          }
        },
        error: (err) => {
          console.log(err);
          console.log(err.error.message);
          this.errorMessage = err.error.message;
          this.isBtnSubmit = false;
          // console.log(this.isBtnSubmit);
        },
      });
    } else {
      console.log(this.registerForm.errors);
      // this.register.get('rePassword')?.setValue("")
      // this.register.markAllAsTouched()
      // ^^^^ when u cant use disabled and whnt when click the submit btn all the alerts appears
    }
  }

  // onSubmit(event: Event): void {
  // event.preventDefault();
  // }
}
