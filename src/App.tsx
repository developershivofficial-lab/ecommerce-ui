import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import { Product, CartItem, FilterState, ToastMessage, OrderDetails } from './types';
import { INITIAL_PRODUCTS, PROMO_CODES } from './data/products';

import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { SearchModal } from './components/SearchModal';
import { ProductDetailModal } from './components/ProductDetailModal';

import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { WishlistPage } from './pages/WishlistPage';
import { CategoryPage } from './pages/CategoryPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

export default function App() {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  // Cart State with LocalStorage Persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gopalbags_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with LocalStorage Persistence
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('gopalbags_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active Promo Code
  const [appliedPromo, setAppliedPromo] = useState<string | null>('GOPAL20');

  // Filter & Search State
  const [filter, setFilter] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured'
  });

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Notifications / Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('gopalbags_cart', JSON.stringify(cart));
    } catch {
      // LocalStorage fallback
    }
  }, [cart]);

  // Save Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('gopalbags_wishlist', JSON.stringify(wishlist));
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

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1, color?: string) => {
    const chosenColor = color || product.colors?.[0]?.name;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(product.stockCount, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: chosenColor }];
      }
    });

    addToast(
      'Added to Shopping Bag!',
      `${product.name} (Qty: ${quantity}) is now in your bag.`,
      'success'
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number, color?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedColor === color) {
            return { ...item, quantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedColor === color)
      )
    );
    addToast('Item Removed', 'The bag was removed from your shopping bag.', 'info');
  };

  // Wishlist Operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      addToast('Removed from Wishlist', `${product.name} was removed from your saved list.`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('Saved to Wishlist!', `${product.name} has been added to your favorites.`, 'success');
    }
  };

  const handleMoveToCart = (product: Product) => {
    handleAddToCart(product, 1);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Buy Now: direct navigation to Checkout
  const handleBuyNow = (product: Product, quantity = 1, color?: string) => {
    handleAddToCart(product, quantity, color);
    setQuickViewProduct(null);
    navigate('/checkout');
  };

  // Promo Handlers
  const handleApplyPromo = (code: string) => {
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      addToast('Coupon Applied!', `${PROMO_CODES[code].description}`, 'success');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    addToast('Coupon Cleared', 'Discount coupon was removed.', 'info');
  };

  // Cart financial calculations
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
    setLastOrder(order);
    setCart([]);
    addToast(
      'Order Confirmed!',
      `Order #${order.orderId} placed successfully. Estimated delivery: ${order.estimatedDelivery}`,
      'success'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFA] text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Auto scroll on route change */}
      <ScrollToTop />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Navbar with Multi-Page Links */}
      <Navbar
        cartCount={cartCount}
        cartTotal={grandTotal}
        wishlistCount={wishlist.length}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Multi-Page Routes */}
      <div className="flex-1">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                wishlist={wishlist}
                filter={filter}
                onFilterChange={(newVals) => setFilter((prev) => ({ ...prev, ...newVals }))}
                onResetFilters={() =>
                  setFilter({
                    category: 'All',
                    searchQuery: '',
                    minPrice: 0,
                    maxPrice: 10000,
                    minRating: 0,
                    inStockOnly: false,
                    sortBy: 'featured'
                  })
                }
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            }
          />

          {/* Individual Product Detail Page (/product/:id) */}
          <Route
            path="/product/:id"
            element={
              <ProductDetailPage
                products={products}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p, qty, clr) => handleAddToCart(p, qty, clr)}
                onBuyNow={(p, qty, clr) => handleBuyNow(p, qty, clr)}
              />
            }
          />

          {/* Dedicated Shopping Bag Page (/cart) */}
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                appliedPromo={appliedPromo}
                onApplyPromo={handleApplyPromo}
                onRemovePromo={handleRemovePromo}
              />
            }
          />

          {/* Dedicated Multi-Step Checkout Page (/checkout) */}
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                subtotal={cartSubtotal}
                discount={promoDiscount}
                shippingFee={shippingFee}
                total={grandTotal}
                onOrderSuccess={handleOrderSuccess}
              />
            }
          />

          {/* Dedicated Saved Wishlist Page (/wishlist) */}
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                wishlist={wishlist}
                onRemoveWishlist={handleToggleWishlist}
                onMoveToCart={handleMoveToCart}
              />
            }
          />

          {/* Dedicated Category Page (/category/:categoryName) */}
          <Route
            path="/category/:categoryName"
            element={
              <CategoryPage
                products={products}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            }
          />

          {/* Dedicated Order Confirmation Page (/order-confirmation/:orderId) */}
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmationPage lastOrder={lastOrder} />}
          />

          {/* Fallback redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Global Quick View Product Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={Boolean(quickViewProduct && wishlist.some((w) => w.id === quickViewProduct.id))}
        onToggleWishlist={handleToggleWishlist}
        onAddToCartWithOptions={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Global Live Search Overlay (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setIsSearchOpen(false);
          navigate(`/product/${p.id}`);
        }}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Footer */}
      <Footer
        onSubscribeNewsletter={(email) =>
          addToast('Subscribed!', `Welcome ${email}! Coupon GOPAL20 is ready for your order.`, 'success')
        }
      />
    </div>
  );
}
