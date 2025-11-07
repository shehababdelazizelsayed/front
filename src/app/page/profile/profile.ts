import { Component } from '@angular/core';
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
    firstName: 'shehab',
    lastName: 'abdelaziz',
    email: 'shehab@gmail.com',
    phone: '01023323888',
    Role: 'User',
  };

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

    const toastEl = document.getElementById('passwordToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }

    this.closeModal();
  }

  orders = [
    {
      id: 1,
      number: 'ORD-1234',
      date: 'Jan 11, 2024',
      status: 'Delivered',
      items: 3,
      total: 84.97,
    },
    {
      id: 2,
      number: 'ORD-2234',
      date: 'Jan 12, 2024',
      status: 'Delivered',
      items: 3,
      total: 84.97,
    },
    {
      id: 3,
      number: 'ORD-3234',
      date: 'Jan 13, 2024',
      status: 'Delivered',
      items: 3,
      total: 84.97,
    },
  ];

  wishlistItems = [
    { id: 1, title: 'Book Title 1', author: 'Author Name', price: '$24.99' },
    { id: 2, title: 'Book Title 2', author: 'Author Name', price: '$24.99' },
    { id: 3, title: 'Book Title 3', author: 'Author Name', price: '$24.99' },
    { id: 4, title: 'Book Title 4', author: 'Author Name', price: '$24.99' },
  ];

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
    console.log('Profile saved:', this.profile);
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
