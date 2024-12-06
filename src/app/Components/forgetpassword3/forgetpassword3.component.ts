import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressbarComponent } from "../progressbar/progressbar.component";

@Component({
  selector: 'app-forgetpassword3',
  standalone: true,
  imports: [FormsModule, ProgressbarComponent],
  templateUrl: './forgetpassword3.component.html',
  styleUrl: './forgetpassword3.component.css'
})
export class Forgetpassword3Component {

  password: string = '';
  f:number=3;

  constructor() {}

  onSubmit() {
    if (this.password) {
      // Simulate an email submission API call
      // console.log('Email submitted:', this.password);
      // alert('Verification email sent to ' + this.password);
    }
  }
}
