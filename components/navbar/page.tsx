"use client";

import Link from "next/link";
import { useCartStore } from "@/app/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0),
  );

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full">
      <div className="mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <div className="flex items-center gap-8">
            <Link
              href="/shop"
              className="text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
            >
              SHOP
            </Link>
            <Link
              href="/men"
              className="text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
            >
              MEN
            </Link>
            <Link
              href="/women"
              className="text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
            >
              WOMEN
            </Link>
            <Link
              href="/trending"
              className="text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
            >
              TRENDING
            </Link>
          </div>

          {/* Center Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-bold text-2xl tracking-[0.35em] text-gray-900"
          >
            MINI
          </Link>

          {/* Right Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/accessories"
              className="text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
            >
              ACCESSORIES
            </Link>

            {/* Sign In/Up Button */}
            <Link href="/auth">
              <Button className="bg-black hover:bg-gray-900 text-white rounded-full px-5 h-9 text-[11px] font-medium tracking-wider uppercase transition-colors shadow-sm">
                SIGN IN/UP
              </Button>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <div className="w-9 h-9 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition-colors shadow-sm">
                <ShoppingBag
                  className="w-4.5 h-4.5 text-white"
                  strokeWidth={1.5}
                />
              </div>
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-bold border border-black p-0">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
