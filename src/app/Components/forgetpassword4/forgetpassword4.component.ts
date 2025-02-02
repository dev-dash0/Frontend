import { Component } from '@angular/core';
import { ProgressbarComponent } from "../progressbar/progressbar.component";

@Component({
  selector: 'app-forgetpassword4',
  standalone: true,
  imports: [ProgressbarComponent],
  templateUrl: './forgetpassword4.component.html',
  styleUrl: './forgetpassword4.component.css'
})
export class Forgetpassword4Component {
  f:number=4;
  password: string = '';

  constructor() {}

  onSubmit() {
    if (this.password) {
      // Simulate an email submission API call
      // console.log('Email submitted:', this.password);
      // alert('Verification email sent to ' + this.password);
    }
  }
}
