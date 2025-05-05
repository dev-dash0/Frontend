import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private _HttpClient: HttpClient) {}

  getNotification = (): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.get(baseUrl + `/api/Notification`, {
      headers,
    });
  };

  markAsRead = (notificationId: number): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const url = `${baseUrl}/api/Notification/${notificationId}/mark-as-read`;

    return this._HttpClient.post(
      url,
      {},
      { headers }
    );
  };
}
