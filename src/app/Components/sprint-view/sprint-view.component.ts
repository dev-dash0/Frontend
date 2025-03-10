import { SidebarService } from './../../Core/Services/sidebar.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-sprint-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sprint-view.component.html',
  styleUrl: './sprint-view.component.css',
})
export class SprintViewComponent {
  isSidebarCollapsed = true;
  private sidebarService = inject(SidebarService);
  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
  }
}
