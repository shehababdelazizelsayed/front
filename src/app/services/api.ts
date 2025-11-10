import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/book.model';
@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books?limit=12`);
  }
  DisplayHome(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books`);
  }
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/Register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/Login`, data);
  }

  getCartItems(): Observable<{ items: CartItem[] }> {
    return this.http.get<{ items: CartItem[] }>(`${this.baseUrl}/cart`);
  }

  removeFromCart(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/${id}`);
  }
  updateCartItem(id: string, quantity: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cart`, { quantity });
  }
}
