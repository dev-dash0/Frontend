import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';
import { InvitationProjectInput, InvitationTenantInput } from '../interfaces/invitation';

@Injectable({
  providedIn: 'root',
})
export class InviteService {
  constructor(private _HttpClient: HttpClient) {}

  TenantInvite = (member: InvitationTenantInput): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.post(baseUrl + '/api/UserTenant/invite', member, {
      headers,
    });
  };

  ProjectInvite = (member: InvitationProjectInput): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.post(baseUrl + '/api/UserProject/invite', member, {
      headers,
    });
  };
}
