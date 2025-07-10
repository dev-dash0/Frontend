import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';
import { Router } from '@angular/router';
import { JwtPayload } from '../interfaces/jwt-payload';
// import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  
  private readonly _Router = inject(Router);
  
  constructor(private _HttpClient: HttpClient) {}

  
  Register = (user: any): Observable<any> => {
    return this._HttpClient.post(baseUrl + '/api/Account/Register', user);
  };
  
  Login = (user: any): Observable<any> => {
    return this._HttpClient.post(baseUrl + '/api/Account/Login', user);
  };
  
  Logout = (logoutParams: any): Observable<any> => {
    return this._HttpClient.post(baseUrl + '/api/Account/Logout', logoutParams);
  };
  
  public isCheckingToken = true;
  
  saveUserData() {
    const token = localStorage.getItem('token');
    this.isCheckingToken = true;

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expiryTime = decoded.exp * 1000;
        const timeUntilExpiry = expiryTime - Date.now();
        
        if (timeUntilExpiry <= 0) {
          this.logoutAndRedirect();
        } else {
          setTimeout(() => {
            this.logoutAndRedirect();
          }, timeUntilExpiry);
        }
      } catch (error) {
        this.logoutAndRedirect();
      }
    }
    
    this.isCheckingToken = false;
  }
  
  private logoutAndRedirect() {
    // this.isCheckingToken = false;
    // localStorage.clear();
    // this._Router.navigate(['/signin']);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.isCheckingToken = false; // ✅ Add this line
    this._Router.navigate(['/signin']);
  }
  
  forceLogout() {
    localStorage.removeItem('token');
    this._Router.navigate(['/signin']); // or your login route
  }

  // user:any ----> any will replace with interface for the user

  // saveUserData = () => {
  //   let token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  // let decode = jwtDecode(token);
  //       // console.log(decode);
  //     } catch (error) {
  //       this._Router.navigate(['signin']);
  //       localStorage.clear();
  //     }
  //   }
  // };
  // saveUserData Func to decode the token that i stored in the localstorage to get info fromm it
  //  espcially if there were a user and admin we eill take the role from the token

  //   forgotPassword = (email: any): Observable<any> => {
  //     return this._HttpClient.post(
  //       baseUrl + '/api/v1/auth/forgotPasswords',
  //       email
  //     );
  //   };

  //   verifyResetCode = (code: any): Observable<any> => {
  //     return this._HttpClient.post(
  //       baseUrl + '/api/v1/auth/verifyResetCode',
  //       code
  //     );
  //   };

  //   resetPassword = (NewPass: any): Observable<any> => {
  //     return this._HttpClient.put(
  //       baseUrl + '/api/v1/auth/resetPassword',
  //       NewPass
  //     );
  //   };
}
