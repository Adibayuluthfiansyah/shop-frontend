import { Category } from "./category";
import { PaginatedResponse } from "./api";

export interface Product {
id: number;
  name: string;
  description?: string;
  price: string; 
  stock: number;
  imageUrl?: string;
  categoryId: number;
  createdAt: string; 
  updatedAt: string; 
  category?: Category;
}

export type ProductListResponse = PaginatedResponse<Product>;

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sortBy?: 'price' | 'createdAt' | 'name';
  order?: 'asc' | 'desc';
}

export interface CreatedProduct {
    name: string;
    description?: string;
    price: string;
    stock: number;
    categoryId: number;
    imageUrl?: string;
}

// dto (admin)
export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
}