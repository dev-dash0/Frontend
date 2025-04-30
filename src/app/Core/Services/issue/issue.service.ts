import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { baseUrl } from '../../environment/environment.local';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../interfaces/User';

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

  createBacklogIssue(projectId: number, issueData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
      // Don't set 'Content-Type' header manually when using FormData
    });

    return this._HttpClient.post(
      `${baseUrl}/api/Issue/backlog?projectId=${projectId}`,
      issueData,
      { headers: headers }
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

  updateIssue(issueId: number, issueData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
      // Don't set 'Content-Type' header manually when using FormData
    });

    return this._HttpClient.put(`${baseUrl}/api/Issue/${issueId}`, issueData, {
      headers: headers,
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

  showError(err: string) {
    this.toastr.error(err, 'Error Message', {
      toastClass: 'toast-pink',
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      progressAnimation: 'decreasing',
    });
  }


  statuses = [
    { value: 'BackLog', label: 'Backlog', icon: 'assets/images/Issue Status/backlog.svg', colorClass: 'text-muted' },
    { value: 'to do', label: 'To Do', icon: 'assets/images/Issue Status/todo.svg', colorClass: 'text-primary' },
    { value: 'In Progress', label: 'In Progress', icon: 'assets/images/Issue Status/in-progress.svg', colorClass: 'text-warning' },
    { value: 'Reviewing', label: 'Reviewing', icon: 'assets/images/Issue Status/reviewing.svg', colorClass: 'text-info' },
    { value: 'Completed', label: 'Completed', icon: '../../assets/images/Issue Status/Completed.svg', colorClass: 'text-success' },
    { value: 'Canceled', label: 'Canceled', icon: 'assets/images/Issue Status/canceled.svg', colorClass: 'text-danger' },
    { value: 'Postponed', label: 'Postponed', icon: 'assets/images/Issue Status/postponed.svg', colorClass: 'text-secondary' }
  ];

  //Priority
  Priorities = [
    { value: 'Low', label: 'Low', icon: 'assets/images/Issue Priorities/low.svg' },
    { value: 'Medium', label: 'Normal', icon: 'assets/images/Issue Priorities/normal.svg' },
    { value: 'High', label: 'High', icon: 'assets/images/Issue Priorities/high.svg' },
    { value: 'Critical', label: 'Urgent', icon: 'assets/images/Issue Priorities/urgent.svg' },
  ];



  // **********************Assign Users**********************
  // assignUserToIssue(userId: number, issueId: number): Observable<any> {
  //   const body = { userId, issueId };
  //   return this._HttpClient.post(`${baseUrl}/api/IssueAssignedUser`, body, {
  //     headers: this.headers,
  //   });
  // }

  // removeUserFromIssue(userId: number, issueId: number): Observable<any> {
  //   const body = { userId, issueId };
  //   return this._HttpClient.delete(`${baseUrl}/api/IssueAssignedUser`, {
  //     headers: this.headers,
  //     body,
  //   });
  // }


  assignUserToIssue(userId: number, issueId: number): Observable<any> {
    const body = { userId, issueId };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      Accept: 'text/plain',


      // add Authorization or other headers here if needed
    });
    console.log('Assign user body:', body); // Add this to debug
    return this._HttpClient.post(`${baseUrl}/api/IssueAssignedUser`, body, { headers });
  }

  removeUserFromIssue(userId: number, issueId: number): Observable<any> {
    const body = { userId, issueId };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
      Accept: 'text/plain',

    });
    console.log('Assign user body:', body); // Add this to debug
    return this._HttpClient.request('delete', `${baseUrl}/api/IssueAssignedUser`, {
      body,
      headers
    });
  }

  private assignedUsersMap = new Map<number, User[]>();

  getAssignedUsers(issueId: number): User[] {
    return this.assignedUsersMap.get(issueId) || [];
  }

  setAssignedUsers(issueId: number, users: User[]) {
    this.assignedUsersMap.set(issueId, users);
  }

  // assignUserToIssue(userId: number, issueId: number): void {
  //   this._HttpClient.post(`${baseUrl}/api/IssueAssignedUser`, { userId, issueId }, {
  //     headers: this.headers,
  //   }).subscribe({
  //     next: () => {
  //       this.toastr.success('User assigned successfully');
  //     },
  //     error: () => {
  //       this.toastr.error('Failed to assign user');
  //     }
  //   });
  // }
  // ///////////////////////////

}