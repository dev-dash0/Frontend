import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-ai-chat-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-chat-popup.component.html',
  styleUrl: './ai-chat-popup.component.css',
})
export class AiChatPopupComponent {
  @Output() iframeClicked = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }

  handleIframeClick() {
    this.iframeClicked.emit();
  }
}
