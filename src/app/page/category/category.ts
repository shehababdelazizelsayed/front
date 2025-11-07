import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Book } from '../../models/book.model';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit, OnDestroy {
  protected selectedCategory: string = 'all';
  protected selectedSort: string = 'newest';
  protected selectedPrice: string = 'all';
  protected searchQuery: string = '';

  protected categories: string[] = [
    'all',
    'Fiction',
    'Non-Fiction',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Technology',
  ];

  protected priceRanges: string[] = ['all', 'under-15', '15-30', '30-50', 'over-50'];
  protected sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  protected allBooks: Book[] = [
    {
      id: 1,
      title: 'The Art of Programming',
      author: 'John Smith',
      genre: 'Technology',
      price: '$49.99',
      image: '/assets/books/book1.jpg',
    },
    {
      id: 2,
      title: 'Digital Dreams',
      author: 'Sarah Johnson',
      genre: 'Science Fiction',
      price: '$39.99',
      image: '/assets/books/book2.jpg',
    },
    {
      id: 3,
      title: 'Web Development Mastery',
      author: 'Michael Brown',
      genre: 'Technology',
      price: '$44.99',
      image: '/assets/books/book3.jpg',
    },
    {
      id: 4,
      title: 'Mystery at Midnight',
      author: 'Emily Chen',
      genre: 'Mystery',
      price: '$29.99',
      image: '/assets/books/book4.jpg',
    },
    {
      id: 5,
      title: 'The Business Mind',
      author: 'Robert Wilson',
      genre: 'Non-Fiction',
      price: '$54.99',
      image: '/assets/books/book5.jpg',
    },
  ];

  protected books: Book[] = [];
  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService, private route: ActivatedRoute) {}

  ngOnInit() {
    // Subscribe to search query changes
    this.searchService.searchQuery$.pipe(takeUntil(this.destroy$)).subscribe((query) => {
      this.searchQuery = query;
      this.applyFilters();
    });

    // Get category from route params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['cat']) {
        this.selectedCategory = params['cat'].toLowerCase();
        this.applyFilters();
      }
    });

    this.books = [...this.allBooks];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected applyFilters() {
    this.searchService.filterBooks(this.allBooks, {
      query: this.searchQuery,
      category: this.selectedCategory,
      priceRange: this.selectedPrice,
      sortBy: this.selectedSort,
    });

    this.searchService.filteredBooks$.pipe(takeUntil(this.destroy$)).subscribe((filteredBooks) => {
      this.books = filteredBooks;
    });
  }

  protected onCategoryChange(category: string) {
    this.selectedCategory = category.toLowerCase();
    this.applyFilters();
  }

  protected onSortChange() {
    this.applyFilters();
  }

  protected onPriceRangeChange(range: string) {
    this.selectedPrice = range;
    this.applyFilters();
  }
}
