"use client";

import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/app/hooks/useCategory";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/types/category";

interface ShopSidebarProps {
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onApplyFilter: () => void;
}

export default function ShopSidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  onApplyFilter,
}: ShopSidebarProps) {
  const { data: categories, isLoading } = useCategory();
  const categoryList: Category[] = Array.isArray(categories) ? categories : [];

  return (
    <div className="space-y-8">
      {/* category filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
          Category
        </h3>
        <div className="space-y-2">
          {/* all categories */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cat-all"
              checked={selectedCategory === null}
              onCheckedChange={() => setSelectedCategory(null)}
            />
            <label
              htmlFor="cat-all"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              All Products
            </label>
          </div>

          {/* categories list */}
          {isLoading
            ? [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4" />
              ))
            : categoryList.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat.id}`}
                    checked={selectedCategory === cat.id}
                    onCheckedChange={() => setSelectedCategory(cat.id)}
                  />
                  <label
                    htmlFor={`cat-${cat.id}`}
                    className="text-sm text-gray-600 hover:text-black cursor-pointer"
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
        </div>
      </div>

      {/* price filter */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
          Price Range
        </h3>
        <Slider
          defaultValue={[0, 10000000]}
          max={20000000}
          step={50000}
          value={priceRange}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Rp {new Intl.NumberFormat("id-ID").format(priceRange[0])}</span>
          <span>Rp {new Intl.NumberFormat("id-ID").format(priceRange[1])}</span>
        </div>
      </div>

      <Button
        onClick={onApplyFilter}
        className="w-full bg-black hover:bg-gray-800 text-white"
      >
        Apply Filters
      </Button>
    </div>
  );
}
