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
      baseUrl + '/api/PinnedItem/show-pinned?itemType=project',
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
      baseUrl + '/api/PinnedItem/show-pinned?itemType=tenant',
      {
        headers,
      }
    );
  };
}
