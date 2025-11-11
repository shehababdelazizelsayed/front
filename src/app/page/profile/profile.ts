import { Component } from '@angular/core';
import { Api } from '../../services/api';
import * as bootstrap from 'bootstrap';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements AfterViewInit {
  activeTab = 'profile';

  private twoFactorModal: bootstrap.Modal | null = null;
  isTwoFactorEnabled = false;

  confirmDelete = false;
  private deleteModal: bootstrap.Modal | null = null;

  twoFactorPhone = '';

  profile = {
    name: '',
    email: '',
    Role: '',
    id: '',
  };
  jwtPayload: any = null;
  error: string = '';
  constructor(private api: Api) {
    this.loadProfileFromJWT();
  }

  loadProfileFromJWT() {
    const token = localStorage.getItem('jwt');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.jwtPayload = payload;
      this.profile.name = payload.Name || payload.name || '';
      this.profile.email = payload.Email || payload.email || '';
      this.profile.Role = payload.Role || payload.role || '';
      this.profile.id = payload.id || payload._id || '';
    } catch (e) {
      this.error = 'Invalid token';
    }
  }

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  private modal: bootstrap.Modal | null = null;

  ngAfterViewInit() {
    const modalEl = document.getElementById('changePasswordModal');
    if (modalEl) {
      this.modal = new bootstrap.Modal(modalEl, { backdrop: 'static' });
    }
    const twoFactorEl = document.getElementById('twoFactorModal');
    if (twoFactorEl) {
      this.twoFactorModal = new bootstrap.Modal(twoFactorEl, { backdrop: 'static' });
    }
    const deleteEl = document.getElementById('deleteAccountModal');
    if (deleteEl) this.deleteModal = new bootstrap.Modal(deleteEl, { backdrop: 'static' });
  }

  openModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }
  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    this.error = '';
    this.api
      .updateUserProfile({
        CurrentPassword: this.currentPassword,
        NewPassword: this.newPassword,
        ConfirmPassword: this.confirmPassword,
      })
      .subscribe({
        next: (result: any) => {
          if (result.user) {
            this.profile.name = result.user.Name || this.profile.name;
            this.profile.email = result.user.Email || this.profile.email;
            this.profile.Role = result.user.Role || this.profile.Role;
          }
          this.error = '';
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Password update failed';
        },
      });
    this.closeModal();
  }

  notifications = {
    email: true,
    sms: true,
    orders: true,
    marketing: false,
  };

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  saveProfile() {
    this.error = '';
    this.api.updateUserProfile({ Name: this.profile.name }).subscribe({
      next: (result: any) => {
        if (result.user) {
          this.profile.name = result.user.Name || this.profile.name;
          this.profile.email = result.user.Email || this.profile.email;
          this.profile.Role = result.user.Role || this.profile.Role;
        }
        this.error = '';
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Update failed';
      },
    });
  }

  orders: any[] = [];

  fetchOrders() {
    this.api.getOrders().subscribe({
      next: (res: any) => {
        this.orders = Array.isArray(res.orders) ? res.orders : res;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to load orders';
      },
    });
  }

  openTwoFactorModal() {
    this.twoFactorModal?.show();
  }

  closeTwoFactorModal() {
    this.twoFactorModal?.hide();
  }

  enableTwoFactor() {
    if (!this.twoFactorPhone) {
      alert('Please enter a valid phone number.');
      return;
    }

    this.isTwoFactorEnabled = true;
    this.closeTwoFactorModal();

    const toastEl = document.getElementById('passwordToast');
    if (toastEl) {
      toastEl.querySelector('.toast-body')!.textContent = '✅ Two-Factor Authentication enabled!';
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  disableTwoFactor() {
    this.isTwoFactorEnabled = false;
    this.closeTwoFactorModal();

    const toastEl = document.getElementById('passwordToast');
    if (toastEl) {
      toastEl.querySelector('.toast-body')!.textContent = '❌ Two-Factor Authentication disabled.';
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  openDeleteModal() {
    this.confirmDelete = false;
    this.deleteModal?.show();
  }

  closeDeleteModal() {
    this.deleteModal?.hide();
  }

  deleteAccount() {
    this.closeDeleteModal();

    const toastEl = document.getElementById('passwordToast');
    if (toastEl) {
      toastEl.querySelector('.toast-body')!.textContent = '💀 Account deleted successfully.';
      toastEl.classList.remove('text-bg-success');
      toastEl.classList.add('text-bg-danger');
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }

    console.warn('User account deleted!');
  }
}
