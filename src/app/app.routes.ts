import { Routes } from '@angular/router';
import { SigninComponent } from './Components/signin/signin.component';
import { SignupComponent } from './Components/signup/signup.component';
import { MyDashboardComponent } from './Components/my-dashboard/my-dashboard.component';
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { authGuardGuard } from './Core/guards/auth-guard.guard';
import { SettingComponent } from './Components/setting/setting.component';
import { ProjectModalComponent } from './Components/project-modal/project-modal.component';
import { ProjectViewComponent } from './Components/project-view/project-view.component';

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
    component: MyDashboardComponent,
    title: 'My Dashboard',
    // canActivate: [authGuardGuard],
  },
  {
    path: 'Setting',
    component: SettingComponent,
    title: 'Settings',
    // canActivate: [authGuardGuard],
  },
];
