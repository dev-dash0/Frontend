import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';
import { Router } from '@angular/router';
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
