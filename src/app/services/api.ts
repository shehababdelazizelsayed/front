import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem } from '../models/book.model';

export interface Review {
  _id: string;
  User: string;
  Book: string;
  Rating: number;
  Review: string;
  CreatedAT: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ----------------- CART -----------------
  addBookToCart(BookId: string, Qty: number = 1): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.post(
      `${this.baseUrl}/cart`,
      { BookId, Qty },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  getCartItems(): Observable<{ items: CartItem[] }> {
    const token = localStorage.getItem('jwt');
    return this.http.get<{ items: CartItem[] }>(`${this.baseUrl}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateCartItem(BookId: string, Quantity: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.put(
      `${this.baseUrl}/Cart`,
      { BookId, Quantity },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  removeFromCart(bookId: string) {
    const token = localStorage.getItem('jwt');
    return this.http.delete(`${this.baseUrl}/Cart/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ----------------- USER PROFILE -----------------
  updateUserProfile(data: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.patch(`${this.baseUrl}/Users/Profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ----------------- ORDERS -----------------
  getOrders(): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.get(`${this.baseUrl}/Orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ----------------- BOOKS -----------------
  getBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books`);
  }

  DisplayHome(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books?limit=4`);
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books/${id}`);
  }

  addBook(formData: FormData): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.baseUrl}/Books`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ----------------- PAYMENT -----------------
  verifyPaymentSession(sessionId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    const body = { sessionId, session_id: sessionId };
    const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
    return this.http.post(`${this.baseUrl}/payment/verify-session`, body, { headers });
  }

  // ----------------- AUTH -----------------
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/Register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/Login`, data);
  }

  // ----------------- REVIEWS -----------------
  getReviewsByBookId(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/Reviews/${bookId}`);
  }

  addReview(reviewData: {
    BookId: string;
    Rating: number;
    Review: string;
  }): Observable<any> {
    // backend expects BookId not Book
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.baseUrl}/Reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  editReview(
    reviewId: string,
    data: { Rating?: number; Review?: string }
  ): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.put(`${this.baseUrl}/Review/${reviewId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteReview(reviewId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.delete(`${this.baseUrl}/Review/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ----------------- WISHLIST -----------------
  addToWishlist(bookId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { bookId });
  }

  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/${bookId}`);
  }

  // ----------------- AI ENDPOINT -----------------
  postAI(query: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    return this.http.post(`${this.baseUrl}/ai`, { query }, { headers });
  }

  // ----------------- ADMIN -----------------
  getAllBooksForAdmin(): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.get(`${this.baseUrl}/Admin/Books`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  addBookAsAdmin(book: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.baseUrl}/Books`, book, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateBookAsAdmin(bookId: string, bookData: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.put(`${this.baseUrl}/Books/${bookId}`, bookData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteBookAsAdmin(bookId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.delete(`${this.baseUrl}/Books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  approveBook(bookId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.patch(
      `${this.baseUrl}/Books/${bookId}/approve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  rejectBook(bookId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.patch(
      `${this.baseUrl}/Books/${bookId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  getAllUsersForAdmin(): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.get(`${this.baseUrl}/Admin/Users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getUserByIdForAdmin(userId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.get(`${this.baseUrl}/Admin/Users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteUserAsAdmin(userId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.delete(`${this.baseUrl}/Admin/Users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  changeUserRoleAsAdmin(userId: string, role: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.patch(
      `${this.baseUrl}/Admin/Users/role/${userId}`,
      { Role: role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
}
