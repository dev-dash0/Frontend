import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressbarComponent } from "../progressbar/progressbar.component";

@Component({
  selector: 'app-forgetpassword2',
  standalone: true,
  imports: [FormsModule, ProgressbarComponent],
  templateUrl: './forgetpassword2.component.html',
  styleUrl: './forgetpassword2.component.css'
})
export class Forgetpassword2Component {
  otp: string = '';
 f:number=2;
  constructor() {}

  onSubmit() {
    if (this.otp) {
      // Simulate an email submission API call
      // console.log('otp is:', this.otp);
      // alert('otp is done ' + this.otp);
    }
  }
}
