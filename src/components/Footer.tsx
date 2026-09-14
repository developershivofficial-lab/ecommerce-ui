import React, { useState } from 'react';
import { Sun, Mail, ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onSubscribeNewsletter: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onSubscribeNewsletter }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubscribeNewsletter(email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-yellow-200 bg-white">
      {/* Value Pillars Bar */}
      <div className="bg-amber-50/70 border-b border-yellow-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Free Express Delivery</h5>
                <p className="text-xs text-zinc-500">On all eligible orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">100% Genuine Guarantee</h5>
                <p className="text-xs text-zinc-500">Authentic products with manufacturer warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">7-Day Easy Return</h5>
                <p className="text-xs text-zinc-500">Hassle-free doorstep returns and exchanges</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">24/7 Priority Support</h5>
                <p className="text-xs text-zinc-500">Instant dedicated customer assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-zinc-900 shadow-md">
                <Sun className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold font-['Outfit',sans-serif] text-zinc-900 tracking-tight">
                SOLARA<span className="text-amber-500">.</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              Crafting a bright, energetic, and seamless shopping experience. Designed with a clean yellow and white aesthetic for effortless discovery of premium tech and lifestyle products.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>for modern e-commerce storefronts</span>
            </div>
          </div>

          {/* Categories Links */}
          <div className="md:col-span-2 space-y-3">
            <h6 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Explore
            </h6>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              {['Electronics', 'Audio', 'Fashion', 'Footwear', 'Home', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Help Links */}
          <div className="md:col-span-2 space-y-3">
            <h6 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Customer Care
            </h6>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              <li><span className="hover:text-amber-700 cursor-pointer">Order Tracking</span></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Shipping Policy</span></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Returns & Refunds</span></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Privacy Guarantee</span></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-4">
            <h6 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Stay in the Glow
            </h6>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Subscribe to get exclusive early access to drop alerts and flat 15% OFF your next order.
            </p>

            {subscribed ? (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900">
                🎉 Welcome to the Solara VIP club! Coupon SOLARA15 unlocked.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Join</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            <div className="pt-2 text-[11px] text-zinc-400 flex items-center gap-2">
              <span>Secure 256-bit SSL encrypted checkout</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} Solara Store. All rights reserved. Clean Yellow & White Frontend Prototype.</p>
          <div className="flex items-center gap-4 text-zinc-400 text-xs">
            <span className="font-semibold text-zinc-700">Accepted Demo Payments:</span>
            <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-800 font-bold text-[10px]">UPI</span>
            <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-800 font-bold text-[10px]">VISA</span>
            <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-800 font-bold text-[10px]">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-800 font-bold text-[10px]">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
