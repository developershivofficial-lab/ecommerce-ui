import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { getProductUrl } from '../utils/slug';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const productUrl = getProductUrl(product);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-yellow-100 hover:border-amber-400/80 shadow-2xs hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveImageIndex(0);
      }}
    >
      {/* Top Image Showcase Area */}
      <div className="relative w-full aspect-[4/3.8] bg-zinc-50 overflow-hidden">
        {/* Clickable Image to Dedicated Full Product Page */}
        <Link to={productUrl} className="block w-full h-full relative cursor-pointer">
          <img
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Ambient Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges: Category & Promotional Tag */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide bg-amber-400 text-zinc-950 shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 fill-zinc-950" />
              <span>{product.badge}</span>
            </span>
          )}

          {discountPercent > 0 && (
            <span className="inline-block px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-white/95 text-red-600 border border-red-200 backdrop-blur-xs shadow-2xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Add to Wishlist"
          className={`absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors shadow-2xs backdrop-blur-md cursor-pointer ${
            isWishlisted
              ? 'bg-red-50 text-red-500 border border-red-200'
              : 'bg-white/90 text-zinc-600 hover:text-red-500 hover:bg-white border border-zinc-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
        </motion.button>

        {/* View Details Button (Reveals on Hover) */}
        <div className="absolute bottom-3 inset-x-3 z-10 hidden sm:flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(productUrl);
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-white/95 hover:bg-white text-zinc-900 text-xs font-bold shadow-md border border-zinc-200/80 backdrop-blur-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-700" />
            <span>Open Product</span>
          </button>
        </div>

        {/* Multiple Image Preview Dots on Card */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 group-hover:hidden">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === activeImageIndex ? 'bg-amber-500 w-3' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-amber-600 uppercase tracking-wider text-[10px] sm:text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-zinc-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-zinc-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title with Link */}
          <Link
            to={productUrl}
            className="block font-['Outfit',sans-serif] font-bold text-sm sm:text-base text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1 mb-1"
          >
            {product.name}
          </Link>

          {/* Material / Dimension Snippet */}
          <p className="text-xs text-zinc-500 line-clamp-1 mb-2.5 sm:mb-3">
            {product.material || product.description}
          </p>

          {/* Available Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[10px] text-zinc-400 font-medium">Colors:</span>
              <div className="flex items-center gap-1">
                {product.colors.map((c, i) => (
                  <span
                    key={i}
                    title={c.name}
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-zinc-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Bag */}
        <div className="pt-2.5 sm:pt-3 border-t border-yellow-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black text-zinc-950 font-['Outfit',sans-serif]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-[11px] sm:text-xs text-zinc-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 block">Free Courier</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => onAddToCart(product)}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-zinc-950 font-bold text-xs shadow-2xs hover:shadow-md flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add to Bag</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
