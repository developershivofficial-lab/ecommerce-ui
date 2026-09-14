import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  Sun,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  selectedCategory,
  onSelectCategory
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-yellow-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-amber-400 text-zinc-950 text-xs font-semibold px-4 py-1.5 flex items-center justify-between overflow-hidden">
        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium mx-auto md:mx-0">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Free Express Delivery above ₹999
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> 7-Day Hassle-Free Returns
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Certified
          </span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-zinc-950 animate-pulse" />
          <span>Launch Offer: Use coupon <strong className="underline underline-offset-2">YELLOW20</strong> for 20% OFF!</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectCategory('All')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-md shadow-amber-400/20 group-hover:rotate-6 transition-transform">
                <Sun className="w-6 h-6 text-zinc-900" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight font-['Outfit',sans-serif] text-zinc-900 flex items-center gap-1">
                  SOLARA<span className="text-amber-500">.</span>
                </span>
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-zinc-400 -mt-1">
                  Pure Yellow & White
                </span>
              </div>
            </button>
          </div>

          {/* Search Trigger (Desktop & Tablet) */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <button
              id="desktop-search-trigger"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-50 hover:bg-amber-50/50 border border-zinc-200 hover:border-yellow-300 text-zinc-400 hover:text-zinc-600 transition-all text-sm group cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                <span className="text-zinc-500 text-xs sm:text-sm">Search gadgets, streetwear, audio...</span>
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 rounded shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Actions: Search (Mobile), Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2.5 rounded-xl text-zinc-600 hover:bg-amber-50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-zinc-700" />
            </button>

            {/* Wishlist Button */}
            <button
              id="wishlist-header-btn"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl text-zinc-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-zinc-950 font-bold text-xs rounded-full flex items-center justify-center shadow-xs border-2 border-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="cart-header-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm shadow-md shadow-amber-400/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-zinc-950 text-amber-300 text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden lg:inline text-xs font-semibold pl-1 border-l border-zinc-900/20">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-700 hover:bg-amber-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-zinc-100">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'text-zinc-950 bg-amber-300 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-amber-50'
                }`}
              >
                {cat}
                {isSelected && (
                  <motion.div
                    layoutId="category-nav-bubble"
                    className="absolute inset-0 bg-amber-300 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-yellow-200 bg-white px-4 py-4 overflow-hidden shadow-lg"
          >
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Browse Categories
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-left text-sm font-semibold transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-300 text-zinc-950 font-bold'
                      : 'bg-zinc-50 text-zinc-700 hover:bg-amber-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col gap-2 text-xs text-zinc-500">
              <div className="flex items-center gap-2 text-zinc-700 font-medium">
                <Truck className="w-4 h-4 text-amber-500" /> Free delivery across India on ₹999+
              </div>
              <div className="flex items-center gap-2 text-zinc-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> 100% Genuine, Warranty Included
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
