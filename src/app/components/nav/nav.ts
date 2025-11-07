import { Component, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnDestroy {
  isSearchActive = false;
  searchQuery = '';
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private searchService: SearchService) {}

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;

    // When closing search, reset query & also clear it from the URL
    if (!this.isSearchActive) {
      this.searchQuery = '';
      this.searchService.updateSearchQuery('');

      // Remove search param from URL if on /category
      if (this.router.url.includes('/category')) {
        this.router.navigate([], {
          queryParams: { search: null },
          queryParamsHandling: 'merge',
        });
      }
    }
  }

  updateSearch() {
    this.searchService.updateSearchQuery(this.searchQuery);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container') && !target.closest('.btn-icon-custom')) {
      this.isSearchActive = false;
    }
  }

  onSearchEnter() {
    const search = this.searchQuery.trim();

    // Update search in the service
    this.searchService.updateSearchQuery(search);

    // Navigate to /category with query param
    this.router.navigate(['/category'], {
      queryParams: { search: search || null }, // clears param if empty
      queryParamsHandling: 'merge',
    });

    // Optionally close the search bar
    this.isSearchActive = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
