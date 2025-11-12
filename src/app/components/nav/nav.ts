import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-nav',
  standalone: false,
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements OnInit, OnDestroy {
  isAdmin = false;
  isSearchActive = false;
  searchQuery = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private searchService: SearchService,
    private AuthService: AuthService,
  ) {}

  // Detect admin status once component initializes
  ngOnInit(): void {
    this.isAdmin = this.AuthService.isAdmin();
  }

  onProfileClick() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;

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
    this.searchService.updateSearchQuery(search);
    this.router.navigate(['/category'], {
      queryParams: { search: search || null },
      queryParamsHandling: 'merge',
    });
    this.isSearchActive = false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
