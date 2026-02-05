
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ProductResponse } from "@/types";

const fetchProduct = async (): Promise<ProductResponse> => {
    const data = await api.get<ProductResponse>("/products");
    return data.data;
}

export const useProduct = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: fetchProduct,
        staleTime: 1 * 60 * 1000, 
    });
};