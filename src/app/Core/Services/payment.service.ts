import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../environment/environment.local';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {


  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createCheckoutSession() {
    return this.http.post<{ url: string }>(
      `${baseUrl}/api/Payment/create-checkout-session`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  updateUserStateToPremium() {
    return this.http.post<{ message: string }>(
      `${baseUrl}/api/Payment/changestate`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}
