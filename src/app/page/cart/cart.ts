import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/book.model';
import { Api } from '../../services/api';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  loading = false;
  errorMessage = '';
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  // cartItems: CartItem[] = [
  //   {
  //     id: 1,
  //     title: 'Midnight Tales',
  //     author: 'Elena Rivers',
  //     price: '$24.99',
  //     quantity: 1,
  //     image: 'assets/book-1.jpg',
  //     genre: 'Fiction',
  //   },
  //   {
  //     id: 2,
  //     title: 'The Last Echo',
  //     author: 'Marcus Stone',
  //     price: '$29.99',
  //     quantity: 2,
  //     image: 'assets/book-2.jpg',
  //     genre: 'Mystery',
  //   },
  //   {
  //     id: 3,
  //     title: 'Beyond Horizons',
  //     author: 'Sarah Chen',
  //     price: '$19.99',
  //     quantity: 1,
  //     image: 'assets/book-3.jpg',
  //     genre: 'Adventure',
  //   },
  // ];
  constructor(private api: Api) { }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.loading = true;

    this.api.getCartItems().subscribe({
      next: (response) => {
        console.log('Cart items from API:', response);
        // Assuming API returns { items: [...] }
        this.cartItems = response.items.map((item) => ({
          ...item,
          price: Number(item.price),
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

    this.api.updateCartItem(item.id!, newQuantity).subscribe({
      next: () => {
        item.quantity = newQuantity;
      },
      error: (err) => {
        console.error(' Error updating quantity:', err);
      },
    });
  }

  removeItem(item: CartItem) {
    this.api.removeFromCart(item.id!).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
      },
      error: (err) => {
        console.error(' Error removing item:', err);
      },
    });
  }
}
//   get subtotal(): number {
//     return this.cartItems.reduce((sum, item) => {
//       const price = parseFloat(item.price.replace('$', ''));
//       return sum + price * item.quantity;
//     }, 0);
//   }

//   get shipping(): number {
//     return 5.99;
//   }

//   get tax(): number {
//     return this.subtotal * 0.08;
//   }

//   get total(): number {
//     return this.subtotal + this.shipping + this.tax;
//   }

//   updateQuantity(item: CartItem, delta: number) {
//     item.quantity = Math.max(1, item.quantity + delta);
//   }

//   removeItem(item: CartItem) {
//     const index = this.cartItems.indexOf(item);
//     if (index > -1) {
//       this.cartItems.splice(index, 1);
//     }
//   }

//   protected parsePrice(price: string): number {
//     return parseFloat(price.replace('$', ''));
//   }
// }
