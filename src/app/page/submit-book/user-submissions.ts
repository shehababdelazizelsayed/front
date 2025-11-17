import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-submissions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-submissions.html',
  styleUrls: ['./user-submissions.css']
})
export class UserSubmissionsComponent implements OnInit {
  pendingBooks: any[] = [];
  isLoading = true;

  constructor(
    private apiService: Api,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUserPendingBooks();
  }

  loadUserPendingBooks() {
    this.isLoading = true;
    this.apiService.getUserPendingBooks().subscribe({
      next: (response) => {
        this.pendingBooks = response.pendingBooks || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Load user pending books error:', error);
        this.notificationService.showError(error.error?.message || 'Failed to load submissions');
        this.isLoading = false;
      }
    });
  }
}
