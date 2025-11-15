import { Component, OnInit, OnDestroy } from '@angular/core';
import { Api } from '../../services/api';
import { SocketService, Notification } from '../../services/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, OnDestroy {
  totalUsers = 0;
  totalBooks = 0;
  totalOrders = 0;
  isLoading = false;

  // Notification properties
  notifications: Notification[] = [];
  isSocketConnected = false;
  private destroy$ = new Subject<void>();

  constructor(private api: Api, private socketService: SocketService) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.initializeWebSocket();
    this.subscribeToNotifications();
  }

  /**
   * Initialize WebSocket connection
   */
  private initializeWebSocket(): void {
    // Get user ID from localStorage or auth service
    const userId = localStorage.getItem('userId') || 'admin';
    this.socketService.connect(userId);

    // Subscribe to connection status
    this.socketService
      .getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isSocketConnected = status;
        console.log('WebSocket connected:', status);
      });
  }

  /**
   * Subscribe to real-time notifications
   */
  private subscribeToNotifications(): void {
    this.socketService
      .getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
  }

  loadDashboardData() {
    this.isLoading = true;

    Promise.all([
      this.api.getAllBooksForAdmin().toPromise(),

      this.api.getOrders().toPromise(),
      this.api.getAllUsersForAdmin
        ? this.api.getAllUsersForAdmin().toPromise()
        : Promise.resolve([]),
    ])
      .then(([books, orders, users]: any) => {
        this.totalBooks = books?.books?.length || 0;
        this.totalOrders = orders?.length || 0;
        this.totalUsers = users?.length || 0;
      })
      .catch((err) => console.error('Dashboard error:', err))
      .finally(() => (this.isLoading = false));
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.socketService.clearNotifications();
  }

  /**
   * Remove a specific notification
   */
  removeNotification(index: number): void {
    this.socketService.removeNotification(index);
  }

  /**
   * Get notification icon based on type
   */
  getNotificationIcon(type: string): string {
    if (type === 'order') {
      return 'bi-bag-check-fill';
    } else if (type === 'book') {
      return 'bi-book-half';
    }
    return 'bi-bell-fill';
  }

  /**
   * Get notification badge color based on type
   */
  getNotificationBadgeClass(type: string): string {
    if (type === 'order') {
      return 'badge bg-success';
    } else if (type === 'book') {
      return 'badge bg-info';
    }
    return 'badge bg-secondary';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socketService.disconnect();
  }
}
