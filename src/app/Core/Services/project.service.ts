import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private _HttpClient: HttpClient) {}

  getProjectData = (Tenantid: any): Observable<any> => {
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

  getProject = (projectId: any): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const params = new HttpParams().set('projectId', projectId.toString());
    return this._HttpClient.get(baseUrl + `/api/Project/${projectId}`, {
      headers,
      params,
    });
  };

  CreateProject = (Tenantid: any, user: any): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    const params = new HttpParams().set('Tenantid', Tenantid.toString());
    return this._HttpClient.post(
      baseUrl + `/api/Project?tenantid=${Tenantid}`,
      user,
      {
        headers,
        params,
      }
    );
  };

  getAllProjects(search: string | null = null): Observable<any> {
    const searchParam = search ? `search=${encodeURIComponent(search)}` : '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });
    return this._HttpClient.get(baseUrl + `/api/DashBoard/allproject`, {
      headers,
    });
  }

  JoinProject = (projectCode: string): Observable<any> => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    const params = new HttpParams().set('projectCode', projectCode.toString());

    return this._HttpClient.post(
      baseUrl + `/api/UserProject`, // ✅ Remove query parameter from URL
      {}, // ✅ Empty body since it's a POST request with params
      { headers, params }
    );
  };

  getAllProjectIds(): Observable<string[]> {
    return this.getAllProjects().pipe(
      map((response: any) => response.result.map((project: any) => project.id))
    );
  }
}
