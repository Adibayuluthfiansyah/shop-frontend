import { Variants } from "framer-motion";

export const navItemVariants = {
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

export const logoVariants = {
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

export const cartBadgeVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, stiffness: 500, damping: 15 },
  },
  exit: { scale: 0, rotate: 180 },
};

export const mobileMenuVariants: Variants = {
  closed: {
    x: "100%",
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
  open: {
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 40 },
  },
};

export const mobileMenuItemVariants: Variants = {
  closed: { opacity: 0, x: 50 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};