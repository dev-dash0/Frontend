import { Component } from '@angular/core';
import { ToggleButtonComponent } from "../../Shared/toggle-button/toggle-button.component";
import { UpdateInfoComponent } from '../update-info/update-info.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [ToggleButtonComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  constructor(private dialog: MatDialog) {}
  showMessage(value: any) {
    console.log(value);
  }
  openUpdateInfoModal() {
    this.dialog.open(UpdateInfoComponent, {
      width: 'auto',
      minWidth: '50vw',
      maxWidth: '50vw', // Limits width to 90% of viewport
      minHeight: '70vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }
}
