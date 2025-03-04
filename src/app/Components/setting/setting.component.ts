import { Component, inject } from '@angular/core';
import { ToggleButtonComponent } from "../../Shared/toggle-button/toggle-button.component";
import { UpdateInfoComponent } from '../update-info/update-info.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { UpdatePassComponent } from '../update-pass/update-pass.component';
import { ProfileService } from '../../Core/Services/profile.service';
import { ProfileData } from '../../Core/interfaces/profile';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [ToggleButtonComponent, CommonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {
  constructor(
    private dialog: MatDialog,
    private sidebarService: SidebarService
  ) {}

  private readonly _ProfileService = inject(ProfileService);
  ProfileData?: ProfileData;
  showMessage(value: any) {
    console.log(value);
  }

  GetProfile() {
    this._ProfileService.getProfileData().subscribe({
      next: (res) => {
        console.log(res);
        this.ProfileData = res;
      },
    });
  }
  RemoveAccount() {
    this._ProfileService.RemoveAccount().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
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
  openUpdatePassModal() {
    this.dialog.open(UpdatePassComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw', // Limits width to 90% of viewport
      minHeight: '20vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }
  openConfirmModal() {
    this.dialog.open(ConfirmModalComponent, {
      width: 'auto',
      minWidth: '40vw',
      maxWidth: '50vw', // Limits width to 90% of viewport
      minHeight: '20vh',
      maxHeight: '90vh', // Prevents excessive height
      panelClass: 'custom-dialog-container', // Custom class for styling
      disableClose: true,
      data: { message: 'Hello from modal!' }, // ✅ Pass data to modal
    });
  }

  isSidebarCollapsed = true;

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.GetProfile();
  }
}
