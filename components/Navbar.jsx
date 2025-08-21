"use client";
import React, { useState } from "react";
import { assets, BagIcon, CartIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react"; // Hamburger & Close icons

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700 relative">
      {/* Logo */}
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push("/")}
        src={assets.logo}
        alt="logo"
      />

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        <Link href="/">Home</Link>
        <Link href="/all-products">Shop</Link>
        <Link href="/">About Us</Link>
        <Link href="/">Contact</Link>
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Desktop Account */}
      <ul className="hidden md:flex items-center gap-4">
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
        {user ? (
          <UserButton user={user}>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push("/cart")}
              />
            </UserButton.MenuItems>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={() => openSignIn({})}
            className="flex items-center gap-2 hover:text-gray-900 transition"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </ul>

      {/* Mobile Icons */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-3 py-1 rounded-full"
          >
            Seller
          </button>
        )}
        {/* Hamburger Button */}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 md:hidden z-50">
          <Link href="/" className="py-2 w-full" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/all-products" className="py-2 w-full" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/" className="py-2 w-full" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link href="/" className="py-2 w-full" onClick={() => setMenuOpen(false)}>Contact</Link>

          {user ? (
            <>
              <button
                className="py-2 flex items-center gap-2 w-full"
                onClick={() => { router.push("/cart"); setMenuOpen(false); }}
              >
                <CartIcon /> Cart
              </button>
              <button
                className="py-2 flex items-center gap-2 w-full"
                onClick={() => { router.push("/my-orders"); setMenuOpen(false); }}
              >
                <BagIcon /> My Orders
              </button>
              <div className="py-2">
                <UserButton user={user} />
              </div>
            </>
          ) : (
            <button
              onClick={() => { openSignIn({}); setMenuOpen(false); }}
              className="py-2 flex items-center gap-2 w-full"
            >
              <Image src={assets.user_icon} alt="user icon" /> Account
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
