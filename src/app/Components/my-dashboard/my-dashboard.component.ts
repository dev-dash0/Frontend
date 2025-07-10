import { Component, HostListener, inject } from '@angular/core';
import { SearchBarComponent } from '../../Shared/search-bar/search-bar.component';
import { SideMenuComponent } from '../../Shared/side-menu/side-menu.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
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
  agentThinking = false;
  chatId: string | null = null;

  private readonly router = inject(Router);

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const booty = document.querySelector('.chat-trigger') as HTMLElement | null;

    if (booty) {
      booty.style.transform = `translate(${event.clientX * 0.02}px, ${
        event.clientY * 0.02
      }px) scale(1)`;
    }

    // const chat = document.querySelector('.chat-trigger') as HTMLElement;

    // // simple effect: slight parallax movement
    // chat.style.transform = `translate(${event.clientX * 0.02}px, ${
    //   event.clientY * 0.02
    // }px) scale(1)`;
  }

  onAgentLoading(isThinking: boolean) {
    this.agentThinking = isThinking;
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
  // `
  //
  // ;
  // }

  // showChatPopup = false;

  onIframeClick() {
    this.chatId = null; // 🟡 Reset chat ID on fresh open
    this.showChatPopup = true;
    console.log('Chat Opened');
    this.resetBooty(); // أولًا شيل أي تأثير سابق
    this.showChatPopup = true;
  }

  // navigateToProject(projectId: number, projectName: string) {
  //   // Shrink Booty
  //   this.shrinkBooty();

  //   // Show popup
  //   const popup = document.createElement('div');
  //   popup.innerText = `📦 Project "${projectName}" created!`;
  //   popup.classList.add('booty-popup');
  //   document.body.appendChild(popup);
  //   setTimeout(() => popup.remove(), 3000);

  //   // Navigate
  //   this.router.navigate(['/projects', projectId]);

  //   // Close chat popup
  //   this.showChatPopup = false;
  //   // 👇 1. غير مكان وحجم booty
  //   const booty = document.querySelector('.booty') as HTMLElement;
  //   if (booty) {
  //     booty.style.transition = 'all 0.5s ease-in-out';
  //     booty.style.top = '30px';
  //     booty.style.right = '30px';
  //     booty.style.transform = 'scale(0.15)';
  //     booty.style.zIndex = '1000';
  //   }

  //   // 👇 2. طلع pop-up فوقه
  //   // const popup = document.createElement('div');
  //   // popup.innerText = `📦 Project "${projectName}" created!`;
  //   // popup.classList.add('booty-popup');

  //   document.body.appendChild(popup);
  //   setTimeout(() => popup.remove(), 3000); // auto remove

  //   // 👇 3. Navigate
  //   this.router.navigate(['MyDashboard/Project', projectId]); // route: /projects/:id
  // }

  // navigateToProject(projectId: number, projectName: string) {
  //   this.shrinkBooty();

  //   const popup = document.createElement('div');
  //   popup.innerText = `📦 Project "${projectName}" created!`;
  //   popup.classList.add('booty-popup');
  //   document.body.appendChild(popup);
  //   setTimeout(() => popup.remove(), 3000);

  //   // ✅ تنقل للصفحة
  //   this.router.navigate(['MyDashboard/Project', projectId]);

  //   // ✅ اقفل الشات
  //   // this.showChatPopup = false;

  //   // ✅ رجّع بوتي بعد 1.5 ثانية
  //   setTimeout(() => {
  //     this.resetBooty();
  //   }, 1500);
  // }

  navigateToProject(projectId: number, projectName: string) {
    // ✅ 1. صغّر Booty
    this.shrinkBooty();

    // ✅ 2. أظهر popup
    const popup = document.createElement('div');
    popup.innerText = `📦 Project "${projectName}" created!`;
    popup.classList.add('booty-popup');
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000); // Remove بعد 3 ثواني

    // ✅ 3. Navigate
    this.router.navigate(['MyDashboard/Project', projectId]);

    // ❌ ما تقفلش الشات فورًا علشان الAgent لسه بيرد
    // ❌ this.showChatPopup = false;

    // ✅ 4. بعد 1.5 ثانية رجّع بوتي لمكانه الطبيعي
    setTimeout(() => {
      this.resetBooty();
    }, 1500);
  }

  // handleAgentAction(
  //   event:
  //     | { type: 'project_created'; projectId: number; projectName: string }
  //     | { type: 'agent_done' }
  // ) {
  //   if (event.type === 'project_created') {
  //     this.navigateToProject(event.projectId, event.projectName);
  //   }

  //   // if (event.type === 'agent_done') {
  //   //   this.resetBooty(); // restore position & scale
  //   // }
  //   if (event.type === 'agent_done') {
  //     // ✅ رجع Booty بعد 1 ثانية
  //     setTimeout(() => {
  //       this.resetBooty();
  //     }, 1000);

  //     // ✅ اقفل الشات بعد ما Booty يرجع
  //     setTimeout(() => {
  //       this.showChatPopup = false;
  //       this.chatId = null;
  //       localStorage.removeItem('booty_chat_id');
  //     }, 1600);
  //   }
  // }

  handleAgentAction(
    event:
      | { type: 'project_created'; projectId: number; projectName: string }
      | { type: 'agent_done' }
  ) {
    if (event.type === 'project_created') {
      this.navigateToProject(event.projectId, event.projectName);
    }

    if (event.type === 'agent_done') {
      // ✅ رجّع Booty لحجمه الطبيعي
      setTimeout(() => {
        this.resetBooty();
      }, 600);

      // ✅ اقفل الشات بعد ثانية
      setTimeout(() => {
        this.showChatPopup = false;
        this.chatId = null;
        localStorage.removeItem('booty_chat_id');
      }, 1600);
    }
  }

  // shrinkBooty() {
  //   const booty = document.querySelector('.booty') as HTMLElement;
  //   if (booty) {
  //     booty.style.transition = 'all 0.5s ease';
  //     booty.style.top = '30px';
  //     booty.style.right = '30px';
  //     booty.style.transform = 'scale(0.15)';
  //     booty.style.zIndex = '1000';
  //   }
  // }

  shrinkBooty() {
    const booty = document.querySelector('.booty') as HTMLElement;
    if (booty) {
      booty.classList.remove('booty-expanded');
      booty.classList.remove('interactive');
      booty.classList.add('booty--shrunk'); // ✅ كلاس جديد بدل styles
    }
  }

  // resetBooty() {
  //   const booty = document.querySelector('.booty') as HTMLElement;
  //   if (booty) {
  //     booty.style.transition = 'all 0.5s ease';
  //     booty.style.top = '250px';
  //     booty.style.right = '-300px';
  //     booty.style.transform = 'scale(0.25)';
  //     booty.style.zIndex = '0';
  //   }
  // }

  // resetBooty() {
  //   const booty = document.querySelector('.booty') as HTMLElement;
  //   if (booty) {
  //     booty.style.transition = 'all 0.5s ease';
  //     booty.style.top = '250px';
  //     booty.style.right = '-300px';
  //     booty.style.transform = 'scale(0.25)';
  //     booty.style.zIndex = '0';

  //     // ✅ امسح الكلاس لو لسه موجود علشان متضربش تاني مع الـ CSS
  //     booty.classList.remove('booty-expanded');
  //     booty.classList.remove('interactive');
  //   }
  // }

  resetBooty() {
    const booty = document.querySelector('.booty') as HTMLElement;
    if (booty) {
      booty.classList.remove('booty--shrunk');
      booty.classList.remove('booty-expanded');
      booty.classList.remove('interactive');
    }
  }

  // ------- manage chat id -------

  onChatClosed() {
    this.showChatPopup = false;
    this.chatId = null; // 🔴 Clear chat ID when closed
    localStorage.removeItem('booty_chat_id');
  }

  onChatIdReceived(chatId: string) {
    this.chatId = chatId;
    if (typeof window !== 'undefined' && localStorage) {
      // localStorage.setItem('booty_chat_id', this.chatId);
      localStorage.setItem('booty_chat_id', chatId);
      console.log('🔥 Stored new chat_id:', chatId);
    }
  }

  getSavedChatId() {
    return localStorage.getItem('booty_chat_id');
  }

  // ----- manage navigation for the project

  // onIframeClick() {
  //   this.showChatPopup = true;
  //   console.log('ouch');
  // }

  // enableIframe() {
  //   const iframe = document.getElementById('splineIframe') as HTMLElement;
  //   iframe.style.pointerEvents = 'auto';
  // }

  // disableIframe() {
  //   const iframe = document.getElementById('splineIframe') as HTMLElement;
  //   iframe.style.pointerEvents = 'none';
  // }
}
