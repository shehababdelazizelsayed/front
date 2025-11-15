import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Book } from '../../models/book.model';
import { SearchService } from '../../services/search.service';
import { Api } from '../../services/api';

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

  // Pagination properties
  protected currentPage: number = 1;
  protected itemsPerPage: number = 12;
  protected totalBooks: number = 0;
  protected totalPages: number = 0;

  // categories and priceRanges will be populated dynamically from API response
  protected categories: string[] = ['all'];

  // price range keys: template knows how to render these specific keys
  protected priceRanges: string[] = ['all'];
  protected sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  // protected allBooks: Book[] = [
  //   {
  //     id: 1,
  //     title: 'The Art of Programming',
  //     author: 'John Smith',
  //     genre: 'Technology',
  //     price: '$49.99',
  //     image: '/assets/books/book1.jpg',
  //   },
  //   {
  //     id: 2,
  //     title: 'Digital Dreams',
  //     author: 'Sarah Johnson',
  //     genre: 'Science Fiction',
  //     price: '$39.99',
  //     image: '/assets/books/book2.jpg',
  //   },
  //   {
  //     id: 3,
  //     title: 'Web Development Mastery',
  //     author: 'Michael Brown',
  //     genre: 'Technology',
  //     price: '$44.99',
  //     image: '/assets/books/book3.jpg',
  //   },
  //   {
  //     id: 4,
  //     title: 'Mystery at Midnight',
  //     author: 'Emily Chen',
  //     genre: 'Mystery',
  //     price: '$29.99',
  //     image: '/assets/books/book4.jpg',
  //   },
  //   {
  //     id: 5,
  //     title: 'The Business Mind',
  //     author: 'Robert Wilson',
  //     genre: 'Non-Fiction',
  //     price: '$54.99',
  //     image: '/assets/books/book5.jpg',
  //   },
  // ];

  protected books: Book[] = [];
  // Full filtered list (un-paginated) used as source for pagination slicing
  protected filteredFull: Book[] = [];
  protected allBooks: Book[] = [];
  protected loading: boolean = false;
  protected errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private searchService: SearchService,
    private route: ActivatedRoute,
    private api: Api
  ) {}

  ngOnInit() {
    this.loadBooksFromApi();

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

    // Single subscription to filteredBooks$ - keeps pagination source stable and avoids
    // repeated subscriptions which can cause unexpected behavior.
    this.searchService.filteredBooks$.pipe(takeUntil(this.destroy$)).subscribe((filteredBooks) => {
      this.filteredFull = filteredBooks || [];
      console.debug(
        '[Category] filteredBooks$ emitted, count =',
        this.filteredFull.length,
        this.filteredFull.slice(0, 3)
      );
      this.totalBooks = this.filteredFull.length;
      this.totalPages = Math.ceil(this.totalBooks / this.itemsPerPage) || 1;
      // Ensure current page is within bounds
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
      if (this.currentPage < 1) this.currentPage = 1;
      this.updatePaginatedBooks();
    });
  }
  // this.books = [...this.allBooks];

  private loadBooksFromApi(): void {
    this.loading = true;

    this.api.getBooks().subscribe({
      next: (data) => {
        console.log(' Books from API:', data);
        const booksArray = Array.isArray(data) ? data : data.books ?? [];
        this.allBooks = booksArray.map((book: any) => ({
          id: book._id,
          BookId: book._id ?? book.BookId ?? '',
          title: book.Title,
          author: book.Author,
          // keep legacy `Category` field (used by filters) and also `genre`
          Category: book.Category ?? book.Genre ?? 'Unknown',
          genre: book.Genre ?? book.Category ?? 'Unknown',
          price: Number(book.Price),
          description: book.Description,
          image: book.Image ?? '/assets/default-book.jpg',
        }));

        // Build dynamic category list from API data (preserve casing for display)
        const uniqueCats = Array.from(
          new Set(this.allBooks.map((b) => b.Category || b.genre || 'Unknown'))
        ).filter((c) => c && c.toLowerCase() !== 'all');
        uniqueCats.sort((a, b) => a.localeCompare(b));
        this.categories = ['all', ...uniqueCats];

        // Build dynamic price ranges based on where books fall.
        const buckets: { key: string; test: (p: number) => boolean }[] = [
          { key: 'under-15', test: (p) => p < 15 },
          { key: '15-30', test: (p) => p >= 15 && p <= 30 },
          { key: '30-50', test: (p) => p > 30 && p <= 50 },
          { key: 'over-50', test: (p) => p > 50 },
        ];

        const presentBuckets = buckets.filter((b) =>
          this.allBooks.some((book) => b.test(Number(book.price)))
        );
        this.priceRanges = ['all', ...presentBuckets.map((b) => b.key)];

        console.debug(
          '[Category] computed categories:',
          this.categories,
          'priceRanges:',
          this.priceRanges
        );

        // Initialize filtered list and pagination immediately after loading
        this.books = [...this.allBooks];
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load books:', error);
        this.errorMessage = 'Failed to load books';
        this.loading = false;
      },
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected applyFilters() {
    // Just instruct the service to compute filteredBooks; the single subscription
    // in ngOnInit will receive the new list and update pagination.
    this.searchService.filterBooks(this.allBooks, {
      query: this.searchQuery,
      category: this.selectedCategory,
      priceRange: this.selectedPrice,
      sortBy: this.selectedSort,
    });

    // Reset to first page whenever filters change
    this.currentPage = 1;
  }

  protected updatePaginatedBooks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    // Slice from the full filtered list to avoid double-slicing
    this.books = this.filteredFull.slice(startIndex, endIndex);
  }

  protected goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Update paginated view from the already-subscribed full filtered list
      this.updatePaginatedBooks();
    }
  }

  protected previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  protected nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  protected getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
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
