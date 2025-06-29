import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private _HttpClient: HttpClient) {}
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  search(query: string): Observable<any> {
    const encodedQuery = encodeURIComponent(query);
    return this._HttpClient.get(baseUrl + `/global?query=${encodedQuery}`, {
      headers: this.headers,
    });
  }
}
