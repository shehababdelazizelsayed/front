export interface Book {
  id?: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  image: string;
  Category: string;
  genre?: string; // For backward compatibility
  BookId: string;
}

export interface CartItem extends Book {
  quantity: number;
}
