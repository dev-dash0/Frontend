import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { InviteService } from '../../Core/Services/invite.service';
import {
  InvitationProjectInput,
  InvitationTenantInput,
} from '../../Core/interfaces/invitation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invite-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-invite-modal.component.html',
  styleUrl: './project-invite-modal.component.css',
})
export class InviteModalComponent implements OnInit {
  inviteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _invite: InviteService,
    private _toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: 'project' | 'tenant';
      projectId?: number;
      tenantId?: number;
    },
    private dialogRef: MatDialogRef<InviteModalComponent>
  ) {}

  ngOnInit(): void {
    this.inviteForm = this.fb.group({
      members: this.fb.array([this.createMemberGroup()]),
    });
  }

  createMemberGroup(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['Developer', Validators.required],
    });
  }

  get members(): FormArray {
    return this.inviteForm.get('members') as FormArray;
  }

  addMember(): void {
    this.members.push(this.createMemberGroup());
  }

  sendInvites(): void {
    if (this.inviteForm.invalid) return;

    this.members.controls.forEach((memberControl) => {
      const member = memberControl.value;

      const payload = {
        email: member.email,
        role: member.role,
        ...(this.data.type === 'project'
          ? { projectId: this.data.projectId }
          : { tenantId: this.data.tenantId }),
      };

      const request$ =
        this.data.type === 'project'
          ? this._invite.ProjectInvite(payload as InvitationProjectInput)
          : this._invite.TenantInvite(payload as InvitationTenantInput);

      request$.subscribe({
        next: (res) => {
          console.log('✅ Invite sent:', res);
          this.showSuccess(res.message);
        },
        error: (err) => {
          console.error('❌ Invite error:', err)
          this.showError(err.error.message);
          },
      });
    });

    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  showSuccess(msg :string) {
    this._toaster.success(msg, 'Added Successfully', {
    // this._toaster.success('The Request has been Sent', 'Added Successfully', {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
  showError(msg:string) {
    this._toaster.error(msg , 'Added Failed', {
      toastClass: 'toast-pink',
      timeOut: 10000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }
}
