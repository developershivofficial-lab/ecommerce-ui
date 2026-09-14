import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-yellow-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-amber-400 text-zinc-950 text-xs font-semibold px-4 py-1.5 flex items-center justify-between overflow-hidden">
        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium mx-auto md:mx-0">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-zinc-900" /> Free Express Delivery across India above ₹999
          </span>
          <span className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-zinc-900" /> 7-Day Easy Returns
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-900" /> Quality You Can Trust • 100% Genuine
          </span>
        </div>

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-1.5 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-zinc-950 animate-pulse" />
          <span>Special Offer: Use code <strong className="underline decoration-zinc-950 decoration-2">GOPAL20</strong> for 20% OFF!</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center shrink-0">
            <BrandLogo size="md" showTagline={true} />
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
                <span className="text-zinc-500 text-xs sm:text-sm">Search handbags, party clutches, totes...</span>
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 rounded shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Actions: Search (Mobile), Wishlist (/wishlist), Cart (/cart) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2.5 rounded-xl text-zinc-600 hover:bg-amber-50 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-zinc-700" />
            </button>

            {/* Wishlist Link Page */}
            <Link
              to="/wishlist"
              id="wishlist-header-link"
              className={`relative p-2.5 rounded-xl transition-colors ${
                location.pathname === '/wishlist'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-zinc-700 hover:bg-amber-50 hover:text-amber-700'
              }`}
              aria-label="Wishlist"
              title="Saved Bags"
            >
              <Heart className={`w-5 h-5 ${location.pathname === '/wishlist' ? 'fill-amber-600 text-amber-600' : ''}`} />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-zinc-950 font-bold text-xs rounded-full flex items-center justify-center shadow-xs border-2 border-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart Link Page */}
            <Link
              to="/cart"
              id="cart-header-link"
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                location.pathname === '/cart'
                  ? 'bg-zinc-950 text-amber-400'
                  : 'bg-amber-400 hover:bg-amber-500 text-zinc-950'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden md:inline font-semibold">Bag</span>
              {cartCount > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                  location.pathname === '/cart' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-950 text-amber-300'
                }`}>
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden lg:inline text-xs font-semibold pl-1 border-l border-current/20">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-700 hover:bg-amber-50 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar border-t border-yellow-100">
          {CATEGORIES.map((cat) => {
            const path = cat === 'All' ? '/' : `/category/${encodeURIComponent(cat)}`;
            const isSelected =
              cat === 'All'
                ? location.pathname === '/'
                : location.pathname === `/category/${encodeURIComponent(cat)}`;

            return (
              <Link
                key={cat}
                to={path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'text-zinc-950 bg-amber-400 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-amber-50'
                }`}
              >
                {cat}
              </Link>
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
              Explore Collections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const path = cat === 'All' ? '/' : `/category/${encodeURIComponent(cat)}`;
                const isSelected =
                  cat === 'All'
                    ? location.pathname === '/'
                    : location.pathname === `/category/${encodeURIComponent(cat)}`;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      navigate(path);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'bg-zinc-50 text-zinc-700 hover:bg-amber-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col gap-2 text-xs text-zinc-500">
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg bg-amber-50 text-zinc-900 font-bold"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" /> View Shopping Bag
                </span>
                <span className="bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full text-xs">
                  {cartCount}
                </span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 text-zinc-800 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Saved Wishlist
                </span>
                <span>{wishlistCount}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
