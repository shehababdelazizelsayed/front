export interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  genre: string;
  image: string;
}

export interface CartItem extends Book {
  quantity: number;
}
