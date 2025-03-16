import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private _HttpClient: HttpClient) { }

  getDashboardData = (Tenantid: number): Observable<any> => {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'text/plain',
    });

    const params = new HttpParams().set('Tenantid', Tenantid.toString());
    return this._HttpClient.get(baseUrl + '/api/DashBoard/Tenants',
      {
        headers,
        params
      }
    );
  };


  getDashboardAllProject = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    // const params = new HttpParams().set('Tenantid', Tenantid.toString());

    return this._HttpClient.get(baseUrl + '/api/DashBoard/allproject', {
      headers,
      // params
    });
  };

  getDashboardAllIssue = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    // const params = new HttpParams().set('Tenantid', Tenantid.toString());
    return this._HttpClient.get(baseUrl + '/api/DashBoard/allissue', {
      headers,
      // params
    });
  };
  getDashboardCalender = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._HttpClient.get(baseUrl + '/api/DashBoard/Calender', {
      headers,
    });
  };
  getDashboardPinned = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this._HttpClient.get(baseUrl + '/api/DashBoard/Pinneditems', {
      headers,
    });
  };

  getIssueById = (issueId: number): Observable<any> => {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'text/plain',
    });

    const params = new HttpParams().set('Tenantid', issueId.toString());
    return this._HttpClient.get(baseUrl + '/api/Issue',
      {
        headers,
        params
      }
    );
  };

}
