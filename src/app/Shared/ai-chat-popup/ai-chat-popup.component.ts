import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiAgentService } from '../../Core/Services/ai-agent.service';


@Component({
  selector: 'app-ai-chat-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat-popup.component.html',
  styleUrl: './ai-chat-popup.component.css',
})
export class AiChatPopupComponent {
  @Output() iframeClicked = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  userInput = '';
  messages: string[] = [];
  isLoading = false;

  constructor(private aiService: AiAgentService) {}

  ngOnInit(): void {
    this.messages.push('Hi User, What can I do for you?');
  }

  closePopup() {
    this.close.emit();
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const payload = {
      text: this.userInput,
      startDate: '2025-04-17',
      endDate: '2025-04-17',
      tenant_id: '11',
      chat_id: '',
    };

    this.messages.push(`🧑‍💻 You: ${this.userInput}`);
    this.userInput = '';
    this.isLoading = true;

    this.aiService.interactWithAgent(payload).subscribe({
      next: (event) => {
        switch (event.type) {
          case 'start':
            this.messages.push('🤖 Agent started responding...');
            break;
          case 'token':
            this.appendToLastMessage(event.content);
            break;
          case 'tool_call':
            this.messages.push(`[Tool Called: ${event.tool_name}]`);
            break;
          case 'tool_output':
            this.messages.push(`[Tool Output]: ${event.output}`);
            break;
          case 'end':
            this.isLoading = false;
            break;
          case 'error':
            this.messages.push(`⚠️ Error: ${event.content}`);
            this.isLoading = false;
            break;
        }
      },
      error: (err) => {
        this.messages.push(`❌ Connection Error`);
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  private appendToLastMessage(token: string) {
    const lastIndex = this.messages.length - 1;
    if (lastIndex >= 0 && this.messages[lastIndex].startsWith('🤖')) {
      this.messages[lastIndex] += token;
    } else {
      this.messages.push(`🤖 ${token}`);
    }
  }
}
