"use client";
import HeroSection from "@/components/ui/HeroSection";
import ProductDisplayPage from "./product/page";
import Navbar from "@/components/navbar/page";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      {/* <ProductDisplayPage /> */}
    </div>
  );
}
