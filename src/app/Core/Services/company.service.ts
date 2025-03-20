import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private _HttpClient: HttpClient) {}
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  getAllCompanies(search: string | null = null): Observable<any> {
    const searchParam = search ? `search=${encodeURIComponent(search)}` : '';

    return this._HttpClient.get(
      baseUrl + `/api/Tenant?${searchParam}&pageSize=0&pageNumber=1`,
      { headers: this.headers }
    );
  }

  getCompanyData(tenantId: any): Observable<any> {
    return this._HttpClient.get(baseUrl + `/api/Tenant/${tenantId}`, {
      headers: this.headers,
    });
  }

  createCompany(company: any): Observable<any> {
    return this._HttpClient.post(baseUrl + `/api/Tenant`, company, {
      headers: this.headers,
    });
  }

  deleteCompany(companyId: any): Observable<any> {
    return this._HttpClient.delete(baseUrl + `/api/Tenant/${companyId}`, {
      headers: this.headers,
    });
  }

  getAllCompanyIds(): Observable<string[]> {
    return this.getAllCompanies().pipe(
      map((response: any) => response.result.map((company: any) => company.id))
    );
  }
}
