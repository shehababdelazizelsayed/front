import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { Api } from '../../services/api';

@Component({
  selector: 'app-book-card',
  standalone: false,
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  @Input() book!: Book;
  addingToCart = false;
  addedToCart = false;

  constructor(private router: Router, private api: Api) {}

  protected addToCart() {
    if (!this.book?.id || this.addingToCart) return;

    this.addingToCart = true;
    this.api.addBookToCart(this.book.id, 1).subscribe({
      next: () => {
        this.addedToCart = true;
        this.addingToCart = false;
        // Reset the added indicator after 2 seconds
        setTimeout(() => {
          this.addedToCart = false;
        }, 2000);
      },
      error: (err: any) => {
        this.addingToCart = false;
        alert('Failed to add item to cart.');
      },
    });
  }

  protected viewProduct() {
    if (this.book.id) {
      this.router.navigate(['/product', this.book.id]);
    }
  }
}
