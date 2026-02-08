"use client";

import Link from "next/link";
import { useCartStore } from "@/app/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Menu, X } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  Variants,
} from "framer-motion";
import { useState } from "react";

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0),
  );

  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"],
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"],
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.2]);

  // Stagger animation for navbar items
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, letterSpacing: "0em" },
    visible: {
      opacity: 1,
      scale: 1,
      letterSpacing: "0.35em",
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    },
  };

  const cartBadgeVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 15,
      },
    },
    exit: { scale: 0, rotate: 180 },
  };

  const mobileMenuVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const mobileMenuItemVariants: Variants = {
    closed: { opacity: 0, x: 50 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  const menuItems = ["shop", "men", "women", "trending", "accessories"];

  return (
    <>
      <motion.nav
        style={{
          backgroundColor,
          backdropFilter: backdropBlur,
          borderBottomColor: `rgba(0, 0, 0, ${borderOpacity})`,
        }}
        className="fixed top-0 left-0 right-0 z-50 w-full border-b border-transparent"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-900"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Left Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {["shop", "men", "women", "trending"].map((item, i) => (
                <motion.div
                  key={item}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  onHoverStart={() => setHoveredLink(item)}
                  onHoverEnd={() => setHoveredLink(null)}
                >
                  <Link
                    href={`/${item}`}
                    className="relative text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
                  >
                    <motion.span
                      animate={{
                        y: hoveredLink === item ? -2 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {item.toUpperCase()}
                    </motion.span>
                    {hoveredLink === item && (
                      <motion.div
                        layoutId="navbar-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <motion.div
                variants={logoVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.05,
                  letterSpacing: "0.4em",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                className="font-bold text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.35em] text-gray-900 cursor-pointer"
              >
                MINI
              </motion.div>
            </Link>

            {/* Right Navigation - Desktop & Mobile Icons */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
              {/* Desktop Only Links */}
              <motion.div
                custom={4}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                onHoverStart={() => setHoveredLink("accessories")}
                onHoverEnd={() => setHoveredLink(null)}
                className="hidden lg:block"
              >
                <Link
                  href="/accessories"
                  className="relative text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
                >
                  <motion.span
                    animate={{
                      y: hoveredLink === "accessories" ? -2 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    ACCESSORIES
                  </motion.span>
                  {hoveredLink === "accessories" && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>

              {/* Sign In/Up Button - Hidden on Mobile */}
              <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                className="hidden sm:block"
              >
                <Link href="/auth">
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button className="bg-black hover:bg-gray-900 text-white rounded-full px-4 lg:px-5 h-8 lg:h-9 text-[10px] lg:text-[11px] font-medium tracking-wider uppercase transition-colors shadow-sm">
                      SIGN IN/UP
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Cart Icon - Always Visible */}
              <motion.div
                custom={6}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
              >
                <Link href="/cart" className="relative">
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -10, 10, -10, 0],
                      transition: {
                        rotate: { duration: 0.5 },
                        scale: { duration: 0.2 },
                      },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ShoppingBag
                      className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-white"
                      strokeWidth={1.5}
                    />
                  </motion.div>
                  {totalItems > 0 && (
                    <motion.div
                      variants={cartBadgeVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-white text-black text-[9px] sm:text-[10px] font-bold border border-black p-0">
                        {totalItems}
                      </Badge>
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Mobile Menu */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <span className="text-lg font-bold tracking-[0.3em]">
                    MENU
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 flex items-center justify-center text-gray-900"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 overflow-y-auto py-6">
                  <div className="space-y-1 px-6">
                    {menuItems.map((item, i) => (
                      <motion.div
                        key={item}
                        custom={i}
                        variants={mobileMenuItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        <Link
                          href={`/${item}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-3 text-sm font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase border-b border-gray-100"
                        >
                          {item.toUpperCase()}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-200 space-y-3">
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-black hover:bg-gray-900 text-white rounded-full h-11 text-xs font-medium tracking-wider uppercase transition-colors shadow-sm">
                      SIGN IN / SIGN UP
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-300 hover:bg-gray-50 text-black rounded-full h-11 text-xs font-medium tracking-wider uppercase transition-colors"
                    >
                      VIEW CART ({totalItems})
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
