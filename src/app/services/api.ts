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
  addBookToCart(BookId: string, Qty: number = 1): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.post(
      `${this.baseUrl}/cart`,
      { BookId, Qty },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }
  getCartItems(): Observable<{ items: CartItem[] }> {
    const token = localStorage.getItem('jwt');
    return this.http.get<{ items: CartItem[] }>(`${this.baseUrl}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateUserProfile(data: any): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.patch(`${this.baseUrl}/Users/Profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getOrders(): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.get(`${this.baseUrl}/Orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books?limit=12`);
  }
  DisplayHome(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books`);
  }
  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Books/${id}`);
  }

  /**
   * Verify a payment session on the backend. Returns an object containing
   * success flag and optional order metadata.
   */
  verifyPaymentSession(sessionId: string): Observable<any> {
    // Some backends expect `sessionId` while others expect `session_id`.
    // Send both to be tolerant. Include auth header if available (some APIs
    // may require user context to verify the session)
    const token = localStorage.getItem('jwt');
    const body = { sessionId, session_id: sessionId };
    const options: any = {};
    if (token) {
      options.headers = { Authorization: `Bearer ${token}` };
    }
    return this.http.post(`${this.baseUrl}/payment/verify-session`, body, options);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/Register`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Users/Login`, data);
  }

  removeFromCart(bookId: string) {
    const token = localStorage.getItem('jwt');
    return this.http.delete(`${this.baseUrl}/Cart/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateCartItem(BookId: string, Quantity: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.put(
      `${this.baseUrl}/Cart`,
      { BookId, Quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  // Review endpoints
  getReviewsByBookId(bookId: string): Observable<{ reviews: Review[] }> {
    return this.http.get<{ reviews: Review[] }>(`${this.baseUrl}/Reviews/${bookId}`);
  }

  addReview(review: { Book: string; Rating: number; Review: string }): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/Reviews`, review);
  }

  editReview(reviewId: string, review: { Rating: number; Review: string }): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/Review/${reviewId}`, review);
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Review/${reviewId}`);
  }

  // Wishlist endpoints
  addToWishlist(bookId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/wishlist`, { bookId });
  }

  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wishlist/${bookId}`);
  }
  // ---------- Admin Book Management ----------

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
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  rejectBook(bookId: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.patch(
      `${this.baseUrl}/Books/${bookId}/reject`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
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
