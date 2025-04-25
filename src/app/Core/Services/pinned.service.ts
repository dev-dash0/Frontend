import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      baseUrl + '/api/PinnedItem/owned-pinned-items?itemType=Project',
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

  PinItem = (itemType: string, itemId: number): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const params = new HttpParams()
      .set('itemType', itemType)
      .set('itemId', itemId.toString());

    return this._HttpClient.post(
      baseUrl + `/api/PinnedItem/pin`,
      {}, // Empty body
      { headers, params }
    );
  };

  UnPinItem = (itemType: string, itemId: number): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const params = new HttpParams()
      .set('itemType', itemType)
      .set('itemId', itemId.toString());

    return this._HttpClient.delete(baseUrl + `/api/PinnedItem/unpin`, {
      headers,
      params,
    });
  };
}
