import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiAgentService } from '../../Core/Services/ai-agent.service';
import { ProjectStateService } from '../../Core/Services/project-state.service';
import { ProfileService } from '../../Core/Services/profile.service';
import { CompanyService } from '../../Core/Services/company.service';


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
  @Output() agentAction = new EventEmitter<
    | { type: 'project_created'; projectId: number; projectName: string }
    | { type: 'agent_done' }
  >();

  userInput = '';
  messages: string[] = [];
  isLoading = false;
  userId: undefined;

  @Output() loadingState = new EventEmitter<boolean>();
  @Output() chatIdReceived = new EventEmitter<string>();

  chatId: string | null = localStorage.getItem('booty_chat_id') || null;

  constructor(
    private aiService: AiAgentService // private state: ProjectStateServicee
  ) {}

  private readonly state = inject(ProjectStateService);
  private readonly _profileService = inject(ProfileService);
  private readonly _companyService = inject(CompanyService);
  ngOnInit(): void {
    this.messages.push('🤖 Ask me what do u want ?');
    this.getOwnedCompanies();
    if (!this.chatId) {
      this.sendInitialEmptyMessage();
    }
  }

  selectedTenantId: string = '';
  selectedTenantName: string = '';
  ownedCompanies: any[] = [];

  // ------- manage  chat id ------------
  sendInitialEmptyMessage() {
    const payload = {
      text: '',
      tenant_id: this.selectedTenantId,
      chat_id: '',
    };

    this.aiService.interactWithAgent(payload).subscribe({
      next: (event) => {
        if (event.type === 'start' && event.chat_id) {
          this.chatId = event.chat_id;
          this.chatIdReceived.emit(event.chat_id);
          localStorage.setItem('booty_chat_id', event.chat_id);
        }
      },
    });
  }

  closePopup() {
    this.chatId = null;
    localStorage.removeItem('booty_chat_id');
    this.close.emit();
  }

  //  -------------------------

  getOwnedCompanies() {
    this._profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;

        this._companyService.getAllCompanies(null).subscribe({
          next: (res) => {
            const allCompanies = res.result || [];
            this.ownedCompanies = allCompanies.filter(
              (company: any) => company.owner.id === this.userId
            );
          },
          error: (err) => {
            console.error(err);
          },
        });
      },
    });
  }

  selectCompany(id: string, name: string) {
    this.selectedTenantId = id;
    this.selectedTenantName = name;
    if (!this.chatId) {
      const payload = {
        text: '',
        tenant_id: this.selectedTenantId,
        chat_id: '',
      };

      console.log('🚀 First-time empty message to get chat_id');

      this.aiService.interactWithAgent(payload).subscribe({
        next: (event) => {
          if (event.type === 'start' && event.chat_id) {
            this.chatId = event.chat_id;
            localStorage.setItem('booty_chat_id', this.chatId!);
            console.log(
              '✅ Got and saved chat_id from first message:',
              this.chatId
            );
          }
        },
      });
    }
  }

  resetCompany() {
    this.selectedTenantId = '';
    this.selectedTenantName = '';
    this.userInput = '';
    this.messages = []; // أو تسيبيها لو عايزة تحفظ التاريخ
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const payload = {
      text: this.userInput,
      tenant_id: this.selectedTenantId,
      chat_id: this.chatId || '', // 👈 لو فيه شات ID سابق استخدمه
    };

    this.messages.push(`🧑‍💻 You: ${this.userInput}`);
    this.userInput = '';
    this.isLoading = true;

    this.aiService.interactWithAgent(payload).subscribe({
      next: (event) => {
        switch (event.type) {
          case 'start':
            this.isLoading = true;

            // ✅ أول مرة فقط نحفظ الـ chat_id
            if (event.chat_id && !this.chatId) {
              this.chatId = event.chat_id;
              localStorage.setItem('booty_chat_id', this.chatId!);
              console.log('🔥 Stored new chat_id:', this.chatId);
            }
            break;

          case 'token':
            this.appendToLastMessage(event.content);
            break;

          case 'tool_output':
            // ✅ create_project
            if (event.tool_name === 'create_project') {
              const createdId = event.output?.id || event.output?.project?.id;
              const projectName = event.output?.project?.name || 'New Project';

              if (createdId && createdId !== 0) {
                this.agentAction.emit({
                  type: 'project_created',
                  projectId: createdId,
                  projectName,
                });
              }
            }

            // ✅ get_project_details
            if (event.tool_name === 'get_project_details') {
              const id = event.output?.id;
              const name = event.output?.name;

              if (id && name) {
                this.agentAction.emit({
                  type: 'project_created',
                  projectId: id,
                  projectName: name,
                });
              }
            }

            // ✅ create_sprint
            if (event.tool_name === 'create_sprint') {
              const sprint = event.output;
              if (sprint) {
                this.state.notifySprintCreated(sprint);
              }
            }
            break;

          case 'end':
            this.isLoading = false;
            this.agentAction.emit({ type: 'agent_done' });
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

  // private appendToLastMessage(token: string) {
  //   const lastIndex = this.messages.length - 1;
  //   if (lastIndex >= 0 && this.messages[lastIndex].startsWith('🤖')) {
  //     this.messages[lastIndex] += token;
  //   } else {
  //     this.messages.push(`🤖 ${token}`);
  //   }
  // }

  private appendToLastMessage(token: string) {
    const lastIndex = this.messages.length - 1;
    if (lastIndex >= 0 && this.messages[lastIndex].startsWith('🤖')) {
      this.messages[lastIndex] += token;
    } else {
      this.messages.push(`🤖 ${token}`);
    }
  }
}
