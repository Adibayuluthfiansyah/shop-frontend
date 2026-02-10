import { Product } from "./product";
export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}

export interface CartResponse {
    id: number;
    userId: number;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
}
