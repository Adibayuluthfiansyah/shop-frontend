"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const avatarVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1] as const,
      },
    }),
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
      filter: "blur(20px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        delay: 0.4,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.05)_0%,transparent_50%)]"
      />

      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.03)_0%,transparent_50%)]"
      />

      <motion.div
        style={{ opacity, scale }}
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            {/* custom border */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <div className="flex -space-x-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={avatarVariants}
                    whileHover={{
                      scale: 1.15,
                      zIndex: 10,
                      transition: { duration: 0.3 },
                    }}
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full ${
                      i === 1
                        ? "bg-transparent border-2 border-black"
                        : "bg-black border-2"
                    } shadow-md cursor-pointer`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              variants={itemVariants}
              className="space-y-1 sm:space-y-2 overflow-hidden"
            >
              <motion.h1
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight"
              >
                FIND YOUR STUFF
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight tracking-tight"
              >
                MORE EASILY
              </motion.h2>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <Link href="/shop" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-black hover:bg-gray-900 text-white rounded-full px-6 sm:px-8 h-11 sm:h-12 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all shadow-lg hover:shadow-2xl cursor-pointer"
                  >
                    SHOP NOW
                  </Button>
                </motion.div>
              </Link>
              <Link href="/product" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 text-black border-2 border-gray-300 rounded-full px-6 sm:px-8 h-11 sm:h-12 text-xs sm:text-sm font-medium tracking-wider uppercase transition-all hover:shadow-lg cursor-pointer"
                  >
                    EXPLORE ALL
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-xs sm:text-sm text-gray-700 max-w-xs sm:max-w-sm leading-relaxed"
            >
              {`Stay cozy without compromising your range of motion. Our women's
              winter range is perfect for those chilly outdoor workouts.`}
            </motion.p>
          </motion.div>

          {/* Right Content - Model Image */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="relative flex items-center justify-center order-1 lg:order-2"
            style={{ perspective: "1000px" }}
          >
            <motion.div
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                transition: { duration: 0.4 },
              }}
              className="relative w-full max-w-70 sm:max-w-87.5 md:max-w-md aspect-3/4 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  src="/model.jpeg"
                  alt="Winter collection model"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 450px"
                />
              </motion.div>

              {/* Floating glow effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none"
              />
            </motion.div>

            {/* Floating decorative elements - Hidden on mobile for performance */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden sm:block absolute -top-8 -left-8 w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-black/5 to-transparent rounded-full blur-2xl"
            />

            <motion.div
              animate={{
                y: [10, -10, 10],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="hidden sm:block absolute -bottom-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-tl from-black/5 to-transparent rounded-full blur-2xl"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
