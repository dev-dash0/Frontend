import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ToggleButtonComponent } from '../../Shared/toggle-button/toggle-button.component';
import { UpdateInfoComponent } from '../update-info/update-info.component';
import { UpdatePassComponent } from '../update-pass/update-pass.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { SidebarService } from '../../Core/Services/sidebar.service';
import { ProfileService } from '../../Core/Services/profile.service';
import { ProfileData } from '../../Core/interfaces/profile';

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [ToggleButtonComponent, CommonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent implements OnInit, AfterViewInit {
  // Inject services
  private readonly _ProfileService = inject(ProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly sidebarService = inject(SidebarService);

  // Component State
  ProfileData?: ProfileData;
  isSidebarCollapsed = true;
  isLoading = true;
  imageBlurStyle = 'blur(0px)';
  imageOpacity = '1';

  // Trigger when toggles are clicked
  showMessage(value: any) {
    console.log(value);
  }

  // Get user profile
  GetProfile() {
    this._ProfileService.getProfileData().subscribe({
      next: (res) => {
        console.log(res);
        this.ProfileData = res;
        this.isLoading = false;
      },
    });
  }

  // Open Update Info Modal
  openUpdateInfoModal() {
    this.dialog.open(UpdateInfoComponent, {
      minWidth: '50vw',
      maxWidth: '50vw',
      minHeight: '70vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { message: 'Hello from modal!' },
    });
  }

  // Open Update Password Modal
  openUpdatePassModal() {
    this.dialog.open(UpdatePassComponent, {
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '20vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { message: 'Hello from modal!' },
    });
  }

  // Open Delete Confirm Modal
  openConfirmModal() {
    this.dialog.open(ConfirmModalComponent, {
      minWidth: '40vw',
      maxWidth: '50vw',
      minHeight: '20vh',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { message: 'Hello from modal!' },
    });
  }

  // Delete Account Call
  RemoveAccount() {
    this._ProfileService.RemoveAccount().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }

  // Scroll-based blur & opacity effect for image
  handleScroll() {
    const scrollY = window.scrollY;
    const maxScroll = 500;

    const blur = Math.min((scrollY / maxScroll) * 5, 5);
    const opacity = Math.max(1 - scrollY / maxScroll, 0.4);

    this.imageBlurStyle = `blur(${blur}px)`;
    this.imageOpacity = `${opacity}`;
  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.GetProfile();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  ngAfterViewInit(): void {
    const blur = document.querySelector('.img-blur-overlay') as HTMLElement;
    window.addEventListener('scroll', () => {
      if (blur) {
        blur.style.opacity = `${Math.max(0, 1 - window.scrollY / 300)}`;
      }
    });
  }
}
