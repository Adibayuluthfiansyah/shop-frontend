import api from "@/lib/axios";
import { ProductListResponse, Product, ProductQueryParams } from "@/types/product";

export const productService = {
    getAllProducts: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
        const res = await api.get<ProductListResponse>("/products", { params });
        return res.data;
    },
    
    getProductById: async (id: number): Promise<Product> => {
        const res = await api.get<Product>(`/products/${id}`);
        return res.data;
    },
    
    createProduct: async (formData: FormData) => {
    const res = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return res.data;
  },
    
   updateProduct: async (id: number, formData: FormData) => {
    const res = await api.patch<Product>(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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