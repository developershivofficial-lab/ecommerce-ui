import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize selected color
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      }
    }
  }, [product]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 font-['Outfit',sans-serif]">
          Bag Not Found
        </h2>
        <p className="text-zinc-500 text-sm mt-2">
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
        <Link to="/" className="hover:text-amber-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <Link to={`/category/${encodeURIComponent(product.category)}`} className="hover:text-amber-600 transition-colors">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-zinc-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (Thumbnails + Main Image) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
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

          {/* Main Large Image */}
          <div className="flex-1 relative aspect-[4/3.8] sm:aspect-square bg-zinc-50 rounded-3xl overflow-hidden border border-yellow-200/80 shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-zinc-950 shadow-md">
                  <Sparkles className="w-3 h-3 fill-zinc-950" />
                  <span>{product.badge}</span>
                </span>
              )}
              {discountPercent > 0 && (
                <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-black bg-red-500 text-white shadow-xs">
                  SAVE {discountPercent}%
                </span>
              )}
            </div>

            {/* Wishlist & Share Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
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
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category and Rating */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                {product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-zinc-400 font-normal">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-['Outfit',sans-serif] tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-950 font-['Outfit',sans-serif]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-base text-zinc-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {discountPercent}% OFF Festive Discount
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">Inclusive of all taxes & free Pan-India courier delivery</p>

            {/* Description */}
            <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>

            {/* Material & Dimensions Specifications */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/40 border border-yellow-200/70 space-y-2">
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
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-700 mb-2">
                  <span>SELECT COLOR: <span className="text-amber-600">{selectedColor}</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => {
                    const isSelected = selectedColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-zinc-950 font-bold shadow-xs'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-amber-300'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-zinc-300 shadow-2xs"
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

            {/* Quantity Selector & Stock Indicator */}
            <div className="mt-6 flex items-center justify-between gap-4">
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
                In Stock ({product.stockCount} bags available)
              </span>
            </div>

            {/* Action Buttons: Add to Bag & Buy Now */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onAddToCart(product, quantity, selectedColor)}
                className="py-3.5 px-6 rounded-xl bg-white hover:bg-amber-50 text-zinc-900 font-bold text-sm border-2 border-amber-400 hover:border-amber-500 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
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
            <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-zinc-600">
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-zinc-900">Free Express Delivery</span>
                <span className="text-[10px] text-zinc-400">All India Courier</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-zinc-900">7 Days Return</span>
                <span className="text-[10px] text-zinc-400">Hassle-Free Policy</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-amber-500 mb-1" />
                <span className="text-[11px] font-bold text-zinc-900">Original Certified</span>
                <span className="text-[10px] text-zinc-400">By Gopal Bags</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features & Craftsmanship Details */}
      {product.features && product.features.length > 0 && (
        <div className="mt-16 bg-white rounded-3xl border border-yellow-200/80 p-6 sm:p-10 shadow-xs">
          <h3 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] mb-4">
            Highlights & Craftsmanship Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.features.map((feat, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/40 border border-yellow-100 text-xs sm:text-sm text-zinc-800">
                <div className="w-5 h-5 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products / You May Also Love */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                Matching Collection
              </span>
              <h3 className="text-2xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] mt-0.5">
                More in {product.category}
              </h3>
            </div>
            <Link
              to={`/category/${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All {product.category}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isWishlisted={wishlist.some((w) => w.id === p.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={(prod) => onAddToCart(prod, 1)}
                onQuickView={() => navigate(`/product/${p.id}`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
