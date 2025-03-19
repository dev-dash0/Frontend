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

@Component({
  selector: 'app-allcompaniescard',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './allcompaniescard.component.html',
  styleUrl: './allcompaniescard.component.css',
})
export class AllcompaniescardComponent {
  @Input() company!: Company;

  // injections and variables
  constructor(
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  @Output() companySelected = new EventEmitter<any>();

  selectCompany() {
    this.companySelected.emit(this.company.id);
  }

  copied = { code: false, url: false };

  // ------------------------------------------------------

  ngOnInit(): void {
    this.getCompany();
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

  getCompany() {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.companyService.getCompanyData(companyId).subscribe({
        next: (res) => {
          this.company = res.result;
        },
        error: (err) => console.error('Error fetching company details:', err),
      });
    }
  }
}
