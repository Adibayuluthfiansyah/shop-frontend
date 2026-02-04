export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  message: string;
  accesToken: string;
  user: User;
}