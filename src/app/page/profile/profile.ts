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





  // Order details modal
  private orderDetailsModal: bootstrap.Modal | null = null;
  selectedOrder: any = null;

  // My Books modal
  private myBooksModal: bootstrap.Modal | null = null;
  selectedBook: any = null;



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

  /** Helper to resolve book titles for order items when only BookId is present */
  private resolveBookTitles(items: any[]) {
    if (!Array.isArray(items)) return;
    items.forEach((it) => {
      // normalize possible id locations
      const bookId = it?.Book?._id || it?.BookId || (typeof it?.Book === 'string' ? it.Book : null);
      // if we already have a nested Book with Title, skip
      if ((it?.Book && it.Book.Title) || !bookId) return;

      this.api.getBookById(String(bookId)).subscribe({
        next: (b: any) => {
          try {
            // prefer nested Book object
            if (!it.Book) it.Book = {};
            // backend may return { book: {...} } or { message, book }
            const title =
              b?.book?.Title ||
              b?.book?.title ||
              b?.data?.Title ||
              b?.Title ||
              b?.title ||
              (Array.isArray(b) && b[0] && (b[0].Title || b[0].title));
            if (title) {
              it.Book.Title = title;
              it._resolvedTitle = title;
            } else {
              console.debug('[Profile] could not resolve title for', bookId, b);
            }
            // also resolve price if available from the book response
            const price =
              b?.book?.Price ||
              b?.book?.price ||
              b?.Price ||
              b?.price ||
              b?.data?.Price ||
              (Array.isArray(b) && b[0] && (b[0].Price || b[0].price));
            if (price != null) {
              // normalize to number
              const p = Number(price);
              it.Book.Price = p;
              it._resolvedPrice = p;
            }
          } catch (e) {
            // ignore
          }
        },
        error: () => {
          // leave as-is if fetch fails
        },
      });
    });
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


    const orderDetailsEl = document.getElementById('orderDetailsModal');
    if (orderDetailsEl)
      this.orderDetailsModal = new bootstrap.Modal(orderDetailsEl, { backdrop: 'static' });
    const myBooksEl = document.getElementById('myBooksDetailsModal');
    if (myBooksEl)
      this.myBooksModal = new bootstrap.Modal(myBooksEl, { backdrop: 'static' });
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
    if (tab === 'orders' && this.orders.length === 0) {
      this.fetchOrders();
    }
    if (tab === 'mybooks' && this.userBooks.length === 0) {
      this.fetchUserBooks();
    }
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

  // My Books properties
  userBooks: any[] = [];
  userBooksLoading = false;
  userBooksError = '';

  fetchOrders() {
    this.api.getOrders().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : Array.isArray(res.orders) ? res.orders : [];
        this.orders = list.map((order: any) => ({
          id: order._id,
          number: order._id ? String(order._id).slice(-6) : '',
          date: order.createdAt ? new Date(order.createdAt).toLocaleString() : '',
          status: order.Status || order.status || 'pending',
          items: Array.isArray(order.Books)
            ? order.Books.reduce((sum: number, it: any) => sum + (it.Quantity || 0), 0)
            : 0,
          total: order.TotalPrice || order.total || 0,
          raw: order,
        }));
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Failed to load orders';
      },
    });
  }

  fetchUserBooks() {
    this.userBooksLoading = true;
    this.userBooksError = '';
    this.api.getUserBooks().subscribe({
      next: (res: any) => {
        this.userBooksLoading = false;
        const booksList = Array.isArray(res) ? res : Array.isArray(res.books) ? res.books : [];
        this.userBooks = booksList.map((b: any) => ({
          id: b._id || b.BookId,
          title: b.Title || 'Untitled',
          author: b.Author || 'Unknown',
          description: b.Description || '',
          image: b.Image || '',
          pdf: b.Pdf || '',
          category: b.Category || '',
          price: b.Price || 0,
          raw: b,
        }));
      },
      error: (err: any) => {
        this.userBooksLoading = false;
        this.userBooksError = err?.error?.message || 'Failed to load your books';
      },
    });
  }

  openBookDetails(book: any) {
    this.selectedBook = book;
    this.myBooksModal?.show();
  }

  closeBookDetails() {
    this.selectedBook = null;
    this.myBooksModal?.hide();
  }

  downloadBook(bookPdfUrl: string, bookTitle: string) {
    if (bookPdfUrl) {
      const link = document.createElement('a');
      link.href = bookPdfUrl;
      link.download = `${bookTitle}.pdf`;
      link.click();

      // Show download notification
      const toastEl = document.getElementById('passwordToast');
      if (toastEl) {
        toastEl.querySelector('.toast-body')!.textContent =
          `Downloading "${bookTitle}"...`;
        toastEl.classList.add('text-bg-success');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    } else {
      // Show error if no PDF available
      const toastEl = document.getElementById('passwordToast');
      if (toastEl) {
        toastEl.querySelector('.toast-body')!.textContent = 'PDF not available for this book.';
        toastEl.classList.remove('text-bg-success');
        toastEl.classList.add('text-bg-warning');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
      }
    }
  }











  /** Open order details modal and set selected order */
  openOrderDetails(order: any) {
    this.selectedOrder = order;
    // Resolve book titles for items that only contain BookId
    this.resolveBookTitles(this.selectedOrder.raw?.Books || []);
    // Ensure we have freshest data: if raw not present, fetch single order? For now use raw
    this.orderDetailsModal?.show();
  }

  closeOrderDetails() {
    this.selectedOrder = null;
    this.orderDetailsModal?.hide();
  }
  logout() {
    localStorage.removeItem('jwt');
    window.location.href = '/';
  }

  // Upload book properties
  uploadForm = {
    Title: '',
    Author: '',
    Price: 0,
    Description: '',
    Stock: 0,
    Category: '',
    image: null as File | null,
    pdf: null as File | null,
  };

  uploadError: string = '';
  uploadSuccess: string = '';
  isUploading = false;

  onFileSelected(event: any, fieldName: 'image' | 'pdf') {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm[fieldName] = file;
    }
  }

  uploadBook() {
    this.uploadError = '';
    this.uploadSuccess = '';

    // Validate form
    if (
      !this.uploadForm.Title ||
      !this.uploadForm.Author ||
      !this.uploadForm.Price ||
      !this.uploadForm.Description ||
      !this.uploadForm.Category
    ) {
      this.uploadError = 'Please fill in all required fields.';
      return;
    }

    if (this.uploadForm.Price < 0) {
      this.uploadError = 'Price must be a positive number.';
      return;
    }

    if (this.uploadForm.Stock < 0) {
      this.uploadError = 'Stock must be a non-negative number.';
      return;
    }

    this.isUploading = true;

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('Title', this.uploadForm.Title);
    formData.append('Author', this.uploadForm.Author);
    formData.append('Price', String(this.uploadForm.Price));
    formData.append('Description', this.uploadForm.Description);
    formData.append('Stock', String(this.uploadForm.Stock));
    formData.append('Category', this.uploadForm.Category);

    if (this.uploadForm.image) {
      formData.append('image', this.uploadForm.image, this.uploadForm.image.name);
    }

    if (this.uploadForm.pdf) {
      formData.append('pdf', this.uploadForm.pdf, this.uploadForm.pdf.name);
    }

    // Call API to upload book
    this.api.addBook(formData).subscribe({
      next: (result: any) => {
        this.uploadSuccess =
          'Book uploaded successfully! It is pending admin approval and will appear once approved.';
        this.isUploading = false;
        // Reset form
        this.uploadForm = {
          Title: '',
          Author: '',
          Price: 0,
          Description: '',
          Stock: 0,
          Category: '',
          image: null,
          pdf: null,
        };
        // Clear file inputs
        const imageInput = document.getElementById('imageInput') as HTMLInputElement;
        const pdfInput = document.getElementById('pdfInput') as HTMLInputElement;
        if (imageInput) imageInput.value = '';
        if (pdfInput) pdfInput.value = '';
      },
      error: (err: any) => {
        this.isUploading = false;
        const errorMsg = err?.error?.message || err?.error?.errors?.[0] || 'Upload failed';
        this.uploadError = errorMsg;
      },
    });
  }
}
