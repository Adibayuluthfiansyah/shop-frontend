"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";
import { navItemVariants } from "./animation";
import { signOut, useSession } from "next-auth/react";

export default function NavbarUser() {
  const { data: session, status } = useSession();
  const user = session?.user;

  // loading
  if (status === "loading") {
    <div className="w-9 h-9 rounded-full bg-gray-500 animate-pulse"></div>;
  }

  // user not login
  if (!user) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={navItemVariants}
        custom={5}
        className="hidden sm:block"
      >
        <Link href={"/login"}>
          <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-5 h-9 text-[11px] font-medium tracking-wider uppercase transition-colors shadow-sm cursor-pointer">
            SIGN IN
          </Button>
        </Link>
      </motion.div>
    );
  }

  // if user login
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          initial="hidden"
          animate="visible"
          variants={navItemVariants}
          custom={5}
          className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-gray-200 transition-all outline-none"
        >
          <Avatar className="h-9 w-9 border border-black">
            <AvatarImage
              src={user.image || ""}
              alt={user.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-black text-white text-xs font-bold tracking-widest flex items-center justify-center w-full h-full">
              {initials}
            </AvatarFallback>
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/*name and email*/}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <span className="mt-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded w-fit uppercase font-bold tracking-wider">
              {user.role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/*menu for role*/}
        <DropdownMenuGroup>
          {/*admin*/}
          {user.role === "ADMIN" && (
            <Link href={"/admin/dashboard"}>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          )}
          {/*seller*/}
          {user.role === "SELLER" && (
            <>
              <Link href={"seller/dashboard"}>
                <DropdownMenuItem className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Seller Dashboard</span>
                </DropdownMenuItem>
              </Link>
              {/*manage products*/}
              <Link href="/seller/products">
                <DropdownMenuItem className="cursor-pointer">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>Manage Products</span>
                </DropdownMenuItem>
              </Link>
            </>
          )}
          {/*user*/}
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
          </Link>
          {/*user order*/}
          <Link href="/orders">
            <DropdownMenuItem className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/*logout*/}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
