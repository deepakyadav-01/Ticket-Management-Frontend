import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private http: HttpClient) { }

  getTickets(page: number, pageSize: number, sort?: string, filter?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (sort) {
      params = params.set('sort', sort);
    }

    if (filter) {
      Object.keys(filter).forEach(key => {
        if (filter[key]) {
          params = params.set(key, filter[key]);
        }
      });
    }

    return this.http.get<any>(`${environment.apiUrl}/api/v1/tickets`, { params });
  }

  getTicket(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/tickets/${id}`);
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/v1/tickets`, ticket);
  }

  updateTicket(id: string, ticket: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/api/v1/tickets/${id}`, ticket);
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/api/v1/tickets/${id}`);
  }
}