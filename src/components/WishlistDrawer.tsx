import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveWishlist,
  onMoveToCart
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id="wishlist-drawer-root" className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-yellow-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-amber-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-zinc-950 font-bold">
                  <Heart className="w-4 h-4 fill-zinc-950" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-lg font-['Outfit',sans-serif]">
                    Your Wishlist
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white text-zinc-400 hover:text-zinc-700 transition-colors"
                aria-label="Close wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
              {wishlist.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 text-amber-600">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-zinc-800 text-base">Your wishlist is empty</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Save your favorite products to keep track of them and buy later.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Discover Items
                  </button>
                </div>
              ) : (
                wishlist.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-4 flex gap-3.5 items-center"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl border border-zinc-200 bg-zinc-50 shrink-0"
                    />

                    <div className="flex-1">
                      <h4 className="font-semibold text-zinc-900 text-sm line-clamp-1">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-bold text-zinc-900 text-sm">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-zinc-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onMoveToCart(product)}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => onRemoveWishlist(product)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
