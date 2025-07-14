import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InviteService } from '../../Core/Services/invite.service';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-invite-modal.component.html',
  styleUrl: './project-invite-modal.component.css',
})
export class InviteModalComponent {
  @Input() projectId!: number; // Provide this when opening modal

  members = [{ email: '', role: 'ReadOnly' }];

  constructor(
    private http: HttpClient,
    private _invite: InviteService,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number }
  ) {}

  sendInvites() {
    for (const member of this.members) {
      const body = {
        email: member.email,
        projectId: this.data.projectId, // <- use injected data
        role: this.mapRole(member.role),
      };
      // this.http.post('/api/invite-member', body).subscribe({
      //   next: (res) => console.log('Invited:', res),
      //   error: (err) => console.error('Error:', err),
      // });
       this._invite.ProjectInvite(body).subscribe({
        next: (res) => console.log('Invited:', res),
        error: (err) => console.error('Error:', err),
       });
    }
  }

  addMember() {
    this.members.push({ email: '', role: 'ReadOnly' });
  }

  // sendInvites() {
  //   for (const member of this.members) {
  //     const body = {
  //       email: member.email,
  //       projectId: this.projectId,
  //       role: this.mapRole(member.role),
  //     };

  //     this.http.post('/api/invite-member', body).subscribe({
  //       next: (res) => console.log('Invited:', res),
  //       error: (err) => console.error('Error:', err),
  //     });
  //   }
  // }

  private mapRole(role: string): string {
    if (role === 'ReadOnly') return 'Viewer';
    if (role === 'ReadEdit') return 'Developer';
    return 'Admin';
  }
}
