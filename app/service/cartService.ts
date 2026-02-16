import api from "@/lib/axios";
import { AddToCartRequest,  UpdateCartItemRequest, CartResponse } from "@/types/cart";


export const cartService = {
    getCart: async () => {
        const res = await api.get<CartResponse>('/cart');
        return res.data;
    },
    addToCart: async (payload: AddToCartRequest) => {
        const res = await api.post<CartResponse>('/cart', payload);
        return res.data;
    },
    updateCart: async(itemId:number, quantity:number) => {
        const res = await api.patch<CartResponse>(`/cart/${itemId}`, {quantity} as UpdateCartItemRequest);
        return res.data;
    },
    removeFromCart: async (itemId:number) => {
        const res = await api.delete<CartResponse>(`/cart/${itemId}`);
        return res.data;
    },
    clearCart: async () => {
        const res = await api.delete<CartResponse>('/cart');
        return res.data;
    }
}