import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '../admin-dashboard/admin-dashboard';
import { ManageUsers } from '../manage-users/manage-users';
import { ManageBooks } from '../manage-books/manage-books';
import { ManageOrders } from '../manage-orders/manage-orders';
import { ManagePendingBooksComponent } from '../manage-pending-books/manage-pending-books';

const routes: Routes = [
  { path: '', component: AdminDashboard },
  { path: 'users', component: ManageUsers },
  { path: 'books', component: ManageBooks },
  { path: 'pending-books', component: ManagePendingBooksComponent },
  { path: 'orders', component: ManageOrders },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
