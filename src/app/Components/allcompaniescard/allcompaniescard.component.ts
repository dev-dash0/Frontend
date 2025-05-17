import { Owner } from './../../Core/interfaces/company/company';
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
import { ProfileService } from '../../Core/Services/profile.service';

@Component({
  selector: 'app-allcompaniescard',
  standalone: true,
  imports: [MatChipsModule, CommonModule],
  templateUrl: './allcompaniescard.component.html',
  styleUrl: './allcompaniescard.component.css',
})
export class AllcompaniescardComponent {
  // injections and variables
  constructor(
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  @Input() company!: Company;
  @Output() companySelected = new EventEmitter<any>();
  owner: Owner | null = null;
  isOwner: boolean = false;
  userId!: any;
  hover = false;
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
        error: (err) => console.log('Error fetching company details:', err),
      });
    }
  }

  ngOnChanges() {
    this.profileService.getProfileData().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.owner = this.company?.owner;
        this.isOwner = this.owner?.id === this.userId;
      },
    });
  }
}
