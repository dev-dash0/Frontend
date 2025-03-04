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

@Component({
  selector: 'app-signin',
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
          this.isBtnSubmit = false;
          localStorage.setItem('token', res.accessToken);
          // this._AuthService.saveUserData();
          // }
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          console.log(this.errorMessage);
        },
      });
    }
  }
  onSubmit(event: Event): void {
    event.preventDefault();
  }
}
