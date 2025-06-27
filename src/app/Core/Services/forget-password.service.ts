import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class ForgetPasswordService {
  constructor(private _HttpClient: HttpClient) {}

  ForgotPassword = (email: string): Observable<any> => {
    return this._HttpClient.post(
      baseUrl + '/api/Account/ForgotPassword',
      email
    );
  };

  VerifyOTP = (token: string): Observable<any> => {
    return this._HttpClient.post(baseUrl + '/api/Account/VerifyOTP', token);
  };

  ResetPassword = (newPassword: string): Observable<any> => {
    return this._HttpClient.post(
      baseUrl + '/api/Account/ResetPassword',
      newPassword
    );
  };
}
