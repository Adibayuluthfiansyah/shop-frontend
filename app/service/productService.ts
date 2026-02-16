import api from "@/lib/axios";
import { ProductListResponse, Product, CreateProductRequest, ProductQueryParams } from "@/types/product";

export const productService = {
    getAllProducts: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
        const res = await api.get<ProductListResponse>("/products", { params });
        return res.data;
    },
    
    getProductById: async (id: number): Promise<Product> => {
        const res = await api.get<Product>(`/products/${id}`);
        return res.data;
    },
    
    createProduct: async (payload: CreateProductRequest): Promise<Product> => {
        const res = await api.post<Product>("/products", payload);
        return res.data;
    },
    
    updateProduct: async (id: number, payload: Partial<CreateProductRequest>): Promise<Product> => {
        const res = await api.patch<Product>(`/products/${id}`, payload);
        return res.data;
    },
    
    deleteProduct: async (id: number): Promise<{ message: string }> => {
        const res = await api.delete<{ message: string }>(`/products/${id}`);
        return res.data;
    }
};
export const getProducts = async (): Promise<ProductListResponse> => {
    return productService.getAllProducts();
};