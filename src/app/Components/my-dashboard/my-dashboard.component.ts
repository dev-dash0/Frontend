import { Component, HostListener } from '@angular/core';
import { SearchBarComponent } from '../../Shared/search-bar/search-bar.component';
import { SideMenuComponent } from '../../Shared/side-menu/side-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProjectViewComponent } from '../project-view/project-view.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AllProjectsDashboardComponent } from '../all-projects-dashboard/all-projects-dashboard.component';
import { CommonModule } from '@angular/common';
import { DeleteModalComponent } from '../deletemodal/deletemodal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AiChatPopupComponent } from '../../Shared/ai-chat-popup/ai-chat-popup.component';
@Component({
  selector: 'app-my-dashboard',
  standalone: true,
  imports: [
    AiChatPopupComponent,
    SearchBarComponent,
    SideMenuComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    // ProjectViewComponent,
    // DashboardComponent,
    RouterOutlet,
    // AllProjectsDashboardComponent,
    CommonModule,
    // DeleteModalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './my-dashboard.component.html',
  styleUrl: './my-dashboard.component.css',
})
export class MyDashboardComponent {
  showChatPopup = false;
  iframeInteractive = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const booty = document.querySelector('.chat-trigger') as HTMLElement;

    // simple effect: slight parallax movement
    booty.style.transform = `translate(${event.clientX * 0.02}px, ${
      event.clientY * 0.02
    }px) scale(1)`;

    // const chat = document.querySelector('.chat-trigger') as HTMLElement;

    // // simple effect: slight parallax movement
    // chat.style.transform = `translate(${event.clientX * 0.02}px, ${
    //   event.clientY * 0.02
    // }px) scale(1)`;
  }


  // @HostListener('document:mousemove', ['$event'])
  // onMouseMove(event: MouseEvent) {
  //   const modelWrapper = document.getElementById(
  //     'eyeModelWrapper'
  //   ) as HTMLElement;
  //   if (!modelWrapper) return;

  //   const rect = modelWrapper.getBoundingClientRect();

  //   const centerX = rect.left + rect.width / 2;
  //   const centerY = rect.top + rect.height / 2;

  //   const deltaX = event.clientX - centerX;
  //   const deltaY = event.clientY - centerY;

  //   const rotateX = (deltaY / rect.height) * -10; // Invert Y
  //   const rotateY = (deltaX / rect.width) * 10;

  //   modelWrapper.style.transform = `
  //   perspective(600px)
  //   rotateX(${rotateX}deg)
  //   rotateY(${rotateY}deg)
  //   scale(1.05)
  // `;
  // }

  onIframeClick() {
    this.showChatPopup = true;
    console.log('ouch');
  }

  // enableIframe() {
  //   const iframe = document.getElementById('splineIframe') as HTMLElement;
  //   iframe.style.pointerEvents = 'auto';
  // }

  // disableIframe() {
  //   const iframe = document.getElementById('splineIframe') as HTMLElement;
  //   iframe.style.pointerEvents = 'none';
  // }
}
