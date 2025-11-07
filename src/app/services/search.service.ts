import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly SEARCH_STORAGE_KEY = 'lastSearchQuery';

  private searchQuerySubject = new BehaviorSubject<string>(
    localStorage.getItem(this.SEARCH_STORAGE_KEY) || ''
  );
  searchQuery$ = this.searchQuerySubject.asObservable();

  private filteredBooksSubject = new BehaviorSubject<Book[]>([]);
  filteredBooks$ = this.filteredBooksSubject.asObservable();

  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
    localStorage.setItem(this.SEARCH_STORAGE_KEY, query);
  }

  getStoredSearchQuery(): string {
    return localStorage.getItem(this.SEARCH_STORAGE_KEY) || '';
  }

  filterBooks(
    books: Book[],
    filters: {
      query?: string;
      category?: string;
      priceRange?: string;
      sortBy?: string;
    }
  ) {
    let filtered = [...books];

    // Apply search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.genre.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(
        (book) => book.genre.toLowerCase() === (filters.category?.toLowerCase() ?? '')
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      filtered = filtered.filter((book) => {
        const price = parseFloat(book.price.replace('$', ''));
        switch (filters.priceRange) {
          case 'under-15':
            return price < 15;
          case '15-30':
            return price >= 15 && price <= 30;
          case '30-50':
            return price > 30 && price <= 50;
          case 'over-50':
            return price > 50;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));

        switch (filters.sortBy) {
          case 'price-low':
            return priceA - priceB;
          case 'price-high':
            return priceB - priceA;
          case 'name-asc':
            return a.title.localeCompare(b.title);
          case 'name-desc':
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    }

    this.filteredBooksSubject.next(filtered);
  }

  updateFilteredBooks(books: Book[]) {
    this.filteredBooksSubject.next(books);
  }
}
