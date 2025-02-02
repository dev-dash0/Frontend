import { Routes } from '@angular/router';
import { SigninComponent } from './Components/signin/signin.component';
import { SignupComponent } from './Components/signup/signup.component';
import { MyDashboardComponent } from './Components/my-dashboard/my-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent, title: 'Sign in to Dev Dash' },
  { path: 'signup', component: SignupComponent, title: 'Sign up to Dev Dash' },
  {
    path: 'MyDashboard',
    component: MyDashboardComponent,
    title: 'My Dashboard',
  },
];
