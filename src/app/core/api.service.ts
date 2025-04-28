import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private redirectUrl: string | null = null;

  constructor(private http: HttpClient) {}

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string {
    return this.redirectUrl || '/tasks'; // Si no hay URL guardada, redirige a tasks
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }  

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks`, { headers: this.getAuthHeaders() });
  }

  createTask(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tasks`, data, { headers: this.getAuthHeaders() });
  }
  
  updateTask(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`, { headers: this.getAuthHeaders() });
  }
  
  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/${id}`, { headers: this.getAuthHeaders() });
  }

  getIndicators(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/indicators`, { headers: this.getAuthHeaders() });
  }

  getAllIndicators(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks/Allindicators`, { headers: this.getAuthHeaders() });
  }

  getTasksCompletedByWeek(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tasks/tasksCompletedByWeek`, { headers: this.getAuthHeaders() });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token; 
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    this.clearRedirectUrl();
  }

  
}