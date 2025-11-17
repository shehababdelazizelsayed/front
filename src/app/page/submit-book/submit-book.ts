import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-submit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './submit-book.html',
  styleUrls: ['./submit-book.css']
})
export class SubmitBookComponent {
  bookData = {
    title: '',
    author: '',
    price: 0,
    category: '',
    stock: 0,
    description: ''
  };

  selectedImage: File | null = null;
  selectedPdf: File | null = null;
  isSubmitting = false;

  constructor(
    private apiService: Api,
    private notificationService: NotificationService
  ) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onPdfSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedPdf = file;
    }
  }

  onSubmit() {
    if (!this.bookData.title || !this.bookData.author || !this.bookData.price ||
        !this.bookData.category || !this.bookData.description) {
      this.notificationService.showError('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('Title', this.bookData.title);
    formData.append('Author', this.bookData.author);
    formData.append('Price', this.bookData.price.toString());
    formData.append('Category', this.bookData.category);
    formData.append('Stock', this.bookData.stock.toString());
    formData.append('Description', this.bookData.description);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.selectedPdf) {
      formData.append('pdf', this.selectedPdf);
    }

    this.apiService.submitPendingBook(formData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Book submitted for approval successfully!');
        this.resetForm();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Submit book error:', error);
        this.notificationService.showError(error.error?.message || 'Failed to submit book');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.bookData = {
      title: '',
      author: '',
      price: 0,
      category: '',
      stock: 0,
      description: ''
    };
    this.selectedImage = null;
    this.selectedPdf = null;

    // Reset file inputs
    const imageInput = document.getElementById('image') as HTMLInputElement;
    const pdfInput = document.getElementById('pdf') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
    if (pdfInput) pdfInput.value = '';
  }
}
