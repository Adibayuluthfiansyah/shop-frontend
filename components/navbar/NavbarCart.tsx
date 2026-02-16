"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/app/store/useCartStore";
import { navItemVariants, cartBadgeVariants } from "./animation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NavbarCart({ customIndex }: { customIndex: number }) {
  const { status } = useSession();
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCartClick = (e: React.MouseEvent) => {
    if (status === "unauthenticated") {
      e.preventDefault();
      toast.error("Please Login or Register to view your cart", {
        action: {
          label: "Login",
          onClick: () => {
            router.push("/login");
          },
        },
      });
    }
  };

  return (
    <motion.div
      custom={customIndex}
      initial="hidden"
      animate="visible"
      variants={navItemVariants}
    >
      <Link href="/cart" className="relative" onClick={handleCartClick}>
        <motion.div
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, -10, 0],
            transition: { rotate: { duration: 0.5 }, scale: { duration: 0.2 } },
          }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition-colors shadow-sm"
        >
          <ShoppingBag
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white"
            strokeWidth={1.5}
          />
        </motion.div>

        {itemCount > 0 && (
          <motion.div
            variants={cartBadgeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute -top-1 -right-1"
          >
            <Badge className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center rounded-full bg-white text-black text-[9px] sm:text-[10px] font-bold border border-black p-0">
              {itemCount}
            </Badge>
          </motion.div>
        )}
      </Link>
    </motion.div>
  );
}
