import { Component, OnInit } from '@angular/core';
import { Api } from '../../services/api';

@Component({
  selector: 'app-manage-books',
  standalone: false,
  templateUrl: './manage-books.html',
  styleUrls: ['./manage-books.css'],
})
export class ManageBooks implements OnInit {
  books: any[] = [];
  originalBooks: any[] = [];

  searchTitle = '';
  searchAuthor = '';

  newBookTitle = '';
  newBookAuthor = '';
  isLoading = false;

  constructor(private api: Api) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;

    this.api.getAllBooksForAdmin().subscribe({
      next: (res) => {
        this.originalBooks = res.books || [];
        this.books = [...this.originalBooks];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.isLoading = false;
      },
    });
  }

  filterBooks() {
    const title = this.searchTitle.toLowerCase();
    const author = this.searchAuthor.toLowerCase();

    this.books = this.originalBooks.filter(book => {
      const matchesTitle = book.Title.toLowerCase().includes(title);
      const matchesAuthor = book.Author.toLowerCase().includes(author);
      return matchesTitle && matchesAuthor;
    });
  }

  addBook() {
    if (!this.newBookTitle.trim() || !this.newBookAuthor.trim()) return;

    const newBook = {
      Title: this.newBookTitle,
      Author: this.newBookAuthor,
      Status: 'pending',
    };

    this.api.addBookAsAdmin(newBook).subscribe({
      next: () => {
        this.newBookTitle = '';
        this.newBookAuthor = '';
        this.loadBooks();
      },
      error: (err) => console.error('Failed to add book', err),
    });
  }

  approveBook(id: string) {
    this.api.approveBook(id).subscribe({
      next: () => this.loadBooks(),
      error: (err) => console.error('Failed to approve', err),
    });
  }

  rejectBook(id: string) {
    this.api.rejectBook(id).subscribe({
      next: () => this.loadBooks(),
      error: (err) => console.error('Failed to reject', err),
    });
  }

  deleteBook(id: string) {
    this.api.deleteBookAsAdmin(id).subscribe({
      next: () => this.loadBooks(),
      error: (err) => console.error('Failed to delete', err),
    });
  }
}
