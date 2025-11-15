import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  type: 'order' | 'book';
  id?: string;
  title?: string;
  message: string;
  timestamp: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  constructor() {}

  /**
   * Initialize WebSocket connection
   */
  connect(userId: string | number): void {
    if (this.socket?.connected) {
      return;
    }

    const apiUrl = 'http://localhost:5000'; // Change to your backend URL

    this.socket = io(apiUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.connectedSubject.next(true);
      this.registerUser(userId);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.connectedSubject.next(false);
    });

    // Listen for order created events
    this.socket.on('order:created', (data) => {
      this.handleOrderNotification(data);
    });

    // Listen for book added events
    this.socket.on('book:added', (data) => {
      this.handleBookNotification(data);
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  /**
   * Register user with the WebSocket server
   */
  private registerUser(userId: string | number): void {
    if (this.socket) {
      this.socket.emit('register', { userId });
    }
  }

  /**
   * Handle order notification
   */
  private handleOrderNotification(data: any): void {
    const notification: Notification = {
      type: 'order',
      id: data.orderId,
      message: data.message,
      timestamp: data.timestamp,
      data: {
        total: data.total,
        itemCount: data.itemCount,
        userId: data.userId,
      },
    };
    this.addNotification(notification);
  }

  /**
   * Handle book notification
   */
  private handleBookNotification(data: any): void {
    const notification: Notification = {
      type: 'book',
      id: data.bookId,
      title: data.title,
      message: data.message,
      timestamp: data.timestamp,
      data: {
        author: data.author,
        category: data.category,
        price: data.price,
        stock: data.stock,
      },
    };
    this.addNotification(notification);
  }

  /**
   * Add a notification to the list
   */
  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];

    // Keep only last 20 notifications
    if (updatedNotifications.length > 20) {
      updatedNotifications.pop();
    }

    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Remove a specific notification
   */
  removeNotification(index: number): void {
    const currentNotifications = this.notificationsSubject.value;
    currentNotifications.splice(index, 1);
    this.notificationsSubject.next([...currentNotifications]);
  }

  /**
   * Get notifications as observable
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  /**
   * Get connection status as observable
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connected$;
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectedSubject.next(false);
    }
  }
}
