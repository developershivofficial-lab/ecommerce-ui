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
  RotateCcw,
  User,
  LogOut,
  MapPin
} from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from './UserProfileModal';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenSearch: () => void;
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenSearch,
  onSelectCategory,
  activeCategory = 'All'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { currentUser, isAuthenticated, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryClick = (cat: string) => {
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    if (location.pathname !== '/') {
      navigate(`/?category=${encodeURIComponent(cat)}`);
    } else {
      const el = document.getElementById('catalog-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-yellow-200/80 shadow-xs">
      {/* Top Banner */}
      <div className="bg-amber-400 text-zinc-950 text-xs font-semibold px-3 sm:px-4 py-1.5 flex items-center justify-between overflow-hidden">
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

        <div className="w-full md:w-auto text-center flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] truncate">
          <Sparkles className="w-3 h-3 text-zinc-950 animate-pulse shrink-0" />
          <span>Use code <strong className="underline decoration-zinc-950 decoration-2">GOPAL20</strong> for 20% OFF!</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center shrink-0 min-w-0">
            <BrandLogo size="md" showTagline={true} />
          </div>

          {/* Search Trigger (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              id="desktop-search-trigger"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-50 hover:bg-amber-50/50 border border-zinc-200 hover:border-yellow-300 text-zinc-400 hover:text-zinc-600 transition-all text-sm group cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors" />
                <span className="text-zinc-500 text-xs sm:text-sm">Search handbags, party clutches, totes...</span>
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 bg-white border border-zinc-200 rounded shadow-xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Actions: Search, User, Wishlist, Cart, Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-zinc-700 hover:bg-amber-50 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-zinc-800" />
            </button>

            {/* User Account / Sign In Button */}
            {isAuthenticated && currentUser ? (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-yellow-200 bg-amber-50/80 hover:bg-amber-100 text-zinc-900 transition-all cursor-pointer shadow-2xs"
                title="My Account & Address"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-950 text-amber-400 font-black text-[11px] sm:text-xs flex items-center justify-center border border-white">
                  {currentUser.firstName[0]?.toUpperCase()}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-zinc-900 max-w-[80px] truncate">
                  {currentUser.firstName}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-yellow-200 hover:border-amber-400 hover:bg-amber-50 text-zinc-800 text-xs font-bold transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Wishlist Link Page */}
            <Link
              to="/wishlist"
              id="wishlist-header-link"
              className={`relative p-2 rounded-xl transition-colors ${
                location.pathname === '/wishlist'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-zinc-700 hover:bg-amber-50 hover:text-amber-700'
              }`}
              aria-label="Wishlist"
              title="Saved Bags"
            >
              <Heart className={`w-5 h-5 ${location.pathname === '/wishlist' ? 'fill-amber-600 text-amber-600' : ''}`} />
              {wishlistCount > 0 && (
                <span
                  className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber-400 text-zinc-950 font-black text-[10px] rounded-full flex items-center justify-center shadow-xs border border-white"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link Page */}
            <Link
              to="/cart"
              id="cart-header-link"
              className={`relative flex items-center justify-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                location.pathname === '/cart'
                  ? 'bg-zinc-950 text-amber-400'
                  : 'bg-amber-400 hover:bg-amber-500 text-zinc-950'
              }`}
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 shrink-0" />
              <span className="hidden sm:inline font-bold">Bag</span>
              {cartCount > 0 && (
                <span className={`text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-black ${
                  location.pathname === '/cart' ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-950 text-amber-300'
                }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Trigger (3 lines) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-800 hover:bg-amber-50 active:bg-amber-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar border-t border-yellow-100">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat && location.pathname === '/';

            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'text-zinc-950 bg-amber-400 shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-amber-50'
                }`}
              >
                {cat}
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
            {/* Mobile User Authentication Banner */}
            <div className="mb-4 p-3 rounded-2xl bg-amber-50/90 border border-yellow-200">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-zinc-950 text-amber-400 font-black text-xs flex items-center justify-center border border-white">
                      {currentUser.firstName[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-zinc-900 leading-tight">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[150px]">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Profile
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-zinc-900 block">Gopal Bags Member</span>
                    <span className="text-[10px] text-zinc-500">Sign in with Brevo email verification</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-xs shadow-xs cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Browse Collections
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat && location.pathname === '/';

                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
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
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-zinc-900 font-bold"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" /> View Shopping Bag
                </span>
                <span className="bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full text-xs font-extrabold">
                  {cartCount}
                </span>
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 text-zinc-800 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Saved Wishlist
                </span>
                <span className="font-bold">{wishlistCount}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};
