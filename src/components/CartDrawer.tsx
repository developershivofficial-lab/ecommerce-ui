import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Tag,
  Truck,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { CartItem } from '../types';
import { PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  onRemoveItem: (productId: string, color?: string, size?: string) => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onProceedToCheckout
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Promo discount calculation
  let discount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (subtotal >= promo.minSpend) {
      discount = Math.round((subtotal * promo.discountPercent) / 100);
    }
  }

  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedPromo === 'FREESHIP';
  const shippingFee = items.length === 0 ? 0 : isFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const success = onApplyPromo(code);
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try YELLOW20 or SOLARA10');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="cart-drawer-root" className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Body */}
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
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-zinc-900 text-lg font-['Outfit',sans-serif]">
                    Your Shopping Bag
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white text-zinc-400 hover:text-zinc-700 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="px-5 py-3 bg-amber-100/40 border-b border-yellow-200/60 text-xs">
              <div className="flex items-center justify-between font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-zinc-800">
                  <Truck className="w-4 h-4 text-amber-600" />
                  {isFreeShipping ? (
                    <span className="text-amber-900 font-bold">🎉 Free Delivery Unlocked!</span>
                  ) : (
                    <span>Add ₹{amountNeeded.toLocaleString('en-IN')} more for Free Delivery</span>
                  )}
                </span>
                <span className="text-amber-800 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3 text-amber-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-zinc-800 text-base">Your cart is currently empty</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                    Explore our modern collection and add items to your cart.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="py-4 flex gap-3.5 group"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 object-cover rounded-xl border border-zinc-200 bg-zinc-50 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-zinc-900 text-xs sm:text-sm leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() =>
                              onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)
                            }
                            className="text-zinc-400 hover:text-rose-600 p-1 transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Variants */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                            {item.selectedColor && (
                              <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 font-medium">
                                {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 font-medium">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 p-0.5">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.max(1, item.quantity - 1),
                                item.selectedColor,
                                item.selectedSize
                              )
                            }
                            className="p-1 rounded hover:bg-white text-zinc-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-zinc-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.min(item.product.stockCount, item.quantity + 1),
                                item.selectedColor,
                                item.selectedSize
                              )
                            }
                            className="p-1 rounded hover:bg-white text-zinc-600 transition-colors"
                            disabled={item.quantity >= item.product.stockCount}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold text-zinc-900 text-sm font-['Outfit',sans-serif]">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="p-5 border-t border-yellow-200 bg-zinc-50/70 space-y-3.5">
                {/* Promo Code Input */}
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-amber-100 border border-amber-300 px-3 py-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Code applied: {appliedPromo}</span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-amber-800 hover:text-rose-600 font-bold underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          placeholder="Promo code (e.g. YELLOW20)"
                          className="w-full bg-white border border-zinc-200 pl-8 pr-3 py-2 text-xs rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 uppercase font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-rose-600 font-medium">{promoError}</p>
                    )}
                  </form>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-zinc-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-amber-700 font-semibold">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold text-zinc-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-extrabold text-zinc-900">
                    <span>Grand Total</span>
                    <span className="text-lg font-black font-['Outfit',sans-serif] text-zinc-900">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <button
                  id="cart-checkout-proceed-btn"
                  onClick={onProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
