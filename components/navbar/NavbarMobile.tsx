"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, LayoutDashboard, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/app/store/useCartStore";
import { useSession, signOut } from "next-auth/react";
import { mobileMenuItemVariants, mobileMenuVariants } from "./animation";
interface NavbarMobileProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  menuItems: string[];
}

export default function NavbarMobile({
  isOpen,
  setIsOpen,
  menuItems,
}: NavbarMobileProps) {
  const totalItems = useCartStore((state) => state.totalItems);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          />

          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 bottom-0 w-70 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* user info login or not*/}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                {user ? (
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                      {user.role}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold tracking-[0.3em]">
                    MENU
                  </span>
                )}

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-gray-900"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* menu items */}
              <nav className="flex-1 overflow-y-auto py-6">
                <div className="space-y-1 px-6">
                  {/* admin */}
                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center py-3 text-sm font-bold text-red-600 border-b border-gray-100 mb-2"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" /> ADMIN
                      DASHBOARD
                    </Link>
                  )}
                  {user?.role === "SELLER" && (
                    <Link
                      href="/seller/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center py-3 text-sm font-bold text-blue-600 border-b border-gray-100 mb-2"
                    >
                      <Store className="w-4 h-4 mr-2" /> SELLER DASHBOARD
                    </Link>
                  )}

                  {/* menu */}
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
                        onClick={() => setIsOpen(false)}
                        className="block py-3 text-sm font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase border-b border-gray-100"
                      >
                        {item.toUpperCase()}
                      </Link>
                    </motion.div>
                  ))}

                  {/* user profile */}
                  {user && (
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center py-3 text-sm font-medium text-gray-800 border-b border-gray-100 mt-2"
                    >
                      MY PROFILE
                    </Link>
                  )}
                </div>
              </nav>

              {/* footer*/}
              <div className="p-6 border-t border-gray-200 space-y-3">
                {!user ? (
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-black hover:bg-gray-900 text-white rounded-full h-11 text-xs font-medium tracking-wider uppercase shadow-sm">
                      SIGN IN / SIGN UP
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      signOut();
                    }}
                    variant="destructive"
                    className="w-full rounded-full h-11 text-xs font-medium tracking-wider uppercase"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> LOG OUT
                  </Button>
                )}

                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:bg-gray-50 text-black rounded-full h-11 text-xs font-medium tracking-wider uppercase"
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
  );
}
