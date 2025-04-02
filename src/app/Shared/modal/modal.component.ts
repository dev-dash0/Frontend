import { CommonModule } from '@angular/common';
import { Component, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],

  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() formGroup: any;
  @Input() submitText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Output() close = new EventEmitter<void>();
  // @Output() submit = new EventEmitter<void>();

  @Input() modalContent!: TemplateRef<any>;

  ngAfterViewInit() {
    // console.log('modalContent:', this.modalContent);  // ✅ Check if modalContent exists
  }

  onClose() {
    this.close.emit();
  }

  // onSubmit() {
  //   if (this.formGroup.valid) {
  //     this.submit.emit();
  //   }
  // }



}
