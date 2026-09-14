import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PackageX, Sparkles, ShieldCheck, HeartHandshake, Award, Truck } from 'lucide-react';
import { Product, FilterState } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  wishlist: Product[];
  filter: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  wishlist,
  filter,
  onFilterChange,
  onResetFilters,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) => {
  // Filter and sort products
  const filteredProducts = products
    .filter((p) => {
      if (filter.category !== 'All' && p.category !== filter.category) return false;
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.material && p.material.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (p.price > filter.maxPrice) return false;
      if (p.rating < filter.minRating) return false;
      if (filter.inStockOnly && !p.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      if (filter.sortBy === 'price-asc') return a.price - b.price;
      if (filter.sortBy === 'price-desc') return b.price - a.price;
      if (filter.sortBy === 'rating') return b.rating - a.rating;
      if (filter.sortBy === 'discount') {
        const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      }
      return 0;
    });

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Showcase (Sleek, animated text & brand values, no photo) */}
      <HeroBanner onShopNow={handleScrollToCatalog} />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Gopal Bags Signature Edit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] tracking-tight mt-1">
              {filter.category === 'All' ? 'Women Handbags & Clutches' : `${filter.category} Collection`}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">
            Handcrafted with luxury finishes, premium vegan leather, and authentic details.
          </p>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="mb-8">
          <CategoryFilter
            filter={filter}
            onChangeFilter={onFilterChange}
            onResetFilters={onResetFilters}
            totalProducts={products.length}
            filteredCount={filteredProducts.length}
          />
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-yellow-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-800">No bags match your current filters</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Try adjusting your price range or selecting another category like Handbags or Bridal Clutches.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((product) => (
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

        {/* Why Choose Gopal Bags (Brand Story Pillar Strip) */}
        <section className="mt-16 sm:mt-20 pt-12 border-t border-yellow-100">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest">
              The Gopal Bags Promise
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] mt-1">
              Quality You Can Trust, In Every Stitch.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              For over two decades, Gopal Bags has been synonymous with durable elegance, fine stitching, and bespoke Indian craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-yellow-100 hover:border-amber-300 shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-900 font-['Outfit',sans-serif]">
                100% Genuine Materials
              </h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Premium grade vegan leather, authentic raw silk, and rust-free brass hardware tested for long-lasting durability.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-yellow-100 hover:border-amber-300 shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-900 font-['Outfit',sans-serif]">
                Artisanal Embroidery
              </h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Handcrafted zardozi, metallic sequins, and pearl work tailored for modern weddings and festive celebrations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-yellow-100 hover:border-amber-300 shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-900 font-['Outfit',sans-serif]">
                Express Pan-India Delivery
              </h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Securely boxed in luxury presentation packaging and delivered with priority courier tracking right to your door.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-yellow-100 hover:border-amber-300 shadow-xs transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-zinc-900 font-['Outfit',sans-serif]">
                7-Day Easy Replacement
              </h4>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Not completely in love with your bag? Enjoy no-questions-asked quick replacement or return support.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
