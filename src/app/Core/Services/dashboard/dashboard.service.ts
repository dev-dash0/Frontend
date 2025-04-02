import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _HttpClient: HttpClient) { }

  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  getDashboardData = (Tenantid: number): Observable<any> => {


    const params = new HttpParams().set('Tenantid', Tenantid.toString());
    return this._HttpClient.get(baseUrl + '/api/DashBoard/Tenants',
      {
        headers: this.headers,
        params
      }
    );
  };


  getDashboardAllProject = (): Observable<any> => {
    return this._HttpClient.get(baseUrl + '/api/DashBoard/allproject', {
      headers: this.headers,
    });
  };

  getDashboardAllIssue = (): Observable<any> => {
    return this._HttpClient.get(baseUrl + '/api/DashBoard/allissue', {
      headers: this.headers,
    });
  };

  getDashboardCalender = (): Observable<any> => {
    return this._HttpClient.get(baseUrl + '/api/DashBoard/Calender', {
      headers: this.headers,
    });
  };

  getDashboardPinned = (): Observable<any> => {
    return this._HttpClient.get(baseUrl + '/api/DashBoard/Pinneditems', {
      headers: this.headers,
    });
  };

  getIssueById = (issueId: number): Observable<any> => {
    const params = new HttpParams().set('Tenantid', issueId.toString());
    return this._HttpClient.get(baseUrl + '/api/Issue',
      {
        headers: this.headers,
        params
      }
    );
  };

}
