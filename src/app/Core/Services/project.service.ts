import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private _HttpClient: HttpClient) {}

  getProjectData = (Tenantid :any): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const params = new HttpParams().set('Tenantid', Tenantid.toString());
    return this._HttpClient.get(
      baseUrl + `/api/Project?tenantid=${Tenantid}`,
      // '/api/Project?tenantid=<integer>&search=<string>&pageSize=0&pageNumber=1',
      {
        headers,
        params,
      }
    );
  };

  CreateProject = (Tenantid :number): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const params = new HttpParams().set('Tenantid', Tenantid.toString());
    return this._HttpClient.post(
      baseUrl + `/api/Project?tenantid=${Tenantid}`,
      {
        headers,
        params,
      }
    );
  };
}
