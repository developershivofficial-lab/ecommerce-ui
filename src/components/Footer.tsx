import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import { CATEGORIES } from '../data/products';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onSubscribeNewsletter: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSubscribeNewsletter }) => {
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
                <h5 className="font-bold text-zinc-900 text-sm">Free Express Courier</h5>
                <p className="text-xs text-zinc-500">Fast Pan-India delivery on orders over ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">100% Quality You Can Trust</h5>
                <p className="text-xs text-zinc-500">Handcrafted materials & 1-Year craftsmanship guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">7-Day Easy Replacement</h5>
                <p className="text-xs text-zinc-500">Hassle-free doorstep exchanges across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0 shadow-sm">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 text-sm">Customer Care Support</h5>
                <p className="text-xs text-zinc-500">Direct WhatsApp & call assistance for every order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Story */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo size="md" showTagline={true} />
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-sm">
              Gopal Bags brings you premium handcrafted women handbags, bridal & party clutches, structured tote bags, and everyday slings designed for pure elegance and lasting trust.
            </p>
            <div className="flex items-center gap-2 text-xs text-zinc-500 pt-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>by Gopal Bags • Quality You Can Trust</span>
            </div>
          </div>

          {/* Categories Links */}
          <div className="md:col-span-2 space-y-3">
            <h6 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Handbag Collections
            </h6>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${encodeURIComponent(cat)}`}
                    className="hover:text-amber-700 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Help Links */}
          <div className="md:col-span-2 space-y-3">
            <h6 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Assistance & Policy
            </h6>
            <ul className="space-y-2 text-xs text-zinc-600 font-medium">
              <li><Link to="/cart" className="hover:text-amber-700">Shopping Bag</Link></li>
              <li><Link to="/wishlist" className="hover:text-amber-700">Saved Wishlist</Link></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Shipping & Dispatch</span></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Return & Replacement</span></li>
              <li><span className="hover:text-amber-700 cursor-pointer">Authenticity Certificate</span></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-4">
            <h6 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              VIP Privileges Club
            </h6>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Subscribe to get exclusive early previews of new bridal clutch launches and an instant flat 20% discount coupon.
            </p>

            {subscribed ? (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900">
                🎉 Welcome to Gopal Bags VIP club! Use coupon GOPAL20 on your purchase.
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© 2026 Gopal Bags (Quality You Can Trust). All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-zinc-600 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-zinc-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-600 cursor-pointer">Gopal Bags Authenticity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
