import { create } from "zustand";
import { Order, OrderStatus } from "@/types/order";

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  updateStatusLocal: (orderId: number, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  updateStatusLocal: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
  }))
}));