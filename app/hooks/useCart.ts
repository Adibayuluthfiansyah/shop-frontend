import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { addToCart, fetchCartItems, removeFromCart } from "../service/cartService";
import { toast } from "sonner";

export const useCart = () => {
    const queryClient = useQueryClient();
};