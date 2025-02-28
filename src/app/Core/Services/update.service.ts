import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly _Router = inject(Router);

  constructor(private _HttpClient: HttpClient) {}

  headers = { token: localStorage.getItem('token')! };

  UpdateInfo = (user: any): Observable<any> => {
      const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.post(baseUrl + '/api/Account/UpdateProfile', user ,
      {
        headers,
      })
  };
}
