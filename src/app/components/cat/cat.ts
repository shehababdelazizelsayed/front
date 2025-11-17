import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';

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
export class Cat implements OnInit {
  categories: Category[] = [];
  loading = false;
  errorMessage = '';

  constructor(private router: Router, private api: Api) {}

  ngOnInit(): void {
    this.fetchTopCategories();
  }

  fetchTopCategories(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getTopCategories().subscribe({
      next: (response) => {
        this.categories = response.categories.map((cat: any) => ({
          name: cat.name,
          count: cat.count,
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.errorMessage = 'Failed to load categories';
        this.loading = false;
      },
    });
  }

  navigateToCategory(category: string) {
    this.router.navigate(['/category'], { queryParams: { cat: category.toLowerCase() } });
  }
}
