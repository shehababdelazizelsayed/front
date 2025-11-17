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

        this.orders = Array.isArray(res)
          ? res
          : res.orders || [];


        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading orders:", err);
        this.isLoading = false;
      }
    });
  }
}
