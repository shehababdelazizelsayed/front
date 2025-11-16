import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';
import { Book, CartItem } from '../../models/book.model';
import { Review } from '../../services/api';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  book: Book | null = null;
  loading: boolean = true;
  error: string = '';
  quantity: number = 1;
  reviews: Review[] = [];
  isLoggedIn: boolean = false; // This should be set based on your auth service
  newReview = {
    rating: 5,
    comment: '',
  };

  constructor(private route: ActivatedRoute, private api: Api) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
      this.loadReviews(id); // Always load reviews separately
    }

    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded) {
        this.currentUserId = decoded.id || decoded.userId || decoded._id;
        this.currentUserRole = decoded.role || decoded.Role || decoded.isAdmin ? 'admin' : 'user';

        this.isLoggedIn = true;


      }

    } // Temporary for development
  }


  loadBook(id: string): void {
    this.loading = true;
    this.api.getBookById(id).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        if (response && response.book) {
          this.book = {
            id: response.book._id,
            title: response.book.Title,
            BookId: response.book._id,
            author: response.book.Author,
            price: response.book.Price,
            description: response.book.Description,
            image: response.book.Image,
            Category: response.book.Category,
          };
        }
        console.log('Processed book data:', this.book);
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Error loading book details';
        this.loading = false;
        console.error('API Error:', err);
      },
    });
  }

  loadReviews(id: string): void {
    this.api.getReviewsByBookId(id).subscribe({
      next: (response: any[]) => {

        // response is an Array<Review> from backend
        this.reviews = response.map((review: any) => ({
          _id: review._id,
          User: review.User,
          Book: review.Book,
          Rating: review.Rating,
          Review: review.Review,
          CreatedAT: review.createdAt || review.CreatedAT,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        }));
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
      }
    });
  }


  addBookToCart(): void {
    if (this.book?.id) {
      this.api.addBookToCart(this.book.id, this.quantity).subscribe({
        next: () => {
          this.error = '';
        },
        error: (err: any) => {
          this.error = 'Error adding to cart';
          console.error(err);
        },
      });
    }
  }

  addToWishlist(): void {
    if (this.book?.id) {
      this.api.addToWishlist(this.book.id).subscribe({
        next: () => {
          this.error = ''; // Clear any previous errors
        },
        error: (err: any) => {
          this.error = 'Error adding to wishlist';
          console.error(err);
        },
      });
    }
  }

  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  currentUserId: string | null = null;
  currentUserRole: string | null = null;
  editingReviewId: string | null = null;

  editReviewData = {
    rating: 5,
    comment: ''

  }
  canModifyReview(review: any): boolean {
    return (
      review.User === this.currentUserId ||
      this.currentUserRole === 'admin'
    );
  }

  submitReview(): void {
    if (!this.book?.id) return;

    const data = {
      BookId: this.book.id,
      Rating: this.newReview.rating,
      Review: this.newReview.comment.trim(),
    };

    this.api.addReview(data).subscribe({
      next: () => {
        if (!this.book?.id) return;
        this.loadReviews(this.book.id);// Reload reviews after submission
        this.newReview = { rating: 5, comment: '' };
      },
      error: () => {
        this.error = 'Error submitting review';
      }
    });
  }


  startEditReview(review: any): void {
    this.editingReviewId = review._id;
    this.editReviewData = {
      rating: review.Rating,
      comment: review.Review
    };
  }
  cancelEditReview(): void {
    this.editingReviewId = null;
    this.editReviewData = {
      rating: 5,
      comment: ''
    };
  }

  saveReviewEdit(): void {
    if (!this.editingReviewId) return;

    const updateData = {
      Rating: this.editReviewData.rating,
      Review: this.editReviewData.comment.trim()
    };

    this.api.editReview(this.editingReviewId, updateData).subscribe({
      next: () => {
        if (!this.book?.id) return;
        this.loadReviews(this.book.id);
        this.cancelEditReview();
      },
      error: () => {
        this.error = 'Error updating review';
      }
    });
  }

  deleteReview(reviewId: string): void {
    if (!confirm('Are you sure you want to delete this review?')) return;

    this.api.deleteReview(reviewId).subscribe({
      next: () => {
        if (!this.book?.id) return;
        this.loadReviews(this.book.id);
      },
      error: () => {
        this.error = 'Error deleting review';
      }
    });
  }





}
