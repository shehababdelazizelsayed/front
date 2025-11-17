import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-manage-users',
  standalone: false,
  templateUrl: './manage-users.html',
  styleUrls: ['./manage-users.css'],
})
export class ManageUsers implements OnInit {
  users: any[] = [];
  isLoading = false;

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;

    this.api.getAllUsersForAdmin().subscribe({
      next: (res) => {

        // Force array — prevents NgFor errors
        this.users = Array.isArray(res) ? res : [];

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      },
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.api.deleteUserAsAdmin(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to delete user:', err),
    });
  }

  changeRole(id: string, newRole: string) {
    this.api.changeUserRoleAsAdmin(id, newRole).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to change role:', err),
    });
  }
}
