//product
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  stock: number;
  imageUrl?: string;
  categoryId: number;
}


export interface ProductResponse {
    data: Product[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

//auth
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

//cart
export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
  }
}