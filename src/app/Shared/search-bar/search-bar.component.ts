import { MatToolbarModule } from '@angular/material/toolbar';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  toggle = false;
  toggleMode() {
    this.toggle = !this.toggle;
    console.log(`collapse state : ${this.toggle}`);
  }
}
