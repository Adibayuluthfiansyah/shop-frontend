import api from "@/lib/axios";
import { AddToCartRequest, CartItemResponse } from "@/types";

export const fetchCartItems = async (): Promise<CartItemResponse[]> => {
    const {data} = await api.get("/cart");
    return data;
} 

export const addToCart = async (payload: AddToCartRequest) => {
    const {data} = await api.post("/cart", payload);
    return data;
}

export const removeFromCart = async (id: number) => {
    const {data} = await api.delete(`/cart/${id}`);
}