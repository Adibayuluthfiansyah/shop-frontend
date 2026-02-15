import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import {  ProductQueryParams } from "@/types/product";


export const useProducts = (queryParams?: ProductQueryParams) => {
    return useQuery({
        queryKey: ['products', queryParams],
        queryFn: async () => {
            const {data} = await api.get('/products', { params: queryParams });
            return data;
        }
    })
};