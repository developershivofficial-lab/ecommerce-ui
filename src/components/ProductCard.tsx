import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) => {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group relative bg-white rounded-2xl border border-yellow-200/80 hover:border-amber-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-zinc-50 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="inline-block bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && !product.badge && (
            <span className="inline-block bg-zinc-900 text-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-amber-400 text-zinc-950 shadow-md scale-110'
              : 'bg-white/90 text-zinc-600 hover:text-amber-600 hover:bg-white shadow-sm'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-zinc-950' : ''}`}
          />
        </button>

        {/* Hover Quick View Trigger */}
        <div className="absolute inset-x-0 bottom-3 px-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={() => onQuickView(product)}
            className="w-full py-2 px-3 rounded-xl bg-white/95 backdrop-blur-md text-zinc-900 font-bold text-xs shadow-md hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-200"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-amber-600 uppercase text-[11px] tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-zinc-900 text-xs">{product.rating}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-zinc-900 text-sm sm:text-base leading-snug line-clamp-1 hover:text-amber-600 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stockCount <= 10 && (
              <span className="text-[10px] text-amber-700 font-bold block">
                ⚡ Only {product.stockCount} left
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product)}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-sm hover:shadow-md hover:shadow-amber-400/30 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
