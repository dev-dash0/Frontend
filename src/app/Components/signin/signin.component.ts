import { Component } from '@angular/core';
import { MainDarkBtnComponent } from "../../Shared/main-dark-btn/main-dark-btn.component";
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [MainDarkBtnComponent
    , MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {

}
