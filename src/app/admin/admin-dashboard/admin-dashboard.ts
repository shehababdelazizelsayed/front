import { Component, OnInit, OnDestroy } from '@angular/core';
import { Api } from '../../services/api';
import { SocketService, Notification } from '../../services/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';



// Simple model for pending books so we avoid "any"
interface PendingBookOwner {
  Name: string;
}

interface PendingBook {
  _id: string;
  Title: string;
  Author: string;
  Category: string;
  Price: number;
  Owner?: PendingBookOwner;
  createdAt: string;
}


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
  pendingBooksCount = 0;
  isLoading = false;
  pendingBooks: PendingBook[] = [];
  isPendingLoading = false;
  selectedPendingBook: PendingBook | null = null;
  rejectionReason = '';
  showApprovalModal = false;
  showRejectionModal = false;

  // Notification properties
  notifications: Notification[] = [];
  isSocketConnected = false;
  private destroyNotifier = new Subject<void>();

  constructor(private api: Api, private socketService: SocketService) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadPendingBooks();
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
      .pipe(takeUntil(this.destroyNotifier))
      .subscribe((status) => {
        this.isSocketConnected = status;
        // console.log('WebSocket connected:', status);
      });
  }

  /**
   * Subscribe to real-time notifications
   */
  private subscribeToNotifications(): void {
    this.socketService
      .getNotifications()
      .pipe(takeUntil(this.destroyNotifier))
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
      .catch((err) => {
        console.error('Dashboard error:', err);
      })
      .finally(() => (this.isLoading = false));
  }

  /**
   * Load pending books awaiting admin approval
   */
  loadPendingBooks(): void {
    this.isPendingLoading = true;
    this.api.getPendingBooks().subscribe({
      next: (response: any) => {
        this.pendingBooks = response.books || [];
        this.pendingBooksCount = response.count || 0;
        this.isPendingLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending books:', err);
        this.isPendingLoading = false;
      },
    });
  }

  /**
   * Approve a pending book
   */
  approvePendingBook(): void {
    if (!this.selectedPendingBook) return;

    this.api.approvePendingBook(this.selectedPendingBook._id).subscribe({
      next: () => {
        console.log('Book approved successfully');
        this.showApprovalModal = false;
        this.selectedPendingBook = null;
        this.loadPendingBooks();
        this.loadDashboardData();
        alert('Book approved and transferred to main collection!');
      },
      error: (err) => {
        console.error('Error approving book:', err);
        alert('Failed to approve book');
      },
    });
  }

  /**
   * Reject a pending book
   */
  rejectPendingBook(): void {
    if (!this.selectedPendingBook || !this.rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    this.api.rejectPendingBook(this.selectedPendingBook._id, this.rejectionReason).subscribe({
      next: () => {
        console.log('Book rejected successfully');
        this.showRejectionModal = false;
        this.selectedPendingBook = null;
        this.rejectionReason = '';
        this.loadPendingBooks();
        alert('Book rejected successfully');
      },
      error: (err) => {
        console.error('Error rejecting book:', err);
        alert('Failed to reject book');
      },
    });
  }

  /**
   * Open approval modal
   */
  openApprovalModal(book: any): void {
    this.selectedPendingBook = book;
    this.showApprovalModal = true;
  }

  /**
   * Open rejection modal
   */
  openRejectionModal(book: any): void {
    this.selectedPendingBook = book;
    this.rejectionReason = '';
    this.showRejectionModal = true;
  }

  /**
   * Close modals
   */
  closeModals(): void {
    this.showApprovalModal = false;
    this.showRejectionModal = false;
    this.selectedPendingBook = null;
    this.rejectionReason = '';
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
    this.destroyNotifier.next();
    this.destroyNotifier.complete();
    this.socketService.disconnect();
  }
}
