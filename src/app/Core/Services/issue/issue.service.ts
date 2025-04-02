import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private _HttpClient: HttpClient) { }

  token = localStorage.getItem('token') || '';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${this.token}`,
  });

  private issueCreatedSource = new Subject<void>(); // Emits event when issue is created
  issueCreated$ = this.issueCreatedSource.asObservable();
  private toastr = inject(ToastrService)

  notifyIssueCreated() {
    this.issueCreatedSource.next();
  }



  getBacklogIssues(
    projectId: number,
    pageSize: number = 0,
    pageNumber: number = 1,
    search?: string): Observable<any> {

    let params = new HttpParams()
      .set('projectId', projectId.toString())
      .set('pageSize', pageSize.toString())
      .set('pageNumber', pageNumber.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this._HttpClient.get(`${baseUrl}/api/Issue/backlog`,
      {
        headers: this.headers,
        params
      }
    );
  }

  createBacklogIssue(projectId: number, issueData: any): Observable<any> {
    return this._HttpClient.post(
      `${baseUrl}/api/Issue/backlog?projectId=${projectId}`,
      issueData,
      { headers: this.headers }
    );
  }


  getSprintIssues(sprintId: number, search: string = '', pageSize: number = 0, pageNumber: number = 1): Observable<any> {
    return this._HttpClient.get(
      `${baseUrl}/api/Issue/sprint?sprintId=${sprintId}&search=${search}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
      { headers: this.headers }
    );
  }

  postSprintIssue(sprintId: number, issueData: any): Observable<any> {
    return this._HttpClient.post(
      `${baseUrl}/api/Issue/sprint?sprintId=${sprintId}`,
      issueData,
      { headers: this.headers }
    );
  }


  getIssueById = (issueId: number): Observable<any> => {
    return this._HttpClient.get(`${baseUrl}/api/Issue/${issueId}`, {
      headers: this.headers,
    });
  };

  deleteIssue(issueId: number): Observable<any> {
    return this._HttpClient.delete(`${baseUrl}/api/Issue/${issueId}`, {
      headers: this.headers,
    });
  }

  updateIssue(issueId: number, issueData: any): Observable<any> {
    return this._HttpClient.put(`${baseUrl}/api/Issue/${issueId}`, issueData, {
      headers: this.headers,
    });
  }


  RemoveIssue(issueId: number) {
    this.deleteIssue(issueId).subscribe({
      next: () => {
        this.showSuccess();
        console.log('Issue deleted successfully');
      },
      error: (err) => {
        console.log('Error deleting Issue', err);
      }
    });
  }
  showSuccess() {
    this.toastr.success(
      'This issue has been removed',
      'Removed Successfully',
      {
        toastClass: 'toast-pink',
        timeOut: 5000, // Set to 5 seconds
        closeButton: true,
        progressBar: true,
        progressAnimation: 'decreasing',
      }
    );
  }
}
