import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isCollapsed = new BehaviorSubject<boolean>(false);
  private companyDeletedSource = new BehaviorSubject<boolean>(false);
  private companyCreatedSource = new BehaviorSubject<boolean>(false);
  private companyUpdatedSource = new BehaviorSubject<boolean>(false);
  private resetSidebarSubject = new Subject<void>();
  companyCreated$ = this.companyCreatedSource.asObservable();
  isCollapsed$ = this.isCollapsed.asObservable();
  companyDeleted$ = this.companyDeletedSource.asObservable();
  companyUpdated$ = this.companyUpdatedSource.asObservable();

  resetSidebar$ = this.resetSidebarSubject.asObservable();

  resetSidebar() {
    this.resetSidebarSubject.next();
  }
  notifyCompanyDeleted() {
    this.companyDeletedSource.next(true);
  }
  notifyCompanyCreated() {
    this.companyCreatedSource.next(true);
  }
  notifyCompanyUpdated() {
    this.companyUpdatedSource.next(true);
  }

  toggleSidebar(): void {
    this.isCollapsed.next(!this.isCollapsed.value);
  }

  setSidebarState(state: boolean): void {
    this.isCollapsed.next(state);
  }
}
