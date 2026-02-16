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
  snapToken?: string;
  snapTokenRedirectUrl?: string;
  midtransOrderId?: string;
  paymentType?: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  product?: {
    id: number;
    name: string;
    description?: string;
    price: string;
    imageUrl?: string;
    category?: {
      id: number;
      name: string;
    };
  };
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export type OrderListResponse = PaginatedResponse<Order>;


export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}