"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed!");
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-sm">
      {/* 1. COMPACT NEWSLETTER & BRAND SECTION */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand & Social - Left Side */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="font-bold tracking-[0.2em] text-lg text-gray-900"
              >
                MINI
              </Link>
              <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
              <div className="flex gap-3 text-gray-500">
                {[Instagram, Twitter, Facebook].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="hover:text-black transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter - Right Side */}
            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto gap-2"
            >
              <Input
                type="email"
                placeholder="Email for updates"
                className="bg-gray-50 border-gray-200 h-9 text-xs w-full md:w-64"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white h-9 px-4 text-xs font-medium"
              >
                Join
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* 2. MAIN LINKS (Compact Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-gray-500">
          {/* Address */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[10px]">
              Office
            </h4>
            <p className="leading-relaxed">
              Jl. Jend. Ahmad Yani No. 1<br />
              Pontianak, Indonesia
              <br />
              hello@ministore.com
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[10px]">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/new" className="hover:text-black hover:underline">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover:text-black hover:underline">
                  Men
                </Link>
              </li>
              <li>
                <Link
                  href="/women"
                  className="hover:text-black hover:underline"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  href="/accessories"
                  className="hover:text-black hover:underline"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[10px]">
              Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-black hover:underline"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-black hover:underline"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wider text-[10px]">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="hover:text-black hover:underline"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-black hover:underline"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM BAR (Minimalist) */}
      <div className="bg-gray-50 border-t border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-gray-400">
          <p>© {new Date().getFullYear()} MINI Store. All rights reserved.</p>
          <div className="flex gap-2">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
