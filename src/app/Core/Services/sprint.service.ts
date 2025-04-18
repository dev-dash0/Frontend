import { Sprint } from './../interfaces/sprint';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(private _HttpClient: HttpClient) {}
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.token}`,
  });
  private sprintCreatedSource = new BehaviorSubject<boolean>(false);
  private sprintUpdatedSource = new BehaviorSubject<boolean>(false);
  private sprintDeletedSource = new BehaviorSubject<boolean>(false);

  sprintCreated$ = this.sprintCreatedSource.asObservable();
  sprintUpdated$ = this.sprintUpdatedSource.asObservable();
  sprintDeleted$ = this.sprintDeletedSource.asObservable();

  notifySprintDeleted() {
    this.sprintDeletedSource.next(true);
  }
  notifySprintCreated() {
    this.sprintCreatedSource.next(true);
  }
  notifySprintUpdated() {
    this.sprintUpdatedSource.next(true);
  }

  createSprint(sprint: any, projectId: any): Observable<any> {
    return this._HttpClient.post(
      baseUrl + `/api/Sprint?projectId=${projectId}`,
      sprint,
      { headers: this.headers }
    );
  }

  getAllSprints(projectId: any, search: string | null = null): Observable<any> {
    const searchParam = search ? `search=${encodeURIComponent(search)}` : '';
    return this._HttpClient.get(
      baseUrl +
        `/api/Sprint?projectid=${projectId}&search=${searchParam}&pageSize=0&pageNumber=1`,
      { headers: this.headers }
    );
  }

  getSprintData(sprintId: any): Observable<any> {
    return this._HttpClient.get(baseUrl + `/api/Sprint/${sprintId}`, {
      headers: this.headers,
    });
  }

  updateSprint(sprintId: any, sprint: any): Observable<any> {
    return this._HttpClient.put(baseUrl + `/api/Sprint/${sprintId}`, sprint, {
      headers: this.headers,
    });
  }

  deleteSprint(sprintId: any): Observable<any> {
    return this._HttpClient.delete(baseUrl + `/api/Sprint/${sprintId}`, {
      headers: this.headers,
    });
  }
}
