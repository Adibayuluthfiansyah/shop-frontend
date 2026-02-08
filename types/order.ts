import { User } from "./auth";
import { PaginatedResponse } from "./api";


export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}
export interface Order {
  id: number;
  userId: number;
  totalPrice: string; 
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  product?: {
  name: string;
  imageUrl?: string;
  };
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export type OrderListResponse = PaginatedResponse<Order>;

// admin update status
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}