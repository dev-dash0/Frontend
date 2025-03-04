import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SwitchComponent } from "../switch/switch.component";

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  imports: [SwitchComponent],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.css',
})
export class ToggleButtonComponent {
  @Input() on: boolean = false;
  @Output() toggled = new EventEmitter<boolean>();

  onClick() {
    this.on = !this.on;
    this.toggled.emit(this.on);
  }
}
