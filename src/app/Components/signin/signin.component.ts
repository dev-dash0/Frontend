import { Component, inject } from '@angular/core';
import { MainDarkBtnComponent } from '../../Shared/main-dark-btn/main-dark-btn.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SigninSignupNavbarComponent } from '../../Shared/signin-signup-navbar/signin-signup-navbar.component';
import { Router, RouterEvent, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';


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
    ReactiveFormsModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  onSubmit(event: Event): void {
    event.preventDefault();
  }
  isBtnSubmit: boolean = false;
  private readonly _AuthService = inject(AuthService);
  private readonly _Router = inject(Router);
  LoginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })


  sendData() {
    this.isBtnSubmit = true;
    if (this.LoginForm.valid) {
      this._AuthService.Login(this.LoginForm.value).subscribe({
        next: (res) => {
          if (res.accessToken) {
            localStorage.setItem('token', res.accessToken);
            // this._AuthService.saveUserData();
            this._Router.navigate(['/MyDashboard'])
            this.isBtnSubmit = false;
          }
        }
        , error: (err: HttpErrorResponse) => {
          console.log(err);
          // this.signinErrorMessage = err.error.message
          this.isBtnSubmit = false;
        }


      })
    }
  }
}