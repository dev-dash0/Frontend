import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MainDarkBtnComponent } from '../../Shared/main-dark-btn/main-dark-btn.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [
    // MainDarkBtnComponent,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    NgClass,
    MainDarkBtnComponent
  ],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  steps: number = 1;

  navigateForgot = () => {
    this.steps = 1;
  };

  navigateVerify = () => {
    this.steps = 2;
    localStorage.setItem('currentStep', this.steps.toString());        //! this step will be added when we add form to submit in the res
    // if (parseInt(localStorage.getItem('currentStep') || '1') > this.steps) {  // !and this will be replaced  with the pervious line
    //   this.steps = 2;
    // }
  };
  navigateReset = () => {
    this.steps = 3;
    localStorage.setItem('currentStep', this.steps.toString());
    // if (parseInt(localStorage.getItem('currentStep') || '1') > this.steps) {
    //   this.steps = 3;
    // }
  };

  ngOnInit(): void {
    this.steps = parseInt(localStorage.getItem('currentStep') || '1');
    // this.resetPassword
    //   .get('email')
    //   ?.setValue(localStorage.getItem('currentEmail'));
  }
}
