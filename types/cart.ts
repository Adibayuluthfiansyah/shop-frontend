export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    name: string;
    price: string; 
    imageUrl?: string;
  };
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
