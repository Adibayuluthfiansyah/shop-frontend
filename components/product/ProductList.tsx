"use client";

import { useProducts } from "@/app/hooks/useProduct";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Product } from "@/types/product";

export default function ProductList() {
  const { data, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col space-y-4 bg-white p-4 rounded-xl border border-gray-100"
          >
            <Skeleton className="h-50 w-full rounded-lg bg-gray-100" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 bg-gray-100" />
              <Skeleton className="h-4 w-1/2 bg-gray-100" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg mt-4 bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <h3 className="text-lg font-semibold text-gray-900">
          Gagal memuat produk
        </h3>
        <p className="text-sm text-gray-500">
          Silakan periksa koneksi internet Anda.
        </p>
      </div>
    );
  }

  const products = Array.isArray(data) ? data : data?.data || [];

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500">Belum ada produk yang tersedia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
