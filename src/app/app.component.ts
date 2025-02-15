import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { IssueModalComponent } from './issue-modal/issue-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Dev-Dash';

  constructor(private dialog: MatDialog) { }

  openDialog() {
    this.dialog.open(IssueModalComponent, {
      width: 'auto',
      minWidth: '60vw',
      maxWidth: '80vw', // Limits width to 90% of viewport
      minHeight: '70vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }
}
