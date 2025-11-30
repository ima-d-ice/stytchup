"use client";

import { Menu, Search, ShoppingBag, User, X,Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import UserMenu from "./usermenu";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-yellow-500">
              StytchUp
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/designs"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              Designs
            </Link>
            <Link
              href="/designer"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
            >
              Designer
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-yellow-500">
              <Search className="h-6 w-6" />
            </button>
            <div className="text-gray-600 hover:text-yellow-500">
              
              <UserMenu />
            </div>
            <button className="text-gray-600 hover:text-yellow-500">
              <Link href="/orders"><ShoppingBag className="h-6 w-6" /></Link>
            </button>
            <button className="text-gray-600 hover:text-yellow-500">
              <Link href="/inbox"><Send className="h-6 w-6" /></Link>
            </button>
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/designs"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Designs
            </Link>
            <Link
              href="/designer"
              className="text-gray-600 hover:text-yellow-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Designer
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
