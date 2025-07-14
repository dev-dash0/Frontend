import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root'
})
export class InviteService {

 constructor(private _HttpClient: HttpClient) {}

  ProjectInvite = (member: object): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.post(
      baseUrl + '/api/UserProject/invite',
      member,
      {
        headers,
      },
    );
  };
}
