import { Component } from '@angular/core';
import { CartItem } from '../../models/book.model';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartItems: CartItem[] = [
    {
      id: 1,
      title: 'Midnight Tales',
      author: 'Elena Rivers',
      price: '$24.99',
      quantity: 1,
      image: 'assets/book-1.jpg',
      genre: 'Fiction',
    },
    {
      id: 2,
      title: 'The Last Echo',
      author: 'Marcus Stone',
      price: '$29.99',
      quantity: 2,
      image: 'assets/book-2.jpg',
      genre: 'Mystery',
    },
    {
      id: 3,
      title: 'Beyond Horizons',
      author: 'Sarah Chen',
      price: '$19.99',
      quantity: 1,
      image: 'assets/book-3.jpg',
      genre: 'Adventure',
    },
  ];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + price * item.quantity;
    }, 0);
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
    item.quantity = Math.max(1, item.quantity + delta);
  }

  removeItem(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  protected parsePrice(price: string): number {
    return parseFloat(price.replace('$', ''));
  }
}
