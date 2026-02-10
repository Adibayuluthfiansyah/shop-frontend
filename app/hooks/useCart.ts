import { cartService } from "../service/cartService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../store/useCartStore";
import { ApiErrorResponse } from "@/types/api";
import { AxiosError } from "axios";
import {toast} from "sonner";

export const useCart = () => {
    const setTotalItems = useCartStore((state) => state.setTotalItems);

    return useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const data = await cartService.getCart();
            const totalItems = data.items.reduce((acc, item) => acc + item.quantity, 0);
            setTotalItems(totalItems);
            return data;
        }, 
        retry: false, 
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartService.addToCart,
        onSuccess: () => {
            toast.success("Item added to cart");
            queryClient.invalidateQueries({queryKey: ['cart']});
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            const message = error.response?.data.message || "Failed to add item to cart";
            toast.error(message);
        }
    });
}

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cartService.removeFromCart,
        onSuccess: () => {
            toast.success("Item removed from cart");
            queryClient.invalidateQueries({queryKey: ['cart']});
        }
    })
}