"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { logoVariants } from "./animation";

export default function NavbarLogo() {
  return (
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
  );
}
