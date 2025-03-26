import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class PinnedService {
  constructor(private _HttpClient: HttpClient) {}

  getPinnedProjects = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.get(
      baseUrl +
        '/api/PinnedItem/owned-pinned-items?itemType=Project',
      {
        headers,
      }
    );
  };

  getPinnedTenants = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.get(
      baseUrl + '/api/PinnedItem/owned-pinned-items?itemType=Tenant',
      {
        headers,
      }
    );
  };

  getPinnedIssues = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.get(
      baseUrl + '/api/PinnedItem/owned-pinned-items?itemType=Issue',
      {
        headers,
      }
    );
  };
}
