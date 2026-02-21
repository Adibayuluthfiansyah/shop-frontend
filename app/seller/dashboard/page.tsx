"use client";

import { useSellerProducts, useProductMutations } from "@/app/hooks/useProduct";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";

export default function SellerDashboardPage() {
  const { data, isLoading, isError } = useSellerProducts();
  const { deleteProduct } = useProductMutations();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return <div className="p-8 text-zinc-500">Loading products...</div>;

  if (isError)
    return <div className="p-8 text-red-500">Failed to load products.</div>;

  const products = data?.data || [];

  return (
    <div className="p-8 max-w-7xl mx-auto pt-25">
      <Navbar />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            My Products
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your store inventory. ({products.length} products)
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="inline-flex justify-center items-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-all shadow-sm"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 rounded-lg">
          <p className="text-zinc-500 mb-4">No products yet</p>
          <Link
            href="/seller/products/new"
            className="text-sm text-zinc-900 underline hover:text-zinc-700"
          >
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product: Product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-zinc-100 xl:aspect-h-8 xl:aspect-w-7 border border-zinc-200">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:opacity-75"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300">
                    <span className="text-4xl font-thin">No Image</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between">
                <div className="flex-1">
                  <h3 className="text-sm text-zinc-700 font-medium">
                    {product.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${product.stock > 0 ? "text-zinc-500" : "text-red-500 font-medium"}`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of Stock"}
                  </p>
                </div>
                <p className="text-sm font-medium text-zinc-900">
                  Rp {Number(product.price).toLocaleString()}
                </p>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  href={`/seller/products/${product.id}/edit`}
                  className="flex-1 text-center rounded-md bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deletingId === product.id}
                  className="flex-1 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deletingId === product.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
