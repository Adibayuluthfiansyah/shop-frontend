"use client";

import ProductList from "@/components/product/ProductList";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { ArrowRight } from "lucide-react";

export default function ProductDisplayPage() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Recommended For You
            </h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base max-w-2xl">
              Handpicked essentials just for you. Quality meets minimalism.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-black hover:text-blue-600 transition-colors group"
          >
            See all products
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* product component */}
        <ProductList />

        {/* mobile */}
        <div className="mt-8 md:hidden">
          <Link href="/shop">
            <button className="w-full bg-white border border-gray-300 text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
