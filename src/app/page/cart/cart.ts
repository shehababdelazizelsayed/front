import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/book.model';
import { Api } from '../../services/api';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  loading = false;
  errorMessage = '';
  cartId: string = '';

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;
    this.api.getCartItems().subscribe({
      next: (response: any) => {
        const cart = response.Cart || response.cart || {};
        this.cartId = cart._id || '';
        const items = Array.isArray(cart.Items) ? cart.Items : [];
        this.cartItems = items.map((item: any) => ({
          id: item._id,
          title: item.Book?.Title || '',
          BookId: item.Book?._id || '',
          author: '',
          price: Number(item.Book?.Price) || 0,
          image: item.Book?.Image || '',
          Category: item.Book?.Category || '',
          quantity: item.Quantity || 1,
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load cart:', error);
        this.errorMessage = 'Failed to load cart items';
        this.loading = false;
      },
    });
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get shipping(): number {
    return 5.99;
  }

  get tax(): number {
    return this.subtotal * 0.08;
  }

  get total(): number {
    return this.subtotal + this.shipping + this.tax;
  }

  updateQuantity(item: CartItem, delta: number) {
    const newQuantity = Math.max(1, item.quantity + delta);

    this.api.updateCartItem(item.BookId!, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
      },
      error: (err) => {
        console.error('Error updating quantity:', err);
      },
    });
  }

  removeItem(item: CartItem) {
    this.api.removeFromCart(item.BookId!).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((i) => i.BookId !== item.BookId);
      },
      error: (err) => {
        console.error('Error removing item:', err);
      },
    });
  }

  async proceedToCheckout() {
    const token = localStorage.getItem('jwt');

    if (!this.cartId) {
      alert('Cart not loaded or empty.');
      return;
    }

    try {
      const response = await fetch(`${environment.apiUrl}/payment/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ CartId: this.cartId }),
      });

      const data = await response.json();

      if (data.url) {
        if (data.sessionId || data.session_id) {
          const sessionId = data.sessionId || data.session_id;
          localStorage.setItem('stripe_session_id', sessionId);
        }
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        alert('Failed to start checkout.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Failed to proceed to checkout.');
    }
  }
}
