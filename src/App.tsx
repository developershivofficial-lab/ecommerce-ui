import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PackageX } from 'lucide-react';

import { Product, CartItem, FilterState, ToastMessage, OrderDetails } from './types';
import { INITIAL_PRODUCTS, PROMO_CODES } from './data/products';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

export default function App() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Cart State with LocalStorage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('solara_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with LocalStorage Persistence
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('solara_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Promo
  const [appliedPromo, setAppliedPromo] = useState<string | null>('YELLOW20');

  // Filter & Search State
  const [filter, setFilter] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 25000,
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured'
  });

  // Modal / Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Notifications / Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('solara_cart', JSON.stringify(cart));
    } catch {
      // LocalStorage fallback
    }
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('solara_wishlist', JSON.stringify(wishlist));
    } catch {
      // LocalStorage fallback
    }
  }, [wishlist]);

  // Global Keyboard Shortcut for Search (⌘K / Ctrl+K / /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast Helper
  const addToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const chosenColor = color || product.colors?.[0]?.name;
    const chosenSize = size || product.sizes?.[0];

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(product.stockCount, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: chosenColor, selectedSize: chosenSize }];
      }
    });

    addToast(
      'Added to Bag!',
      `${product.name} (Qty: ${quantity}) has been added to your shopping cart.`,
      'success'
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          ) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
    addToast('Item Removed', 'The item was removed from your bag.', 'info');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      addToast('Removed from Wishlist', `${product.name} was removed.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('Saved to Wishlist!', `${product.name} has been saved for later.`, 'success');
    }
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product, 1);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Buy Now (Direct Checkout shortcut)
  const handleBuyNow = (product: Product, quantity = 1, color?: string, size?: string) => {
    handleAddToCart(product, quantity, color, size);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Promo Handlers
  const handleApplyPromo = (code: string) => {
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      addToast('Promo Code Applied!', `${PROMO_CODES[code].description}`, 'success');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast('Coupon Removed', 'Discount coupon was cleared.', 'info');
  };

  // Filter Calculations
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (filter.category !== 'All' && p.category !== filter.category) return false;
        // Search
        if (filter.searchQuery.trim()) {
          const q = filter.searchQuery.toLowerCase();
          const match =
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
          if (!match) return false;
        }
        // Price
        if (p.price > filter.maxPrice) return false;
        // Rating
        if (p.rating < filter.minRating) return false;
        // In Stock
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
        return 0; // featured default
      });
  }, [products, filter]);

  // Totals
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  let promoDiscount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (cartSubtotal >= promo.minSpend) {
      promoDiscount = Math.round((cartSubtotal * promo.discountPercent) / 100);
    }
  }

  const freeShippingThreshold = 999;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold || appliedPromo === 'FREESHIP';
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal - promoDiscount + shippingFee);

  const handleOrderSuccess = (order: OrderDetails) => {
    // Clear cart on successful order
    setCart([]);
    addToast(
      'Order Confirmed!',
      `Order #${order.orderId} placed successfully. Estimated delivery: ${order.estimatedDelivery}`,
      'success'
    );
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilterDeals = () => {
    setFilter((prev) => ({ ...prev, sortBy: 'discount' }));
    handleScrollToCatalog();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA] text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={grandTotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        selectedCategory={filter.category}
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, category: cat }))}
      />

      {/* Compact Animated Hero Banner (Without the Picture) */}
      <HeroBanner
        onShopNow={handleScrollToCatalog}
        onFilterDeals={handleFilterDeals}
      />

      {/* Main Product Catalog Section (Shifted Up) */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 font-['Outfit',sans-serif] tracking-tight mt-1">
              {filter.category === 'All' ? 'Explore All Products' : `${filter.category} Collection`}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">
            Handpicked quality items crafted for minimal daily elegance.
          </p>
        </div>

        {/* Filters & Sorting Bar */}
        <div className="mb-8">
          <CategoryFilter
            filter={filter}
            onChangeFilter={(newVals) => setFilter((prev) => ({ ...prev, ...newVals }))}
            onResetFilters={() =>
              setFilter({
                category: 'All',
                searchQuery: '',
                minPrice: 0,
                maxPrice: 25000,
                minRating: 0,
                inStockOnly: false,
                sortBy: 'featured'
              })
            }
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
            <h3 className="text-lg font-bold text-zinc-800">No products match your criteria</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
              Try adjusting your price range, clearing some category filters, or searching with different keywords.
            </p>
            <button
              onClick={() =>
                setFilter({
                  category: 'All',
                  searchQuery: '',
                  minPrice: 0,
                  maxPrice: 25000,
                  minRating: 0,
                  inStockOnly: false,
                  sortBy: 'featured'
                })
              }
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
                  onToggleWishlist={handleToggleWishlist}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onQuickView={(p) => setSelectedProduct(p)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={Boolean(selectedProduct && wishlist.some((w) => w.id === selectedProduct.id))}
        onToggleWishlist={handleToggleWishlist}
        onAddToCartWithOptions={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Seamless Checkout Modal (Multi-Step Demo Payment) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        subtotal={cartSubtotal}
        discount={promoDiscount}
        shippingFee={shippingFee}
        total={grandTotal}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => setFilter((prev) => ({ ...prev, category: cat }))}
        onSubscribeNewsletter={(email) =>
          addToast('Subscribed!', `Welcome ${email}! Check your inbox for your 15% discount code.`, 'success')
        }
      />
    </div>
  );
}
