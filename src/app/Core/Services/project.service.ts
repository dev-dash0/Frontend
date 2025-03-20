import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private _HttpClient: HttpClient) {}
  
    getProjectData = (): Observable<any> => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      });
      return this._HttpClient.get(
        baseUrl +
          '/api/Project?tenantid=11',
        // '/api/Project?tenantid=<integer>&search=<string>&pageSize=0&pageNumber=1',
        {
          headers,
        }
      );
    };
  
}
