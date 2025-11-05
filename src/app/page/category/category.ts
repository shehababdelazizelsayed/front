import { Component } from '@angular/core';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  protected selectedCategory: string = 'All';
  protected selectedSort: string = 'newest';
  protected selectedPrice: string = 'all';

  protected categories: string[] = [
    'All',
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Technology',
  ];

  protected priceRanges: string[] = ['all', 'under-15', '15-30', '30-50', 'over-50'];

  protected books: Book[] = [
    {
      id: 1,
      title: 'The Art of Programming',
      author: 'John Smith',
      genre: 'Technology',
      price: '$49.99',
      image: '/assets/books/book1.jpg',
    },
    // Add more books as needed
  ];
}
