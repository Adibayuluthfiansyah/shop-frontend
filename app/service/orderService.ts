import api from "@/lib/axios";
import { 
  Order, 
  OrderListResponse, 
  OrderQueryParams, 
  UpdateOrderStatusRequest 
} from "@/types/order";

export const orderService = {
  createOrder: async () => {
    const res = await api.post<Order>("/order");
    return res.data;
  },
  getMyOrders: async (params?: OrderQueryParams) => {
    const res = await api.get<OrderListResponse>("/order/my-orders", { params });
    return res.data;
  },
  getAllOrders: async (params?: OrderQueryParams) => {
    const res = await api.get<OrderListResponse>("/order", { params });
    return res.data;
  },
  getSellerOrders: async (params?: OrderQueryParams) => {
    const res = await api.get<OrderListResponse>("/order/seller/orders", { params });
    return res.data;
  },
  getOrderById: async (orderId: number) => {
    const res = await api.get<Order>(`/order/${orderId}`);
    return res.data;
  },
  updateStatus: async (orderId: number, payload: UpdateOrderStatusRequest) => {
    const res = await api.patch<Order>(`/order/${orderId}/status`, payload);
    return res.data;
  },
  cancelOrder: async (orderId: number) => {
    const res = await api.delete<{ message: string }>(`/order/${orderId}`);
    return res.data;
  }
};