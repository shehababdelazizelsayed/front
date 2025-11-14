import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api'
@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalUsers = 0;
  totalBooks = 0;
  totalOrders = 0;
  isLoading = false;

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.loadDashboardData();
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
}
