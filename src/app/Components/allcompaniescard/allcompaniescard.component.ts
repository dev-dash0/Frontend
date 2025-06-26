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
import { PinnedService } from '../../Core/Services/pinned.service';
import { ToastrService } from 'ngx-toastr';
import { TenantResult } from '../../Core/interfaces/pinned';

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
    private profileService: ProfileService,
    private pinService: PinnedService,
    private _toastr: ToastrService,
    private pinnedService: PinnedService
  ) {}

  @Input() company!: Company;
  @Input() isPinned: boolean = false;
  @Output()
  companySelected = new EventEmitter<any>();
  @Output() pinChanged = new EventEmitter<{ id: number; pinned: boolean }>();
  owner: Owner | null = null;
  isOwner: boolean = false;
  userId!: any;
  hover = false;
  pinLoaded = false;
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
    return !!(url && url !== 'string' && url !== 'null' && url.trim() !== '');
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

  togglePin(tenant: TenantResult, event: MouseEvent) {
    event.stopPropagation();
    if (this.isPinned) {
      this.pinnedService.UnPinItem('Tenant', tenant.id).subscribe({
        next: (res) => {
          console.log('UnPinned successfully:', res);
          this.showSuccessUnPin();
          this.isPinned = false;
          this.pinChanged.emit({ id: tenant.id, pinned: false });
        },
        error: (err) => {
          console.error('UnPinning failed:', err);
          this.showFail(err.error.message);
        },
      });
    } else {
      this.pinService.PinItem('Tenant', tenant.id).subscribe({
        next: (res) => {
          console.log('Pinned successfully:', res);
          this.showSuccessPin();
          this.isPinned = true;
          this.pinChanged.emit({ id: tenant.id, pinned: false });
        },
        error: (err) => {
          console.error('Pinning failed:', err);
          this.showFail(err.error.message);
        },
      });
    }
  }

  showSuccessUnPin() {
    this._toastr.success(
      'The Company has been Unpinned',
      'Unpinned Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 5000,
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }

  showSuccessPin() {
    this._toastr.success('The Company has been Pinned', 'Pinned Successfully', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }

  showFail(err: any) {
    this._toastr.error(err.error.message, 'Pinned Failed', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
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
