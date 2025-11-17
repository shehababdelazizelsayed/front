import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-manage-pending-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-pending-books.html',
  styleUrls: ['./manage-pending-books.css']
})
export class ManagePendingBooksComponent implements OnInit {
  pendingBooks: any[] = [];
  isLoading = true;
  processingBook: string | null = null;
  showRejectModal = false;
  selectedBook: any = null;
  rejectComment = '';

  constructor(
    private apiService: Api,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadPendingBooks();
  }

  loadPendingBooks() {
    this.isLoading = true;
    this.apiService.getPendingBooksForAdmin().subscribe({
      next: (response) => {
        this.pendingBooks = response.pendingBooks || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Load pending books error:', error);
        this.notificationService.showError(error.error?.message || 'Failed to load pending books');
        this.isLoading = false;
      }
    });
  }

  approveBook(bookId: string) {
    if (confirm('Are you sure you want to approve this book?')) {
      this.processingBook = bookId;
      this.apiService.approvePendingBook(bookId).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Book approved successfully!');
          this.loadPendingBooks(); // Refresh the list
          this.processingBook = null;
        },
        error: (error) => {
          console.error('Approve book error:', error);
          this.notificationService.showError(error.error?.message || 'Failed to approve book');
          this.processingBook = null;
        }
      });
    }
  }

  openRejectModal(book: any) {
    this.selectedBook = book;
    this.rejectComment = '';
    this.showRejectModal = true;
  }

  closeRejectModal() {
    this.showRejectModal = false;
    this.selectedBook = null;
    this.rejectComment = '';
  }

  rejectBook() {
    if (!this.rejectComment.trim()) {
      this.notificationService.showError('Please provide a rejection reason');
      return;
    }

    this.processingBook = this.selectedBook._id;
    this.apiService.rejectPendingBook(this.selectedBook._id, this.rejectComment).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Book rejected successfully!');
        this.closeRejectModal();
        this.loadPendingBooks(); // Refresh the list
        this.processingBook = null;
      },
      error: (error) => {
        console.error('Reject book error:', error);
        this.notificationService.showError(error.error?.message || 'Failed to reject book');
        this.processingBook = null;
      }
    });
  }
}
