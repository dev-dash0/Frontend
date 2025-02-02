import { RouterOutlet } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatSidenavModule, RouterOutlet, CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  collapsed = false;
  dropdownStates: { [key: string]: boolean } = {};

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = window.innerWidth;
    this.collapsed = width <= 768;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }
  toggleCollapseDropDown(id: string) {
    this.dropdownStates[id] = !this.dropdownStates[id];
  }
}
