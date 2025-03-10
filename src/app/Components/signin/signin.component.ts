import { Component, inject } from '@angular/core';
import { MainDarkBtnComponent } from '../../Shared/main-dark-btn/main-dark-btn.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SigninSignupNavbarComponent } from '../../Shared/signin-signup-navbar/signin-signup-navbar.component';
import { Router, RouterEvent, RouterLink } from '@angular/router';
import { AuthService } from '../../Core/Services/Auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { signupValidators } from '../../Shared/validators/validators.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    MainDarkBtnComponent,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  isBtnSubmit: boolean = false;
  errorMessage: string = '';
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly toastr = inject(ToastrService);

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, signupValidators.email],
    password: [null, signupValidators.password],
  });

  sendData() {
    this.isBtnSubmit = true;
    if (this.loginForm.valid) {
      this._AuthService.Login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this._Router.navigate(['/MyDashboard']);
          localStorage.setItem('token', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.log(this.errorMessage);
          this.showError(
            this.errorMessage + ' (Email or Password is incorrect)'
          );
        },
      });
    } else if (
      this.loginForm.get('password')?.invalid &&
      this.loginForm.get('email')?.valid
    ) {
      this.showError('Invalid Password');
    } else if (
      this.loginForm.get('password')?.valid &&
      this.loginForm.get('email')?.invalid
    ) {
      this.showError('Invalid email');
    } else {
      this.showError('Please fill all the fields');
    }
  }
  onSubmit(event: Event): void {
    event.preventDefault();
  }

  showError(err: string) {
    this.toastr.error(err, 'Error Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
