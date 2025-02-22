import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { baseUrl } from '../../Environment/environment.local';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient) { }
  private readonly _Router = inject(Router)

  Register = (user: any): Observable<any> => {
    return this._HttpClient.post(baseUrl + '/api/Account/Register', user)
  }

  Login = (user: any): Observable<any> => {
    return this._HttpClient.post(baseUrl + '/api/Account/Login', user)
  }
}