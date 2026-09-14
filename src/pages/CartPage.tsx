import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { CartItem } from '../types';
import { PROMO_CODES } from '../data/products';
import { getProductUrl } from '../utils/slug';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, color?: string) => void;
  onRemoveItem: (productId: string, color?: string) => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  onApplyPromo,
  onRemovePromo
}) => {
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const freeShippingGoal = 999;
  const isFreeShipping = subtotal >= freeShippingGoal || appliedPromo === 'FREESHIP';
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 99;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingGoal) * 100));

  let discount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const p = PROMO_CODES[appliedPromo];
    if (subtotal >= p.minSpend) {
      discount = Math.round((subtotal * p.discountPercent) / 100);
    }
  }

  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) return;

    if (PROMO_CODES[cleanCode]) {
      const promo = PROMO_CODES[cleanCode];
      if (subtotal < promo.minSpend) {
        setPromoError(`Requires minimum purchase of ₹${promo.minSpend.toLocaleString('en-IN')}`);
        return;
      }
      onApplyPromo(cleanCode);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try GOPAL20 or YELLOW20');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
          Explore our signature collection of women handbags, bridal clutches, and everyday tote bags.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Start Shopping Handbags</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-yellow-200/80 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
            Shopping Bag ({totalCount} {totalCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Review your selected Gopal Bags before proceeding to checkout.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Delivery Meter */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-yellow-200">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-800 mb-2">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-600" />
                {isFreeShipping ? (
                  <span className="text-emerald-700">Congratulations! You unlocked Free Express Courier Delivery</span>
                ) : (
                  <span>Add ₹{(freeShippingGoal - subtotal).toLocaleString('en-IN')} more for Free Delivery</span>
                )}
              </span>
              <span className="text-amber-700">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-yellow-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-3xl border border-yellow-100 shadow-xs divide-y divide-yellow-100/60 overflow-hidden">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.selectedColor}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail and Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      to={getProductUrl(item.product)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-zinc-50 border border-yellow-200/80 shrink-0 block"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        {item.product.category}
                      </span>
                      <Link
                        to={getProductUrl(item.product)}
                        className="block font-bold text-sm sm:text-base text-zinc-900 hover:text-amber-600 transition-colors truncate"
                      >
                        {item.product.name}
                      </Link>

                      {item.selectedColor && (
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500">
                          <span>Color:</span>
                          <span className="font-semibold text-zinc-800">{item.selectedColor}</span>
                        </div>
                      )}

                      <div className="mt-1 text-sm font-black text-zinc-950 font-['Outfit',sans-serif]">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-white shadow-2xs">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                        }
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 rounded-l-xl font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-zinc-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.product.id,
                            Math.min(item.product.stockCount, item.quantity + 1),
                            item.selectedColor
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 rounded-r-xl font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-20">
                      <div className="text-sm font-black text-zinc-950 font-['Outfit',sans-serif]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor)}
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-yellow-200/80 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-zinc-900 font-['Outfit',sans-serif] mb-4">
              Order Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-3 text-sm text-zinc-600 pb-5 border-b border-yellow-100">
              <div className="flex justify-between">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Promo Discount
                  </span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-zinc-900">₹{shippingFee}</span>
                  )}
                </span>
              </div>
            </div>

            {/* Coupon Code Box */}
            <div className="py-4 border-b border-yellow-100">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Coupon <strong>{appliedPromo}</strong> applied</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-zinc-400 hover:text-red-500 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromoCode} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. GOPAL20)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs uppercase font-bold rounded-xl border border-zinc-200 focus:outline-hidden focus:border-amber-500 bg-zinc-50"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-500 font-medium">{promoError}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                    <Tag className="w-3 h-3 text-amber-500" />
                    <span>Available: <strong>GOPAL20</strong> (20% OFF)</span>
                  </div>
                </form>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-4 mb-6 flex justify-between items-baseline">
              <div>
                <span className="text-base font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                  Grand Total
                </span>
                <p className="text-[10px] text-zinc-400">Inclusive of GST & all taxes</p>
              </div>
              <span className="text-2xl font-black text-zinc-950 font-['Outfit',sans-serif]">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Checkout CTA */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Secure Checkout
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-amber-500" /> Quality Assured
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
