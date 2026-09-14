import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Zap,
  Check,
  Minus,
  Plus
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCartWithOptions: (product: Product, quantity: number, color?: string, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCartWithOptions,
  onBuyNow
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'features' | 'specs' | 'shipping'>('features');

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setQuantity(1);
      setSelectedColor(product.colors?.[0]?.name);
      setSelectedSize(product.sizes?.[0]);
      setActiveTab('features');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      <div id="product-detail-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-yellow-200 overflow-hidden z-10 max-h-[92vh] flex flex-col my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-amber-100 text-zinc-600 hover:text-zinc-900 shadow-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-5 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Image Gallery */}
              <div className="md:col-span-6 flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner">
                  <img
                    src={product.images[activeImageIdx] || product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-amber-400 text-zinc-950 text-xs font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeImageIdx === idx
                            ? 'border-amber-400 ring-2 ring-amber-300/40'
                            : 'border-zinc-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Product Info & Configuration */}
              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Category & Ratings */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-zinc-900">{product.rating}</span>
                      <span className="text-zinc-500 text-[11px]">({product.reviewCount} customer reviews)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] mt-2">
                    {product.name}
                  </h2>

                  {/* Pricing */}
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-zinc-900 font-['Outfit',sans-serif]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-base text-zinc-400 line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                          Save {discount}%
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-5">
                      <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block mb-2">
                        Color: <span className="text-amber-700">{selectedColor}</span>
                      </label>
                      <div className="flex items-center gap-2.5">
                        {product.colors.map((c) => {
                          const isPicked = selectedColor === c.name;
                          return (
                            <button
                              key={c.name}
                              onClick={() => setSelectedColor(c.name)}
                              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                                isPicked
                                  ? 'border-amber-400 bg-amber-50 text-zinc-900 shadow-xs'
                                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-inner"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{c.name}</span>
                              {isPicked && <Check className="w-3 h-3 text-amber-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Size Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-5">
                      <label className="text-xs font-bold text-zinc-800 uppercase tracking-wider block mb-2">
                        Size: <span className="text-amber-700">{selectedSize}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((sz) => {
                          const isPicked = selectedSize === sz;
                          return (
                            <button
                              key={sz}
                              onClick={() => setSelectedSize(sz)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isPicked
                                  ? 'bg-amber-400 text-zinc-950 shadow-xs ring-2 ring-amber-300'
                                  : 'bg-zinc-100 hover:bg-amber-100 text-zinc-700'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity & Stock Urgency */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-1.5 rounded-lg hover:bg-white text-zinc-700 transition-colors"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-extrabold text-zinc-900 text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                        className="p-1.5 rounded-lg hover:bg-white text-zinc-700 transition-colors"
                        disabled={quantity >= product.stockCount}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs">
                      {product.stockCount > 0 ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          In Stock ({product.stockCount} units available)
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold">Out of stock</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        onAddToCartWithOptions(product, quantity, selectedColor, selectedSize);
                      }}
                      className="py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => {
                        onBuyNow(product, quantity, selectedColor, selectedSize);
                      }}
                      className="py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>Buy Now</span>
                    </button>
                  </div>

                  {/* Wishlist toggle link */}
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className="text-xs font-semibold text-zinc-600 hover:text-amber-700 flex items-center gap-1.5 py-1"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Tabs for Info */}
                <div className="mt-8 pt-5 border-t border-zinc-100">
                  <div className="flex border-b border-zinc-200 text-xs font-bold">
                    <button
                      onClick={() => setActiveTab('features')}
                      className={`pb-2 px-3 border-b-2 transition-colors ${
                        activeTab === 'features'
                          ? 'border-amber-400 text-amber-700'
                          : 'border-transparent text-zinc-400 hover:text-zinc-700'
                      }`}
                    >
                      Highlights
                    </button>
                    <button
                      onClick={() => setActiveTab('shipping')}
                      className={`pb-2 px-3 border-b-2 transition-colors ${
                        activeTab === 'shipping'
                          ? 'border-amber-400 text-amber-700'
                          : 'border-transparent text-zinc-400 hover:text-zinc-700'
                      }`}
                    >
                      Shipping & Guarantees
                    </button>
                  </div>

                  <div className="py-3 text-xs text-zinc-600">
                    {activeTab === 'features' && (
                      <ul className="space-y-1.5">
                        {product.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {activeTab === 'shipping' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-amber-500" />
                          <span>Dispatched within 24 hours. Free express shipping on ₹999+.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-amber-500" />
                          <span>7-day door-to-door replacement guarantee.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                          <span>1-year manufacturer warranty against hardware defects.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
