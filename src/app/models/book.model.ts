export interface Book {
  id?: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  image: string;
  Category: string;
  genre?: string;
  BookId: string;
}

export interface CartItem extends Book {
  quantity: number;
}
