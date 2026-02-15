"use client";

import { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import ProductCard from "@/components/product/ProductCard";
import ShopSidebar from "@/components/shop/ShopSidebar";
import { useProducts } from "@/app/hooks/useProduct";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/product";

type SortOption = "price" | "createdAt" | "name";
type SortOrder = "asc" | "desc";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000000]);
  const [sortBy, setSortBy] = useState<SortOption>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const { data, isLoading } = useProducts({
    categoryId: selectedCategory || undefined,
    sortBy: sortBy,
    order: order,
  });
  const products: Product[] = Array.isArray(data) ? data : data?.data || [];

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* header */}
      <div className="pt-20 pb-4 border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Shop All Products
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {products.length} results
          </p>
        </div>
      </div>

      <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ShopSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onApplyFilter={() => {}}
            />
          </aside>

          {/* main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              {/* mobile filter button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden flex gap-2">
                    <Filter className="w-4 h-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-300px sm:w-100px">
                  <div className="py-6">
                    <h2 className="font-bold text-lg mb-6">Filters</h2>
                    <ShopSidebar
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      onApplyFilter={() => {}}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* sorting */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  Sort by:
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      {sortBy === "price"
                        ? order === "asc"
                          ? "Price: Low to High"
                          : "Price: High to Low"
                        : "Newest Arrivals"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("createdAt");
                        setOrder("desc");
                      }}
                    >
                      Newest Arrivals
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("price");
                        setOrder("asc");
                      }}
                    >
                      Price: Low to High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortBy("price");
                        setOrder("desc");
                      }}
                    >
                      Price: High to Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* product */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-62.5 w-full rounded-xl" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* product cards*/}
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 font-medium">
                  No products found matching your criteria.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange([0, 20000000]);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* pagination */}
            {products.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" className="bg-black text-white">
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
