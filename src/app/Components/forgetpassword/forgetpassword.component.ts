import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressbarComponent } from '../progressbar/progressbar.component';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [FormsModule,ProgressbarComponent],
  templateUrl: './forgetpassword.component.html',
  styleUrl: './forgetpassword.component.css'
})
export class ForgetpasswordComponent {

  email: string = '';
  f:number=1;
  constructor() {}

  onSubmit() {
    if (this.email) {
      // Simulate an email submission API call
      console.log('Email submitted:', this.email);
      alert('Verification email sent to ' + this.email);
    }
  }
}





