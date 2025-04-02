import { ProjectService } from '../../Core/Services/project.service';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Company } from '../../Core/interfaces/company/company';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../Core/Services/company.service';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectResult } from '../../Core/interfaces/project';
import { NameShortcutPipe } from '../../Core/pipes/name-shortcut.pipe';

@Component({
  selector: 'app-all-projects-card',
  standalone: true,
  imports: [MatChipsModule, CommonModule, NameShortcutPipe],
  templateUrl: './all-projects-card.component.html',
  styleUrl: './all-projects-card.component.css',
})
export class AllProjectsCardComponent {
  @Input() company!: Company;
  @Input() project!: ProjectResult;

  // injections and variables
  constructor(
    private ProjectService: ProjectService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  @Output() companySelected = new EventEmitter<any>();
  @Output() projectSelected = new EventEmitter<any>();

  selectProject() {
    this.projectSelected.emit(this.project.id);
  }

  copied = { code: false, url: false };

  // ------------------------------------------------------

  ngOnInit(): void {
    // this.getCompany();
    this.getProject();
  }
  //-------------------------------------------------------
    // CSS-Style --> To add the class to the priority related to the value  
  getPriorityClass(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'critical-priority';
      case 'high':
        return 'high-priority';
      case 'medium':
        return 'medium-priority';
      case 'low':
        return 'low-priority';
      default:
        return ''; // Default class (optional)
    }
  }

  //-------------------------------------------------------
  copyText(text: 'code' | 'url') {
    navigator.clipboard
      .writeText(
        text === 'code' ? this.company.tenantCode : this.company.tenantUrl
      )
      .then(() => {
        this.copied[text] = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.copied[text] = false;
          this.cdr.markForCheck();
        }, 2000);
      });
  }

  isValidUrl(url: any): boolean {
    return !!(url && url !== 'string' && url.trim() !== '');
  }

  getProject() {
    // const companyId = this.route.snapshot.paramMap.get('id');
    const projectId = this.route.snapshot.paramMap.get('id');
    if (projectId) {
      this.ProjectService.getProject(projectId).subscribe({
        next: (res) => {
          this.project = res.result;
          console.log(res.result);
        },
        error: (err) => console.error('Error fetching project details:', err),
      });
    }
  }
}
