import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { ManageBooks } from '../manage-books/manage-books';
import { ManageOrders } from '../manage-orders/manage-orders';
import { ManageUsers } from '../manage-users/manage-users';
import { AdminRoutingModule } from './admin-routing-module';

@NgModule({
  declarations: [AdminDashboard, ManageUsers, ManageBooks, ManageOrders],
  imports: [CommonModule, FormsModule, RouterModule, AdminRoutingModule],
})
export class AdminModule {}
