import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private _HttpClient: HttpClient) {}

  getProfileData = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.get(baseUrl + '/api/Account/Profile', {
      headers,
    });
  };

  RemoveAccount = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.delete(baseUrl + '/api/Account/RemoveAccount', {
      headers,
    });
  };

  //For update view after Upgrade to premium plan
  private profileUpdatedSource = new Subject<void>(); // Emits event when issue is created
  profileUpdated$ = this.profileUpdatedSource.asObservable();

  notifyProfileUpdated() {
    this.profileUpdatedSource.next();
  }

}
