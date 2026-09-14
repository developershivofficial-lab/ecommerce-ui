import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Clock,
  Sparkles,
  Package,
  Printer
} from 'lucide-react';
import { CartItem, ShippingAddress, PaymentMethod, CardDetails, OrderDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotal,
  discount,
  shippingFee,
  total,
  onOrderSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Step 1: Shipping State
  const [shipping, setShipping] = useState<ShippingAddress>({
    fullName: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    phone: '+91 98765 43210',
    street: 'Flat 402, Sunshine Heights, MG Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    deliverySpeed: 'standard'
  });

  // Step 2: Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('aditya@okhdfcbank');
  const [card, setCard] = useState<CardDetails>({
    cardNumber: '4242 •••• •••• 9284',
    cardHolder: 'ADITYA SHARMA',
    expiry: '08/28',
    cvv: '884'
  });

  // Completed Order Record
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.email || !shipping.street || !shipping.pincode) {
      return;
    }
    setStep(2);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);

    // Realistic demo payment delay simulation (1.4s)
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrderId = `SOL-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: OrderDetails = {
        orderId: generatedOrderId,
        items: [...cartItems],
        shippingAddress: shipping,
        paymentMethod,
        subtotal,
        discount,
        shippingFee,
        tax: Math.round(total * 0.05),
        total,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
          'en-IN',
          { weekday: 'short', day: 'numeric', month: 'short' }
        )
      };

      setConfirmedOrder(newOrder);
      setStep(3);
      onOrderSuccess(newOrder);

      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FACC15', '#F59E0B', '#FDE047', '#18181B', '#EAB308']
        });
      } catch {
        // Safe fallback
      }
    }, 1400);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setIsProcessing(false);
    setConfirmedOrder(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="checkout-modal-root" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 3 ? handleResetAndClose : onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-yellow-200 overflow-hidden z-10 max-h-[94vh] flex flex-col my-auto"
        >
          {/* Header & Steps Bar */}
          <div className="p-5 sm:p-6 border-b border-zinc-100 bg-amber-50/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider">
                  Seamless Checkout
                </span>
                <span className="bg-amber-200 text-zinc-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Demo Prototype
                </span>
              </div>
              <h3 className="font-extrabold text-zinc-900 text-xl font-['Outfit',sans-serif] mt-0.5">
                {step === 1 && '1. Shipping & Contact Details'}
                {step === 2 && '2. Choose Demo Payment Method'}
                {step === 3 && '3. Order Placed Successfully! 🎉'}
              </h3>
            </div>

            <button
              onClick={step === 3 ? handleResetAndClose : onClose}
              className="p-2 rounded-full hover:bg-white text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          {step !== 3 && (
            <div className="px-6 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-center gap-4 text-xs font-bold">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-800' : 'text-zinc-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-200'}`}>
                  1
                </span>
                <span>Shipping</span>
              </div>
              <div className="w-8 h-0.5 bg-zinc-200" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-800' : 'text-zinc-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-200'}`}>
                  2
                </span>
                <span>Payment</span>
              </div>
            </div>
          )}

          {/* Modal Body */}
          <div className="overflow-y-auto p-5 sm:p-8 flex-1">
            {/* STEP 1: Shipping Details */}
            {step === 1 && (
              <form onSubmit={handleNextToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={shipping.fullName}
                        onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                        placeholder="Aditya Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                      placeholder="aditya.sharma@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shipping.street}
                      onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                      placeholder="House/Flat number, Street name"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={shipping.pincode}
                        onChange={(e) => setShipping({ ...shipping, pincode: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Delivery Speed */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-zinc-700 mb-2">Delivery Option</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setShipping({ ...shipping, deliverySpeed: 'standard' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          shipping.deliverySpeed === 'standard'
                            ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-400'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                          <span>Standard Shipping</span>
                          <span className="text-emerald-700">FREE</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">Delivery in 3-4 business days</p>
                      </div>

                      <div
                        onClick={() => setShipping({ ...shipping, deliverySpeed: 'express' })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          shipping.deliverySpeed === 'express'
                            ? 'border-amber-400 bg-amber-50/60 ring-1 ring-amber-400'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-zinc-900">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Express Air
                          </span>
                          <span className="text-amber-800">Priority</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">Delivery within 24-48 hours</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Side: Order Summary Sidebar */}
                <div className="lg:col-span-5 bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-4">
                  <h4 className="font-bold text-zinc-900 text-sm flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                    <span>Order Summary ({cartItems.length} items)</span>
                  </h4>

                  <div className="max-h-48 overflow-y-auto divide-y divide-zinc-200 pr-1">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.product.images[0]}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-zinc-200"
                          />
                          <div>
                            <p className="font-semibold text-zinc-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-[11px] text-zinc-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-zinc-900">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-200 space-y-2 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-amber-700 font-bold">
                        <span>Coupon Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-emerald-600">
                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between text-base font-extrabold text-zinc-900">
                      <span>Total Amount</span>
                      <span className="font-black text-zinc-900 font-['Outfit',sans-serif]">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: Demo Payment */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Payment Methods Selection */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'bg-white text-zinc-950 shadow-sm border border-yellow-300'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-amber-500" />
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-white text-zinc-950 shadow-sm border border-yellow-300'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      <span>Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-white text-zinc-950 shadow-sm border border-yellow-300'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-amber-500" />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>

                  {/* UPI Method UI */}
                  {paymentMethod === 'upi' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border border-yellow-200 bg-amber-50/40 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Simulated QR Code */}
                        <div className="p-3 bg-white rounded-2xl border border-zinc-200 shadow-sm text-center shrink-0">
                          <div className="w-32 h-32 bg-zinc-900 rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                            {/* Realistic QR pattern effect */}
                            <div className="w-full h-full border-2 border-dashed border-amber-300 rounded flex flex-col items-center justify-center p-2 text-center">
                              <QrCode className="w-16 h-16 text-amber-400" />
                              <span className="text-[9px] font-mono text-amber-200 mt-1">SCAN WITH ANY UPI APP</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-bold mt-1.5">GPay / PhonePe / Paytm</p>
                        </div>

                        <div className="flex-1 space-y-3 w-full">
                          <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1">
                              Or enter your UPI ID:
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="mobile@upi or name@okaxis"
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:border-amber-400 font-medium"
                              />
                              <span className="shrink-0 px-2.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Encrypted 256-bit instant sandbox authorization</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Card Method UI */}
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      {/* Virtual Card Preview */}
                      <div className="relative w-full aspect-16/9 max-w-sm mx-auto rounded-2xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-amber-950 text-white p-5 shadow-xl flex flex-col justify-between border border-amber-400/40">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold tracking-wider text-amber-400 font-['Outfit',sans-serif]">
                            SOLARA PLATINUM
                          </span>
                          <span className="text-xs font-mono bg-amber-400 text-zinc-950 px-2 py-0.5 rounded font-black">
                            DEMO
                          </span>
                        </div>

                        <div className="font-mono text-lg sm:text-xl tracking-widest text-amber-100">
                          {card.cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex justify-between items-end text-xs">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Card Holder</span>
                            <span className="font-semibold tracking-wide text-zinc-100 uppercase">
                              {card.cardHolder || 'YOUR NAME'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase tracking-wider block">Expires</span>
                            <span className="font-mono font-semibold text-zinc-100">{card.expiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={card.cardNumber}
                            onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                            placeholder="4242 4242 4242 4242"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Valid Thru</label>
                          <input
                            type="text"
                            value={card.expiry}
                            onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={card.cvv}
                            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                            placeholder="•••"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Cash on Delivery UI */}
                  {paymentMethod === 'cod' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border border-yellow-300 bg-amber-50/50 space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-zinc-950 font-bold">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-zinc-900 text-sm">Pay with Cash on Delivery</h5>
                          <p className="text-xs text-zinc-600">Pay conveniently via Cash or UPI upon door delivery.</p>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 pt-2 border-t border-yellow-200">
                        * Please keep exact change ready. A courier agent will contact you prior to delivery.
                      </p>
                    </motion.div>
                  )}

                  {/* Back and Pay Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="flex-1 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer disabled:opacity-75"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                          <span>Authorizing Demo Payment...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Pay ₹{total.toLocaleString('en-IN')} (Simulate)</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Side: Shipping & Order Recap */}
                <div className="lg:col-span-5 bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-4">
                  <div className="pb-3 border-b border-zinc-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-zinc-700">Delivering To:</span>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[11px] text-amber-700 font-bold hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="font-semibold text-zinc-900 text-xs">{shipping.fullName}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                      {shipping.street}, {shipping.city}, {shipping.state} - {shipping.pincode}
                    </p>
                    <p className="text-[11px] text-zinc-500">Ph: {shipping.phone}</p>
                  </div>

                  <div className="space-y-2 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Total Items</span>
                      <span className="font-semibold text-zinc-900">{cartItems.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-amber-700 font-bold">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span className="font-semibold text-emerald-600">
                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200 flex justify-between text-base font-extrabold text-zinc-900">
                      <span>Amount to Pay</span>
                      <span className="text-lg font-black font-['Outfit',sans-serif] text-zinc-900">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Order Confirmation & Receipt */}
            {step === 3 && confirmedOrder && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center space-y-6 py-4"
              >
                {/* Success Icon */}
                <div className="relative w-20 h-20 mx-auto">
                  <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-zinc-950 shadow-xl shadow-amber-400/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Order Confirmed
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 font-['Outfit',sans-serif] mt-1">
                    Thank you, {confirmedOrder.shippingAddress.fullName}!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-md mx-auto">
                    We have received your demo order. A confirmation SMS & email has been sent to{' '}
                    <strong className="text-zinc-900">{confirmedOrder.shippingAddress.email}</strong>.
                  </p>
                </div>

                {/* Tracking & Details Box */}
                <div className="bg-amber-50/60 rounded-2xl border border-yellow-200 p-5 text-left space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-yellow-200/80 text-xs">
                    <div>
                      <span className="text-zinc-500">Order ID: </span>
                      <strong className="font-mono font-bold text-zinc-900 text-sm">
                        #{confirmedOrder.orderId}
                      </strong>
                    </div>
                    <div>
                      <span className="text-zinc-500">Expected Delivery: </span>
                      <strong className="font-bold text-amber-900">
                        {confirmedOrder.estimatedDelivery}
                      </strong>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="pt-1">
                    <p className="text-xs font-bold text-zinc-700 mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Live Order Status:
                    </p>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-zinc-950 font-bold mx-auto flex items-center justify-center text-xs">
                          ✓
                        </div>
                        <p className="font-bold text-zinc-900">Placed</p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-amber-200 text-zinc-900 font-bold mx-auto flex items-center justify-center text-xs">
                          2
                        </div>
                        <p className="font-medium text-zinc-600">Packing</p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-500 font-bold mx-auto flex items-center justify-center text-xs">
                          3
                        </div>
                        <p className="font-medium text-zinc-400">Shipped</p>
                      </div>
                      <div className="space-y-1">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-500 font-bold mx-auto flex items-center justify-center text-xs">
                          4
                        </div>
                        <p className="font-medium text-zinc-400">Delivered</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary of Items */}
                  <div className="pt-2 border-t border-yellow-200/80">
                    <p className="text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-600" />
                      Package Contents ({confirmedOrder.items.length} items):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {confirmedOrder.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs"
                        >
                          <img
                            src={item.product.images[0]}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="font-medium text-zinc-800 line-clamp-1 max-w-[140px]">
                            {item.product.name}
                          </span>
                          <span className="text-zinc-500 font-bold">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Order Receipt</span>
                  </button>

                  <button
                    onClick={handleResetAndClose}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-xs shadow-md shadow-amber-400/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>Continue Shopping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
