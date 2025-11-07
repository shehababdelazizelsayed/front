import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Category {
  name: string;

  count: number;
}

@Component({
  selector: 'app-cat',
  standalone: false,
  templateUrl: './cat.html',
  styleUrl: './cat.css',
})
export class Cat {
  categories: Category[] = [
    {
      name: 'Fiction',
      count: 245,
    },
    {
      name: 'Non-Fiction',

      count: 189,
    },
    {
      name: 'Science Fiction',

      count: 156,
    },
    {
      name: 'Technology',

      count: 178,
    },
    {
      name: 'Business',

      count: 134,
    },
  ];

  constructor(private router: Router) {}

  navigateToCategory(category: string) {
    this.router.navigate(['/category'], { queryParams: { cat: category.toLowerCase() } });
  }
}
