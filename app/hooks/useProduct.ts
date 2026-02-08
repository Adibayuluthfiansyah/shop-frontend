import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../service/productService";


export const useProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        staleTime: 1 * 60 * 1000, 
    });
};