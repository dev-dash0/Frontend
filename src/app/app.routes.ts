import { Component } from '@angular/core';
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
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { isLoggedInGuardGuard } from './Core/guards/is-logged-in-guard.guard';
import { SprintViewComponent } from './Components/sprint-view/sprint-view.component';
import { WelcomePageComponent } from './Components/welcome-page/welcome-page.component';
import { CompanyViewComponent } from './Components/company-view/company-view.component';
import { AllcompaniesComponent } from './Components/allcompanies/allcompanies.component';
import { ErrorpageComponent } from './Components/errorpage/errorpage.component';
import { PinnedComponent } from './Components/pinned/pinned.component';
import { AllProjectsComponent } from './Components/all-projects/all-projects.component';
import { ProjectOverViewComponent } from './Components/project-over-view/project-over-view.component';
import { AllIssuesDashboardComponent } from './Components/all-issues-dashboard/all-issues-dashboard.component';
import { WelcomeComponent } from './Components/welcome/welcome.component';
import { Welcome2Component } from './Components/welcome2/welcome2.component';
import { AllIssuesComponent } from './Components/all-issues/all-issues.component';
import { PricingComponent } from './Components/pricing/pricing.component';
import { PaymentSuccessComponent } from './Components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './Components/payment-cancel/payment-cancel.component';

// export const routes: Routes = [
//   { path: 'welcome', component: Welcome2Component, title: 'Welcome' },
//   { path: '', redirectTo: 'welcome', pathMatch: 'full' },
//   {
//     path: '',
//     component: AuthLayoutComponent,
//     canActivate: [isLoggedInGuardGuard],
//     children: [
//       { path: '', redirectTo: 'signin', pathMatch: 'full' },
//       {
//         path: 'signin',
//         component: SigninComponent,
//         title: 'Sign in to Dev Dash',
//       },
//       {
//         path: 'signup',
//         component: SignupComponent,
//         title: 'Sign up to Dev Dash',
//       },
//       {
//         path: 'forgetPassword',
//         component: ForgetPasswordComponent,
//         title: 'Forget Password',
//       },
//     ],
//   },
//   {
//     path: '',
//     component: MainLayoutComponent,
//     canActivate: [authGuardGuard],
//     children: [
//       //   {
//       //     path: 'MyDashboard',
//       //     component: ProjectOverViewComponent,
//       //     title: 'My Dashboard',
//       //   },
//       //   {
//       //     path: 'Issues',
//       //     component: AllIssuesDashboardComponent,
//       //     title: 'My Dashboard',
//       //   },
//       // ],
//       // },
//       {
//         path: '',
//         component: MainLayoutComponent,
//         canActivate: [authGuardGuard],
//         children: [
//           {
//             path: 'MyDashboard',
//             component: MyDashboardComponent,
//             title: 'My Dashboard',
//             children: [
//               {
//                 path: '',
//                 component: DashboardComponent,
//                 pathMatch: 'full',
//                 title: 'Dashboard',
//               },
//               {
//                 path: 'Dashboard',
//                 component: DashboardComponent,
//                 title: 'Dashboard',
//               },
//               // {
//               //   path: 'Project/:id',
//               //   component: ProjectViewComponent,
//               //   title: 'Project',
//               // },
//               {
//                 path: 'Project/:id',
//                 component: ProjectOverViewComponent,
//                 title: 'Project',
//               },
//               {
//                 path: 'Setting',
//                 component: SettingComponent,
//                 title: 'Settings',
//               },
//               {
//                 path: 'Sprint/:id',
//                 component: SprintViewComponent,
//                 title: 'Sprint',
//               },
//               {
//                 path: 'Company/:id',
//                 component: CompanyViewComponent,
//                 title: 'Company',
//               },
//               {
//                 path: 'allcompanies',
//                 component: AllcompaniesComponent,
//                 title: 'All Companies',
//               },
//               {
//                 path: 'allProjects',
//                 component: AllProjectsComponent,
//                 title: 'All Projects',
//               },
//               { path: 'Pinned', component: PinnedComponent, title: 'Pinned' },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   { path: '**', component: ErrorpageComponent, title: 'Error' },
// ];

export const routes: Routes = [
  { path: 'welcome', component: Welcome2Component, title: 'Welcome' },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },

  // 🔐 Auth Layout Routes (signin/signup)
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [isLoggedInGuardGuard],
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        title: 'Sign in to Dev Dash',
      },
      {
        path: 'signup',
        component: SignupComponent,
        title: 'Sign up to Dev Dash',
      },
      {
        path: 'forgetPassword',
        component: ForgetPasswordComponent,
        title: 'Forget Password',
      },
    ],
  },

  // 🧑‍💻 Main Layout Routes (authenticated)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuardGuard],
    children: [
      {
        path: 'MyDashboard',
        component: MyDashboardComponent,
        title: 'My Dashboard',
        children: [
          {
            path: '',
            component: DashboardComponent,
            pathMatch: 'full',
            title: 'Dashboard',
          },
          {
            path: 'Dashboard',
            component: DashboardComponent,
            title: 'Dashboard',
          },
          {
            path: 'Project/:id',
            component: ProjectOverViewComponent,
            title: 'Project',
          },
          { path: 'Setting', component: SettingComponent, title: 'Settings' },
          {
            path: 'Sprint/:id',
            component: SprintViewComponent,
            title: 'Sprint',
          },
          {
            path: 'Company/:id',
            component: CompanyViewComponent,
            title: 'Company',
          },
          {
            path: 'allcompanies',
            component: AllcompaniesComponent,
            title: 'All Companies',
          },
          {
            path: 'allProjects',
            component: AllProjectsComponent,
            title: 'All Projects',
          },
          { path: 'Pinned', component: PinnedComponent, title: 'Pinned' },
          {
            path: 'allIssues',
            component: AllIssuesComponent,
            title: 'All Issues',
          },
          {
            path:'Pricing',
            component:PricingComponent,
            title:'Upgrade to Premium'
          },
          { path: 'payment-success', component: PaymentSuccessComponent },
          { path: 'payment-cancel', component: PaymentCancelComponent },
        ],
      },
    ],
  },

  // 404 page
  { path: '**', component: ErrorpageComponent, title: 'Error' },
];
