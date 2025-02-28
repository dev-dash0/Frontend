import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [NgClass],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
})
export class SwitchComponent {
  @Input() on: boolean = false;
  @Input() className: string = '';
}
