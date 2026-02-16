"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const checkIsNew = () => {
      const now = Date.now();
      const productDate = new Date(product.createdAt).getTime();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      return productDate > now - sevenDaysInMs;
    };

    const timer = setTimeout(() => {
      setIsNew(checkIsNew());
    }, 0);

    return () => clearTimeout(timer);
  }, [product.createdAt]);

  const priceNumber = parseFloat(product.price);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const imageUrl =
    product.imageUrl || "https://placehold.co/400x400/png?text=No+Image";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    //check user login to add cart
    if (status === "unauthenticated") {
      toast.error("Please Login or Register to add to cart", {
        action: {
          label: "Login",
          onClick: () => {
            router.push("/login");
          },
        },
      });
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      price: priceNumber,
      quantity: 1,
      image: imageUrl,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="group relative flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      {/* image display */}
      <Link
        href={`/product/${product.id}`}
        className="relative aspect-square bg-gray-50 p-4 overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 ${
            isOutOfStock ? "grayscale opacity-50" : ""
          }`}
        />

        {/* badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNew && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold shadow-sm">
              New
            </Badge>
          )}
          {isLowStock && (
            <Badge
              variant="destructive"
              className="text-[10px] shadow-sm uppercase tracking-wider"
            >
              Low Stock
            </Badge>
          )}
        </div>
      </Link>

      {/* content */}
      <div className="flex flex-col flex-1 p-5">
        {/* category */}
        <div className="mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {product.category?.name || "General"}
          </span>
        </div>

        {/* title */}
        <Link
          href={`/product/${product.id}`}
          className="mb-3 block group-hover:text-blue-600 transition-colors"
        >
          <h3 className="text-sm font-semibold text-gray-900 leading-relaxed line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* price & button */}
        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-end gap-1 mb-4">
            <span className="text-xs font-medium text-gray-500 mb-1">Rp</span>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {new Intl.NumberFormat("id-ID").format(priceNumber)}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full h-10 rounded-lg text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2
              ${
                isOutOfStock
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg"
              }
            `}
          >
            {isOutOfStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
