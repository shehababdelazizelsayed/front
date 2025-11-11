import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { Api } from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  featuredBooks: Book[] = [];
  loading = false;
  errorMessage = '';

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.loading = true;

    this.api.DisplayHome().subscribe({
      next: (response) => {
        this.featuredBooks = response.books.map((b: any) => ({
          id: b._id,
          title: b.Title,
          author: b.Author,
          genre: b.Genre || 'Unknown',
          price: b.Price,
          description: b.Description,
          image: b.Image || 'assets/books/default.jpg',
        }));

        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load books';
        this.loading = false;
      },
    });
  }
}
