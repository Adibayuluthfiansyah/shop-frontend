"use client";
import { useCartStore } from "../store/useCartStore";
import { useProduct } from "../hooks/useProduct";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function ProductPage() {
  const { data: response, isLoading, isError } = useProduct();
  const addToCart = useCartStore((state) => state.addToCart);
  const products = response?.data || [];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Katalog Produk</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-250px" />
                <Skeleton className="h-4 w-200px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load products.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Product) => (
          <Card
            key={product.id}
            className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden rounded-t-lg">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  fill
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
              {product.stock <= 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  Out of Stock
                </Badge>
              )}
            </div>

            <CardHeader>
              <CardTitle className="text-lg line-clamp-1" title={product.name}>
                {product.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-xl font-bold text-primary">
                Rp {Number(product.price).toLocaleString("id-ID")}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Stok: {product.stock}
              </p>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                disabled={product.stock <= 0}
                onClick={() => {
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    quantity: 1,
                    imageUrl: product.imageUrl,
                  });
                  alert("Masuk keranjang!");
                }}
              >
                {product.stock > 0 ? "+ Keranjang" : "Habis"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
