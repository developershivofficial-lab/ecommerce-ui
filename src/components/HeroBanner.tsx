import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Tag, ShieldCheck, Truck, Star } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onSelectCategory?: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onSelectCategory }) => {
  const handleSelectClutches = () => {
    if (onSelectCategory) {
      onSelectCategory('Clutches');
    }
    onShopNow();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/40 via-amber-50/25 to-transparent pt-6 pb-5 sm:pt-10 sm:pb-8 border-b border-yellow-100 w-full">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-52 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Promo Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-amber-300 shadow-2xs mb-3.5 text-[11px] sm:text-xs font-bold text-amber-900"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">GOPAL BAGS FESTIVE EDIT</span>
          <span className="bg-amber-400 text-zinc-950 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase shrink-0">
            Up to 40% OFF
          </span>
        </motion.div>

        {/* Animated Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: 'easeOut' }}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 font-['Outfit',sans-serif] leading-[1.2] max-w-3xl mx-auto"
        >
          Handcrafted Luxury for Every Woman.{' '}
          <span className="relative inline-block text-zinc-900 underline decoration-amber-400 decoration-wavy decoration-2">
            Quality You Can Trust.
          </span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: 'easeOut' }}
          className="mt-3 text-xs sm:text-base text-zinc-600 max-w-2xl mx-auto leading-relaxed px-1"
        >
          Explore bespoke bridal clutches, structured office totes, premium Saffiano handbags, and chic crossbody slings meticulously made with authentic craftsmanship.
        </motion.p>

        {/* Animated Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24, ease: 'easeOut' }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5"
        >
          <button
            id="hero-shop-now-btn"
            onClick={onShopNow}
            className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Bags Catalog</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <button
            id="hero-clutches-btn"
            onClick={handleSelectClutches}
            className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-amber-50 text-zinc-800 font-bold text-xs sm:text-sm border border-zinc-200 hover:border-amber-300 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Tag className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Bridal & Party Clutches</span>
          </button>
        </motion.div>

        {/* Animated Trust Indicators (Compact Strip) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
          className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-yellow-200/70 max-w-2xl mx-auto grid grid-cols-3 gap-2 sm:gap-6 text-[10px] sm:text-xs text-zinc-600"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span className="text-center sm:text-left"><strong className="text-zinc-900 font-bold">15,000+</strong> Bags</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-center sm:text-left"><strong className="text-zinc-900 font-bold">4.9 ★</strong> Rating</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
            <span className="text-center sm:text-left"><strong className="text-zinc-900 font-bold">100%</strong> Genuine</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
