import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  activeTab = 'profile';

  profile = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  };

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
}
