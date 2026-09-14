import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  Lock,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, ShippingAddress, PaymentMethod, OrderDetails } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  subtotal,
  discount,
  shippingFee,
  total,
  onOrderSuccess
}) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing'>('shipping');

  // Shipping Form State
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    phone: '9876543210',
    street: 'Flat 402, Golden Heritage Enclave, MG Road',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    deliverySpeed: 'express'
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('pooja@okhdfcbank');
  const [upiVerified, setUpiVerified] = useState(true);
  const [card, setCard] = useState({
    cardNumber: '4532 8921 4452 9012',
    cardHolder: 'POOJA SHARMA',
    expiry: '09/29',
    cvv: '821'
  });

  if (cart.length === 0 && step !== 'processing') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-600">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 font-['Outfit',sans-serif]">
          Your Bag is Empty
        </h2>
        <p className="text-zinc-500 text-sm mt-2">
          Please add handbags or clutches to your shopping bag before checking out.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Explore Gopal Bags Catalog</span>
        </Link>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulatePayment = () => {
    setStep('processing');

    setTimeout(() => {
      const orderId = `GB-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();
      const deliveryDate = new Date();
      deliveryDate.setDate(now.getDate() + (shipping.deliverySpeed === 'express' ? 2 : 5));

      const newOrder: OrderDetails = {
        orderId,
        items: [...cart],
        shippingAddress: shipping,
        paymentMethod,
        subtotal,
        discount,
        shippingFee,
        tax: 0,
        total,
        createdAt: now.toISOString(),
        estimatedDelivery: deliveryDate.toLocaleDateString('en-IN', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        })
      };

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#F59E0B', '#18181B', '#EAB308']
        });
      } catch {
        // Confetti fallback
      }

      onOrderSuccess(newOrder);
      navigate(`/order-confirmation/${orderId}`, { state: { order: newOrder } });
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Breadcrumb / Steps Indicator */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-yellow-200 w-full -z-10" />

          {/* Step 1 Indicator */}
          <div className="flex items-center gap-2 bg-[#FCFCFA] px-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 'shipping'
                  ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-100'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {step === 'shipping' ? '1' : <CheckCircle2 className="w-5 h-5" />}
            </span>
            <span className="text-xs font-bold text-zinc-900 hidden sm:inline">1. Delivery Address</span>
          </div>

          {/* Step 2 Indicator */}
          <div className="flex items-center gap-2 bg-[#FCFCFA] px-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step === 'payment'
                  ? 'bg-amber-400 text-zinc-950 ring-4 ring-amber-100'
                  : step === 'processing'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-bold text-zinc-900 hidden sm:inline">2. Payment Simulation</span>
          </div>

          {/* Step 3 Indicator */}
          <div className="flex items-center gap-2 bg-[#FCFCFA] px-3">
            <span className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <span className="text-xs font-bold text-zinc-400 hidden sm:inline">3. Order Confirmed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8">
          {step === 'shipping' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-yellow-200/80 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-yellow-100">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                    Delivery & Contact Information
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Your Gopal Bags parcel will be dispatched directly to this address.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted
                </span>
              </div>

              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Phone Number (For Courier OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Email Address (For Invoice & Tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Flat / House No. / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={shipping.pincode}
                      onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:border-amber-500 focus:outline-hidden text-sm bg-zinc-50/50"
                    />
                  </div>
                </div>

                {/* Delivery Speed Selection */}
                <div className="pt-4">
                  <label className="block text-xs font-bold text-zinc-700 mb-2">
                    Delivery Option
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        shipping.deliverySpeed === 'standard'
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliverySpeed"
                        checked={shipping.deliverySpeed === 'standard'}
                        onChange={() => setShipping({ ...shipping, deliverySpeed: 'standard' })}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-900">Standard Delivery (Free)</div>
                        <div className="text-[11px] text-zinc-500">Delivered within 4-5 business days</div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                        shipping.deliverySpeed === 'express'
                          ? 'border-amber-500 bg-amber-50/60 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliverySpeed"
                        checked={shipping.deliverySpeed === 'express'}
                        onChange={() => setShipping({ ...shipping, deliverySpeed: 'express' })}
                        className="text-amber-500 focus:ring-amber-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-900 flex items-center gap-1">
                          <span>Express Air Priority</span>
                          <span className="bg-amber-400 text-zinc-950 px-1.5 py-0.2 rounded text-[10px] font-extrabold">
                            FASTEST
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500">Delivered in 2 business days</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-sm shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-yellow-200/80 p-6 sm:p-8 shadow-xs"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-yellow-100">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 font-['Outfit',sans-serif]">
                    Select Payment Method (Demo Mode)
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    No real money will be charged. This prototype simulates the full payment gateway experience.
                  </p>
                </div>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Address</span>
                </button>
              </div>

              {/* Payment Mode Selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'upi'
                      ? 'border-amber-500 bg-amber-50 text-zinc-950 font-bold shadow-xs'
                      : 'border-zinc-200 hover:border-amber-300 text-zinc-600'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-amber-500 bg-amber-50 text-zinc-950 font-bold shadow-xs'
                      : 'border-zinc-200 hover:border-amber-300 text-zinc-600'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-50 text-zinc-950 font-bold shadow-xs'
                      : 'border-zinc-200 hover:border-amber-300 text-zinc-600'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <span className="text-xs">Cash on Delivery</span>
                </button>
              </div>

              {/* UPI Option */}
              {paymentMethod === 'upi' && (
                <div className="p-6 rounded-2xl bg-amber-50/40 border border-yellow-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated QR Code */}
                    <div className="bg-white p-3 rounded-2xl border border-yellow-200 shadow-sm shrink-0 flex flex-col items-center">
                      <div className="w-36 h-36 bg-zinc-900 rounded-xl p-2 flex flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="w-9 h-9 border-4 border-amber-400 rounded-lg p-1">
                            <div className="w-full h-full bg-amber-400 rounded-xs" />
                          </div>
                          <div className="w-9 h-9 border-4 border-amber-400 rounded-lg p-1">
                            <div className="w-full h-full bg-amber-400 rounded-xs" />
                          </div>
                        </div>
                        <div className="text-center text-[9px] font-black text-amber-400 tracking-wider">
                          SCAN & PAY ₹{total.toLocaleString('en-IN')}
                        </div>
                        <div className="flex justify-between">
                          <div className="w-9 h-9 border-4 border-amber-400 rounded-lg p-1">
                            <div className="w-full h-full bg-amber-400 rounded-xs" />
                          </div>
                          <div className="w-9 h-9 bg-amber-400/20 rounded-lg flex items-center justify-center text-amber-400 text-[10px] font-bold">
                            GB
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-semibold mt-2">
                        Scan with Google Pay, PhonePe, Paytm
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <label className="block text-xs font-bold text-zinc-700">
                        Or enter UPI ID / VPA
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value);
                            setUpiVerified(true);
                          }}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-amber-500 focus:outline-hidden bg-white"
                          placeholder="username@okhdfcbank"
                        />
                        <button
                          type="button"
                          onClick={() => setUpiVerified(true)}
                          className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-500"
                        >
                          Verify
                        </button>
                      </div>

                      {upiVerified && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verified: Gopal Bags Merchant Account Connected</span>
                        </div>
                      )}

                      <div className="p-3 bg-white rounded-xl border border-yellow-200 text-[11px] text-zinc-500">
                        Payment will be automatically recognized upon clicking &ldquo;Complete Demo Payment&rdquo;.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Option */}
              {paymentMethod === 'card' && (
                <div className="p-6 rounded-2xl bg-amber-50/40 border border-yellow-200 space-y-4">
                  {/* Virtual Golden Card Preview */}
                  <div className="w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-amber-950 p-5 text-white shadow-xl flex flex-col justify-between border border-amber-500/30">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                        GOPAL BAGS PRIVILEGE
                      </span>
                      <CreditCard className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="font-mono text-lg tracking-wider text-amber-100">
                      {card.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-400">Cardholder</div>
                        <div className="font-bold text-zinc-200">{card.cardHolder || 'POOJA SHARMA'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-400">Expires</div>
                        <div className="font-bold text-zinc-200">{card.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={card.cardNumber}
                        onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={card.cardHolder}
                        onChange={(e) => setCard({ ...card, cardHolder: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COD Option */}
              {paymentMethod === 'cod' && (
                <div className="p-6 rounded-2xl bg-amber-50/40 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">Cash on Delivery Available</h4>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                        Pay with cash or scan the courier agent&apos;s UPI QR code at the time of delivery to your doorstep.
                        No extra surcharge applied.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6">
                <button
                  type="button"
                  id="complete-demo-payment-btn"
                  onClick={handleSimulatePayment}
                  className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-black text-base shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Complete Demo Payment (₹{total.toLocaleString('en-IN')})</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <div className="bg-white rounded-3xl border border-yellow-200 p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-zinc-900 font-['Outfit',sans-serif]">
                Confirming with Gopal Bags Gateway...
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Generating order confirmation and invoice receipt</p>
            </div>
          )}
        </div>

        {/* Right Column: Order Recap */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-yellow-200/80 p-6 shadow-xs sticky top-28">
            <h3 className="text-base font-bold text-zinc-900 font-['Outfit',sans-serif] mb-4">
              Your Items ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 mb-4 no-scrollbar">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-zinc-50 border border-zinc-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-zinc-500">Qty: {item.quantity} • {item.selectedColor}</p>
                  </div>
                  <span className="text-xs font-black text-zinc-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-yellow-100 space-y-2 text-xs text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Shipping</span>
                <span className="font-bold text-emerald-600">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="pt-3 border-t border-yellow-100 flex justify-between items-baseline">
                <span className="font-bold text-sm text-zinc-900">Total Payable</span>
                <span className="text-xl font-black text-zinc-950 font-['Outfit',sans-serif]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-col gap-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2 text-zinc-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Quality Inspected before dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Express Courier with SMS tracking alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
