import api from "@/lib/axios";
import { ProductListResponse } from "@/types/product";

export const getProducts = async (): Promise<ProductListResponse> => {
    const data = await api.get<ProductListResponse>("/products");
    return data.data;
}