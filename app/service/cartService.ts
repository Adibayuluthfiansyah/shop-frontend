import api from "@/lib/axios";
import { ActionResponse } from "@/types/api";
import { AddToCartRequest, CartItem, UpdateCartItemRequest } from "@/types/cart";

interface CartActionData {
    cartItem: CartItem;
}

export const cartService = {
    getCart: async () => {
        const res = await api.get<CartItem[]>('/cart');
        return res.data;
    },
    addToCart: async (payload: AddToCartRequest) => {
        const res = await api.post<ActionResponse<CartActionData>>('/cart', payload);
        return res.data;
    },
    updateCart: async(id:number, quantity:number) => {
        const payload: UpdateCartItemRequest = {quantity};
        const res = await api.put<ActionResponse<CartActionData>>(`/cart/${id}`, payload)
        return res.data;
    },
    removeFromCart: async (id:number) => {
        const res = await api.delete<ActionResponse>(`/cart/${id}`);
        return res.data;
    },
    clearCart: async () => {
        const res = await api.delete<ActionResponse>('/cart');
        return res.data;
    }
}