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
    | { type: 'project_created'; projectId: number; projectName: string }
    | { type: 'agent_done' }
  >();

  userInput = '';
  messages: string[] = [];
  isLoading = false;
  userId: undefined;
  private deferCloseUntilNavigation = false;

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
      // startDate: '2025-07-07',
      // endDate: '2026-07-07',
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
      chat_id: this.chatId || '', // استخدم الـ chat_id القديم لو موجود
    };

    this.messages.push(`🧑‍💻 You: ${this.userInput}`);
    this.userInput = '';
    this.isLoading = true;

    this.aiService.interactWithAgent(payload).subscribe({
      next: (event) => {
        switch (event.type) {
          case 'start':
            this.isLoading = true;

            // ✅ خزّن chat_id لأول مرة فقط
            if (event.chat_id && !this.chatId) {
              this.chatId = event.chat_id;
              localStorage.setItem('booty_chat_id', this.chatId!);
              console.log('🔥 Stored new chat_id:', this.chatId);
            }
            break;

          case 'token':
            this.appendToLastMessage(event.content);
            this.showBootyThought(event.content); // ✅ أظهر الكلام فوق بوتي
            break;

          case 'tool_output':
            if (event.tool_name === 'create_project') {
              const createdId = event.output?.id || event.output?.project?.id;
              const projectName = event.output?.project?.name || 'New Project';

              if (createdId && createdId !== 0) {
                // ✅ Send the project_created event only
                this.agentAction.emit({
                  type: 'project_created',
                  projectId: createdId,
                  projectName,
                });

                // ❌ ما تبعتش agent_done هنا، هنبعته من MyDashboard بعد التنقل
              }
            }

            // ❌ احذف أي agent_done هنا!
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

  //  دا فيه نافيجيشين للسبرينت كمان
  // sendMessage() {
  //   if (!this.userInput.trim()) return;

  //   const payload = {
  //     text: this.userInput,
  //     tenant_id: this.selectedTenantId,
  //     chat_id: this.chatId || '', // استخدم الـ chat_id القديم لو موجود
  //   };

  //   this.messages.push(`🧑‍💻 You: ${this.userInput}`);
  //   this.userInput = '';
  //   this.isLoading = true;

  //   this.aiService.interactWithAgent(payload).subscribe({
  //     next: (event) => {
  //       switch (event.type) {
  //         case 'start':
  //           this.isLoading = true;

  //           // ✅ خزّن chat_id لأول مرة فقط
  //           if (event.chat_id && !this.chatId) {
  //             this.chatId = event.chat_id;
  //             localStorage.setItem('booty_chat_id', this.chatId!);
  //             console.log('🔥 Stored new chat_id:', this.chatId);
  //           }
  //           break;

  //         case 'token':
  //           this.appendToLastMessage(event.content);
  //           this.showBootyThought(event.content); // ✅ أظهر الكلام فوق بوتي
  //           break;

  //         case 'tool_output':
  //           if (event.tool_name === 'create_project') {
  //             const createdId = event.output?.id || event.output?.project?.id;
  //             const projectName = event.output?.project?.name || 'New Project';

  //             if (createdId && createdId !== 0) {
  //               this.deferCloseUntilNavigation = true;
  //               this.agentAction.emit({
  //                 type: 'project_created',
  //                 projectId: createdId,
  //                 projectName,
  //               });
  //             }
  //           }

  //           if (
  //             event.tool_name === 'create_sprint' ||
  //             event.tool_name === 'create_Sprint'
  //           ) {
  //             const sprintId = event.output?.id || event.output?.sprint?.id;
  //             const sprintName = event.output?.sprint?.name || 'Sprint';

  //             if (sprintId && sprintName) {
  //               this.state.notifySprintCreated(event.output.sprint);

  //               this.deferCloseUntilNavigation = true; // 👈 هنا خلي بالك
  //               this.agentAction.emit({
  //                 type: 'sprint_created',
  //                 sprintId,
  //                 sprintName,
  //               });
  //             }
  //           }

  //           if (event.tool_name === 'create_issue') {
  //             const issue = event.output;
  //             if (issue?.id) {
  //               this.state.notifyIssueCreated(issue);
  //             }
  //           }

  //           break;

  //         case 'end':
  //           this.isLoading = false;

  //           if (!this.deferCloseUntilNavigation) {
  //             this.agentAction.emit({ type: 'agent_done' });
  //           }
  //           break;

  //         case 'error':
  //           this.messages.push(`⚠️ Error: ${event.content}`);
  //           this.isLoading = false;
  //           break;
  //       }
  //     },
  //     error: (err) => {
  //       this.messages.push(`❌ Connection Error`);
  //       this.isLoading = false;
  //       console.error(err);
  //     },
  //   });
  // }

  // showBootyThought(content: string) {
  //   const booty = document.querySelector('.booty') as HTMLElement;
  //   if (!booty) return;

  //   const rect = booty.getBoundingClientRect();

  //   const thought = document.createElement('div');
  //   thought.classList.add('booty-thought');
  //   thought.innerHTML = `💭 ${content}`;

  //   // ✅ Position it above Booty
  //   thought.style.position = 'fixed';
  //   thought.style.left = `${rect.left + rect.width / 2}px`;
  //   thought.style.top = `${rect.top - 40}px`;
  //   thought.style.transform = 'translateX(-50%)';
  //   thought.style.zIndex = '2000';

  //   document.body.appendChild(thought);

  //   setTimeout(() => {
  //     thought.remove();
  //   }, 4000);
  // }

  showBootyThought(content: string) {
    const booty = document.querySelector('.booty') as HTMLElement;
    if (!booty) return;

    const rect = booty.getBoundingClientRect();

    const wrapper = document.createElement('div');
    wrapper.classList.add('booty-thought-wrapper');
    wrapper.style.position = 'fixed';
    wrapper.style.left = `${rect.left + rect.width / 2}px`;
    wrapper.style.top = `${rect.top - 150}px`;
    wrapper.style.transform = 'translateX(-50%)';
    wrapper.style.zIndex = '2000';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '6px';

    const lines = content.split('. ').filter((line) => line.trim().length > 0);

    lines.forEach((line, i) => {
      const bubble = document.createElement('div');
      bubble.classList.add('booty-thought');
      bubble.innerHTML = `💭 ${line.trim()}.`;

      bubble.style.backgroundColor = '#2e2e4d';
      bubble.style.color = '#fff';
      bubble.style.padding = '10px 14px';
      bubble.style.borderRadius = '18px';
      bubble.style.maxWidth = '320px';
      bubble.style.textAlign = 'left';
      bubble.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
      bubble.style.fontSize = '14px';
      bubble.style.animation = 'floatInUp 0.5s ease, fadeOut 4s 2s forwards';
      bubble.style.opacity = '0';
      bubble.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        bubble.style.opacity = '1';
      }, i * 400);

      wrapper.appendChild(bubble);
    });

    document.body.appendChild(wrapper);

    setTimeout(() => {
      wrapper.remove();
    }, 7000);
  }
  //  دا فيه نافيجيشين للسبرينت كمان
  // showBootyThought(content: string) {
  //   const booty = document.querySelector('.booty') as HTMLElement;
  //   if (!booty) return;

  //   const rect = booty.getBoundingClientRect();

  //   // 🟪 فصل المحتوى لأسطر (على حسب النقاط أو الفواصل)
  //   const lines = content.split(/[\n.،؟!؛]+/).filter(Boolean);

  //   lines.forEach((line, index) => {
  //     const bubble = document.createElement('div');
  //     bubble.classList.add('booty-thought');
  //     bubble.innerHTML = `💭 ${line.trim()}`;

  //     // ✅ Position relative to Booty + slight vertical shift for each one
  //     bubble.style.left = `${rect.left + rect.width / 2}px`;
  //     bubble.style.top = `${rect.top - 60 + index * 50}px`;
  //     bubble.style.transform = 'translateX(-50%)';

  //     document.body.appendChild(bubble);

  //     // ✅ Delay appearance for staggered animation
  //     setTimeout(() => {
  //       bubble.style.opacity = '1';
  //     }, index * 500); // Delay between thoughts

  //     // ✅ Auto remove after 6 seconds
  //     setTimeout(() => {
  //       bubble.remove();
  //     }, 6000 + index * 500);
  //   });
  // }

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
