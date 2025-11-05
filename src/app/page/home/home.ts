import { Component } from '@angular/core';
import { Book } from '../../components/book-card/book-card';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  protected featuredBooks: Book[] = [
    {
      title: 'The Art of Programming',
      author: 'John Smith',
      genre: 'Technology',
      price: '$49.99',
      image: '/assets/books/book1.jpg',
    },
    {
      title: 'Digital Dreams',
      author: 'Sarah Johnson',
      genre: 'Science Fiction',
      price: '$39.99',
      image: '/assets/books/book2.jpg',
    },
    {
      title: 'Web Development Mastery',
      author: 'Michael Brown',
      genre: 'Education',
      price: '$44.99',
      image: '/assets/books/book3.jpg',
    },
    {
      title: 'The Future of AI',
      author: 'Emily Chen',
      genre: 'Technology',
      price: '$54.99',
      image: '/assets/books/book4.jpg',
    },
  ];
}
