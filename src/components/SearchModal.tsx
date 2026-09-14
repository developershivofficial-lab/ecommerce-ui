import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const trendingTerms = ['Earbuds', 'Watch', 'Hoodie', 'Sneakers', 'Lamp', 'Projector'];

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="search-modal-backdrop" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            id="search-modal-box"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-yellow-200 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-zinc-100 bg-amber-50/40">
              <Search className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products by name, category, or features... (e.g. Earbuds)"
                className="w-full bg-transparent text-zinc-900 placeholder:text-zinc-400 text-base sm:text-lg focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-zinc-400 hover:text-zinc-600 rounded-full mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-xs font-semibold px-2 py-1 rounded bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Quick Trending Tags */}
            <div className="px-5 py-3 border-b border-zinc-100 bg-white flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Popular:
              </span>
              {trendingTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-2.5 py-1 rounded-full bg-amber-100/70 hover:bg-amber-200 text-amber-900 font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Search Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-zinc-100">
              {query.trim() === '' ? (
                <div className="py-12 text-center text-zinc-400">
                  <Search className="w-10 h-10 mx-auto mb-2 text-amber-300" />
                  <p className="text-sm font-medium text-zinc-600">Type anything to start searching</p>
                  <p className="text-xs text-zinc-400 mt-1">Explore our high-quality audio, fashion, and tech gear</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-zinc-500">
                  <p className="text-base font-semibold text-zinc-800">No products found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-zinc-400 mt-1">Try checking for typos or use broader category terms</p>
                </div>
              ) : (
                filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-amber-50/60 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-lg border border-zinc-100 bg-zinc-50"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                            {product.category}
                          </span>
                          {product.badge && (
                            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-zinc-900 text-sm group-hover:text-amber-700 transition-colors">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                          <span className="font-bold text-zinc-900 text-sm">₹{product.price.toLocaleString('en-IN')}</span>
                          {product.originalPrice && (
                            <span className="line-through text-zinc-400">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="p-2 rounded-lg bg-amber-100 hover:bg-amber-400 text-amber-900 transition-all font-medium text-xs flex items-center gap-1.5"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                      <button
                        type="button"
                        className="p-2 text-zinc-400 group-hover:text-amber-600 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
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
