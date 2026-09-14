import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ShoppingBag,
  Zap,
  Star,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Share2,
  PackageCheck
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { matchProductBySlugOrId, getProductUrl } from '../utils/slug';

interface ProductDetailPageProps {
  products: Product[];
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, color?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  products,
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}) => {
  const { slug, id, productSlug } = useParams<{ slug?: string; id?: string; productSlug?: string }>();
  const navigate = useNavigate();

  // Find product by slug or id using our slug utility
  const product: Product | undefined = matchProductBySlugOrId<Product>(products, slug || id || productSlug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize state when product is loaded
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
    }
  }, [product]);

  // Always scroll to top when opening a product
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug, id]);

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 font-['Outfit',sans-serif]">
          Bag Not Found
        </h2>
        <p className="text-zinc-500 text-sm mt-2 max-w-sm">
          The requested Gopal Bags item may have been moved or is currently out of stock.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bags</span>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some((w) => w.id === product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCategoryClick = () => {
    navigate(`/?category=${encodeURIComponent(product.category)}#catalog-section`);
  };

  return (
    <div className="w-full min-h-screen bg-white pb-24 sm:pb-16" id="product-detail-screen">
      {/* Mobile Sticky Top Navigation Bar (Full Screen Edge-to-Edge) */}
      <div className="sm:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-yellow-200/80 px-3 py-2.5 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-xl text-zinc-700 hover:bg-amber-50 flex items-center gap-1 cursor-pointer"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-800" />
          <span className="text-xs font-bold text-zinc-800">Back</span>
        </button>

        <span className="text-xs font-bold text-zinc-800 truncate max-w-[170px] font-['Outfit',sans-serif]">
          {product.name}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleWishlist(product)}
            className="p-1.5 rounded-xl text-zinc-700 hover:bg-amber-50 cursor-pointer"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-zinc-700'}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl text-zinc-700 hover:bg-amber-50 cursor-pointer"
            aria-label="Share"
          >
            {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5 text-zinc-700" />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-6">
        {/* Desktop Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <button onClick={handleCategoryClick} className="hover:text-amber-600 transition-colors cursor-pointer">
            {product.category}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-900 font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase: Edge-to-edge on mobile, spacious grid on tablet/desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 sm:gap-8 lg:gap-12">
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Desktop / Tablet Vertical Thumbnails */}
            {product.images.length > 1 && (
              <div className="hidden sm:flex sm:flex-col gap-3 overflow-y-auto sm:w-20 shrink-0 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-500 shadow-md scale-102'
                        : 'border-zinc-200 hover:border-amber-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Stage: Edge-to-Edge on Mobile, Rounded on Desktop */}
            <div className="flex-1 relative w-full aspect-square sm:aspect-[4/3.8] bg-zinc-50 sm:rounded-3xl overflow-hidden sm:border border-yellow-200/80 shadow-2xs">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </AnimatePresence>

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-400 text-zinc-950 shadow-md">
                    <Sparkles className="w-3 h-3 fill-zinc-950" />
                    <span>{product.badge}</span>
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-black bg-red-500 text-white shadow-xs">
                    SAVE {discountPercent}%
                  </span>
                )}
              </div>

              {/* Desktop Wishlist & Share buttons */}
              <div className="hidden sm:flex absolute top-4 right-4 flex-col gap-2 z-10">
                <button
                  onClick={() => onToggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-50 text-red-500 border border-red-200'
                      : 'bg-white/90 text-zinc-600 hover:text-red-500 hover:bg-white border border-zinc-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Share"
                  className="w-11 h-11 rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-amber-600 border border-zinc-200 shadow-md flex items-center justify-center transition-all cursor-pointer"
                  title="Copy product link"
                >
                  {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Mobile Thumbnail Carousel Dots / Strip */}
              {product.images.length > 1 && (
                <div className="sm:hidden absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === idx ? 'w-6 bg-amber-500' : 'w-2 bg-white/80'
                      }`}
                      aria-label={`Show image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Horizontal Thumbnails Strip under main image */}
            {product.images.length > 1 && (
              <div className="sm:hidden flex items-center gap-2 px-4 pt-3 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-amber-500 shadow-xs'
                        : 'border-zinc-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Purchase Controls */}
          <div className="lg:col-span-5 px-4 sm:px-0 pt-4 sm:pt-0 flex flex-col justify-between">
            <div>
              {/* Category and Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <button
                  onClick={handleCategoryClick}
                  className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/70 hover:bg-amber-200 px-2.5 py-1 rounded-md border border-amber-200/80 transition-colors cursor-pointer"
                >
                  {product.category}
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-zinc-400 font-normal">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-['Outfit',sans-serif] tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="mt-3 sm:mt-4 flex items-baseline gap-2.5 sm:gap-3">
                <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-['Outfit',sans-serif]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm sm:text-base text-zinc-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                Inclusive of all taxes • Free express doorstep delivery
              </p>

              {/* Description */}
              <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications Box */}
              <div className="mt-4 sm:mt-5 p-3.5 sm:p-4 rounded-2xl bg-amber-50/50 border border-yellow-200/80 space-y-2">
                {product.material && (
                  <div className="flex items-start gap-2 text-xs text-zinc-700">
                    <strong className="text-zinc-900 min-w-20 font-semibold">Material:</strong>
                    <span>{product.material}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex items-start gap-2 text-xs text-zinc-700">
                    <strong className="text-zinc-900 min-w-20 font-semibold">Dimensions:</strong>
                    <span>{product.dimensions}</span>
                  </div>
                )}
                <div className="flex items-start gap-2 text-xs text-zinc-700">
                  <strong className="text-zinc-900 min-w-20 font-semibold">Authenticity:</strong>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <PackageCheck className="w-3.5 h-3.5" /> 100% Original Gopal Bags Craftsmanship
                  </span>
                </div>
              </div>

              {/* Color Swatch Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4 sm:mt-5">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-700 mb-2">
                    <span>SELECT COLOR: <span className="text-amber-600">{selectedColor}</span></span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50 text-zinc-950 font-bold shadow-2xs'
                              : 'border-zinc-200 bg-white text-zinc-600 hover:border-amber-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-zinc-300 shadow-2xs"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-amber-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Desktop Quantity Selector & Stock Indicator */}
              <div className="hidden sm:flex mt-6 items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-700">Quantity:</span>
                  <div className="flex items-center border border-zinc-200 rounded-xl bg-white shadow-2xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 rounded-l-xl font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-zinc-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 rounded-r-xl font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  In Stock ({product.stockCount} available)
                </span>
              </div>

              {/* Desktop Action Buttons: Add to Bag & Buy Now */}
              <div className="hidden sm:grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => onAddToCart(product, quantity, selectedColor)}
                  className="py-3.5 px-6 rounded-xl bg-white hover:bg-amber-50 text-zinc-900 font-bold text-sm border-2 border-amber-400 hover:border-amber-500 shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>Add to Shopping Bag</span>
                </button>

                <button
                  onClick={() => onBuyNow(product, quantity, selectedColor)}
                  className="py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-zinc-950" />
                  <span>Buy Now (Express)</span>
                </button>
              </div>

              {/* Trust Assurances */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-zinc-600">
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900">Free Express</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400">Doorstep Delivery</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900">7 Days Return</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400">Easy Exchange</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 mb-1" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-zinc-900">Original Certified</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400">By Gopal Bags</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features & Craftsmanship Details */}
        {product.features && product.features.length > 0 && (
          <div className="mt-10 sm:mt-16 mx-4 sm:mx-0 bg-white rounded-2xl sm:rounded-3xl border border-yellow-200/80 p-5 sm:p-8 shadow-2xs">
            <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] mb-3 sm:mb-4">
              Highlights & Craftsmanship Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {product.features.map((feat, index) => (
                <div key={index} className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-amber-50/40 border border-yellow-100 text-xs sm:text-sm text-zinc-800">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products / Matching Bags */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 sm:mt-16 mx-4 sm:mx-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                  Matching Bags
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] mt-0.5">
                  More in {product.category}
                </h3>
              </div>
              <button
                onClick={handleCategoryClick}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isWishlisted={wishlist.some((w) => w.id === p.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToCart={(prod) => onAddToCart(prod, 1)}
                  onQuickView={() => navigate(getProductUrl(p))}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Floating Action Bar: Full Screen App Feel */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-yellow-200/90 px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xl">
        <div className="shrink-0">
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Price</div>
          <div className="text-lg font-black text-zinc-950 font-['Outfit',sans-serif]">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => onAddToCart(product, quantity, selectedColor)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white text-zinc-900 font-bold text-xs border border-amber-400 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={() => onBuyNow(product, quantity, selectedColor)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 active:bg-amber-500 text-zinc-950 font-black text-xs shadow-md shadow-amber-400/30 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
