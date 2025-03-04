import { Routes } from '@angular/router';
import { SigninComponent } from './Components/signin/signin.component';
import { SignupComponent } from './Components/signup/signup.component';
import { MyDashboardComponent } from './Components/my-dashboard/my-dashboard.component';
import { ForgetPasswordComponent } from './Components/forget-password/forget-password.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { authGuardGuard } from './Core/guards/auth-guard.guard';
import { ProjectModalComponent } from './Components/project-modal/project-modal.component';
import { ProjectViewComponent } from './Components/project-view/project-view.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { isLoggedInGuardGuard } from './Core/guards/is-logged-in-guard.guard';

export const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent,
    canActivate: [isLoggedInGuardGuard],
    children:
      [
        { path: '', redirectTo: 'signin', pathMatch: 'full' },
        { path: 'signin', component: SigninComponent, title: 'Sign in to Dev Dash' },
        { path: 'signup', component: SignupComponent, title: 'Sign up to Dev Dash' },
        { path: 'forgetPassword', component: ForgetPasswordComponent, title: 'Forget Password' }
      ]
  },
  {
    path: '', component: MainLayoutComponent,
    canActivate: [authGuardGuard],
    children:
      [
        {
          path: 'MyDashboard', component: MyDashboardComponent, title: 'My Dashboard',
          children:
            [
              { path: '', component: DashboardComponent, pathMatch: 'full', title: 'Dashboard' },
              { path: 'Dashboard', component: DashboardComponent, title: 'Dashboard' },
              { path: 'Project', component: ProjectViewComponent, title: 'Project' },
            ],
        },
      ]
  }

];
