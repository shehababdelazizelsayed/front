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

  constructor(private route: ActivatedRoute, private api: Api) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBook(id);
      this.loadReviews(id); // Always load reviews separately
    }
    // TODO: Get login status from auth service
    this.isLoggedIn = true; // Temporary for development
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
      next: (response: any) => {
        console.log('Reviews Response:', response);
        if (Array.isArray(response)) {
          this.reviews = response.map((review: any) => ({
            _id: review._id,
            User: review.User,
            Book: review.Book,
            Rating: review.Rating,
            Review: review.Review,
            CreatedAT: review.CreatedAT || review.createdAt,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
          }));
          console.log('Processed reviews:', this.reviews);
        }
      },
      error: (err: any) => {
        console.error('Error loading reviews:', err);
      },
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

  submitReview(): void {
    if (this.book?.id && this.newReview.comment.trim()) {
      const reviewData = {
        Book: this.book.id,
        Rating: this.newReview.rating,
        Review: this.newReview.comment,
      };

      this.api.addReview(reviewData).subscribe({
        next: (response) => {
          console.log('Review submitted successfully:', response);
          // Reload reviews to get the updated list
          if (this.book?.id) {
            this.loadReviews(this.book.id);
          }
          this.newReview = {
            rating: 5,
            comment: '',
          };
          this.error = '';
        },
        error: (err: any) => {
          this.error = 'Error submitting review';
          console.error('Error submitting review:', err);
        },
      });
    }
  }
}
