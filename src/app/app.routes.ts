import { Routes } from '@angular/router';
import { SigninComponent } from './Components/signin/signin.component';
import { SignupComponent } from './Components/signup/signup.component';
import { MyDashboardComponent } from './Components/my-dashboard/my-dashboard.component';
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, title: 'Sign in to Dev Dash' },
  { path: 'signup', component: SignupComponent, title: 'Sign up to Dev Dash' },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent,
    title: 'Forget Password',
  },
  {
    path: 'MyDashboard',
    component: DashboardComponent,
    title: 'My Dashboard',
  },
];
