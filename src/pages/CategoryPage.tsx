import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PackageX, ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CategoryPageProps {
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

const CATEGORY_DESCRIPTIONS: Record<string, { title: string; subtitle: string }> = {
  Handbags: {
    title: 'Women Handbags & Satchels',
    subtitle: 'Timeless structured silhouettes, Saffiano leather, and versatile top-handle bags designed for modern elegance.'
  },
  Clutches: {
    title: 'Bridal, Party & Evening Clutches',
    subtitle: 'Artisanal zari hand-embroidery, Austrian crystal minaudières, and heirloom raw silk box clutches for special moments.'
  },
  'Tote Bags': {
    title: 'Designer Work & Everyday Tote Bags',
    subtitle: 'Generous laptop-friendly totes crafted with pebble-grain vegan leather and heavy-duty coated canvas.'
  },
  'Sling Bags': {
    title: 'Crossbody Slings & Mini Bags',
    subtitle: 'Lightweight chevron quilted slings and gilded chain shoulder bags designed for hands-free chic mobility.'
  },
  Wallets: {
    title: 'Bifold Wallets & Card Organizers',
    subtitle: 'Slim RFID-protected wallets and travel clutches with gold foil Gopal Bags insignia.'
  }
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const decodedCategory = decodeURIComponent(categoryName || 'Handbags');

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount'>('featured');
  const [maxPrice, setMaxPrice] = useState(5000);

  const meta = CATEGORY_DESCRIPTIONS[decodedCategory] || {
    title: `${decodedCategory} Collection`,
    subtitle: 'Handcrafted luxury women bags crafted by Gopal Bags.'
  };

  const filtered = useMemo(() => {
    return products
      .filter((p) => p.category === decodedCategory && p.price <= maxPrice)
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'discount') {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        }
        return 0;
      });
  }, [products, decodedCategory, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Category Header Banner */}
      <div className="bg-gradient-to-r from-amber-100/60 via-amber-50 to-white rounded-3xl p-6 sm:p-10 border border-yellow-200/80 mb-8 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gopal Bags Official Edit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-['Outfit',sans-serif] tracking-tight">
            {meta.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
            {meta.subtitle}
          </p>
        </div>
      </div>

      {/* Sorting & Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-yellow-100">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
          <span>Showing {filtered.length} curated bags</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
            <span>Max Price:</span>
            <input
              type="range"
              min={1000}
              max={5000}
              step={200}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-amber-500 cursor-pointer w-28"
            />
            <span className="font-bold text-zinc-900">₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 bg-white font-semibold text-zinc-800 text-xs focus:outline-hidden focus:border-amber-400"
            >
              <option value="featured">Featured & Trending</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-yellow-200 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-800">No bags found in this price range</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Try increasing the maximum price filter slider above.
          </p>
          <button
            onClick={() => setMaxPrice(5000)}
            className="mt-5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Reset Price Filter
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
