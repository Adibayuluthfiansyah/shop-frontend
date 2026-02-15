"use client";

import { Menu } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import NavbarLogo from "./NavbarLogo";
import NavbarItem from "./NavbarItem";
import NavbarCart from "./NavbarCart";
import NavbarMobile from "./NavbarMobile";
import NavbarUser from "./NavbarUser";

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const leftMenuItems = ["shop", "men", "women", "about", "contact"];

  return (
    <>
      <motion.nav
        style={{
          backgroundColor,
          backdropFilter: backdropBlur,
          borderBottomColor: `rgba(0, 0, 0, ${borderOpacity})`,
        }}
        className="fixed top-0 left-0 right-0 z-50 w-full border-b border-transparent transition-all"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-900"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            {/* Left Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {leftMenuItems.map((item, i) => (
                <NavbarItem
                  key={item}
                  href={`/${item}`}
                  label={item.toUpperCase()}
                  index={i}
                  hoveredLink={hoveredLink}
                  setHoveredLink={setHoveredLink}
                />
              ))}
            </div>

            {/* Logo */}
            <NavbarLogo />

            {/* Right Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
              {/* User Profile */}
              <NavbarUser />

              {/* Cart */}
              <NavbarCart customIndex={6} />
            </div>
          </div>
        </div>
      </motion.nav>

      <NavbarMobile
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        menuItems={[...leftMenuItems, "accessories"]}
      />
    </>
  );
}
