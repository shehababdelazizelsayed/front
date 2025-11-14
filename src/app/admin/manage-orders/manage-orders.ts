import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-manage-orders',
  standalone: false,
  templateUrl: './manage-orders.html',
  styleUrls: ['./manage-orders.css'],
})
export class ManageOrders implements OnInit {
  orders: any[] = [];
  isLoading = false;

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;

    this.api.getOrders().subscribe({
      next: (res) => {
        console.log("📌 ORDERS API RESPONSE:", res);

        // تأمين الـ response بحيث ميحصلش error
        this.orders = Array.isArray(res)
          ? res
          : res.orders || [];

        console.log("📌 FINAL ORDERS ARRAY:", this.orders);

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading orders:", err);
        this.isLoading = false;
      }
    });
  }
}
