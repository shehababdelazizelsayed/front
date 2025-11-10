import { Component, Input } from '@angular/core';

// export interface Book {
//   title: string;
//   author: string;
//   genre: string;
//   price: string;
//   image: string;
// }
export interface Book {
  id?: string | number;
  title: string;
  author: string;
  price: number;
  genre?: string;
  description?: string;
  image?: string;
}
@Component({
  selector: 'app-book-card',
  standalone: false,
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  @Input() book!: Book;

  protected addToCart() {
    console.log('Adding to cart:', this.book.title);
  }
}
