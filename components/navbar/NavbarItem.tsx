"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { navItemVariants } from "./animation";

interface NavbarItemProps {
  href: string;
  label: string;
  index: number;
  hoveredLink: string | null;
  setHoveredLink: (link: string | null) => void;
  className?: string;
}

export default function NavbarItem({
  href,
  label,
  index,
  hoveredLink,
  setHoveredLink,
  className = "",
}: NavbarItemProps) {
  const itemKey = label.toLowerCase();

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={navItemVariants}
      onHoverStart={() => setHoveredLink(itemKey)}
      onHoverEnd={() => setHoveredLink(null)}
      className={className}
    >
      <Link
        href={href}
        className="relative text-[11px] font-medium text-gray-800 hover:text-black transition-colors tracking-wider uppercase"
      >
        <motion.span
          animate={{ y: hoveredLink === itemKey ? -2 : 0 }}
          transition={{ duration: 0.2 }}
          className="inline-block"
        >
          {label}
        </motion.span>
        {hoveredLink === itemKey && (
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
  );
}
