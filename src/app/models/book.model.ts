export interface Book {
  id?: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  image: string;
  Category: string;
}

export interface CartItem extends Book {
  quantity: number;
}
