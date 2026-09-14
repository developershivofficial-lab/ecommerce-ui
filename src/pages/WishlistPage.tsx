import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface WishlistPageProps {
  wishlist: Product[];
  onRemoveWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlist,
  onRemoveWishlist,
  onMoveToCart
}) => {
  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          Your Wishlist is Empty
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
          Save your favorite bridal clutches, designer tote bags, and luxury handbags by clicking the heart icon.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Gopal Bags Collections</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-yellow-200/80 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            Saved Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Your personal curation of luxury Gopal Bags.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Bags</span>
        </Link>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {wishlist.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl border border-yellow-100 hover:border-amber-300 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3.8] bg-zinc-50 overflow-hidden">
                <Link to={`/product/${product.id}`} className="block w-full h-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <button
                  onClick={() => onRemoveWishlist(product)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-zinc-400 hover:text-red-500 shadow-sm border border-zinc-200 cursor-pointer transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="block font-bold text-sm text-zinc-900 hover:text-amber-600 transition-colors line-clamp-1 mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-1">
                    {product.material || product.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-yellow-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-base font-black text-zinc-950 font-['Outfit',sans-serif]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-zinc-400 line-through ml-1.5">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onMoveToCart(product)}
                    className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
