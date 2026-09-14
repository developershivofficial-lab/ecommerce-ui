import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Printer,
  ShoppingBag,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { OrderDetails } from '../types';

interface OrderConfirmationPageProps {
  lastOrder?: OrderDetails | null;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ lastOrder }) => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const order: OrderDetails = location.state?.order || lastOrder || {
    orderId: orderId || 'GB-892410',
    items: [],
    shippingAddress: {
      fullName: 'Pooja Sharma',
      email: 'pooja.sharma@example.com',
      phone: '9876543210',
      street: 'Flat 402, Golden Heritage Enclave, MG Road',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      deliverySpeed: 'express'
    },
    paymentMethod: 'upi',
    subtotal: 3199,
    discount: 640,
    shippingFee: 0,
    tax: 0,
    total: 2559,
    createdAt: new Date().toISOString(),
    estimatedDelivery: 'Wednesday, 17 Sep'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success Badge Banner */}
      <div className="bg-white rounded-3xl border border-yellow-200/90 p-8 sm:p-12 shadow-sm text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>OFFICIAL GOPAL BAGS ORDER</span>
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-['Outfit',sans-serif]">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-sm text-zinc-600 mt-2 max-w-lg mx-auto">
          We have received your order. Our master artisans are preparing your luxury bag for express dispatch.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-zinc-700 bg-amber-50/70 py-2.5 px-5 rounded-2xl border border-yellow-200">
          <span>Order Number: <strong className="text-zinc-950 font-black font-mono">#{order.orderId}</strong></span>
          <span>•</span>
          <span>Estimated Delivery: <strong className="text-amber-700 font-bold">{order.estimatedDelivery}</strong></span>
          <span>•</span>
          <span className="text-emerald-700 font-bold">Payment Verified</span>
        </div>
      </div>

      {/* Live 4-Stage Courier Shipment Tracker */}
      <div className="bg-white rounded-3xl border border-yellow-100 p-6 sm:p-8 shadow-xs mb-8">
        <h3 className="text-base font-bold text-zinc-900 font-['Outfit',sans-serif] mb-6 flex items-center gap-2">
          <Truck className="w-4 h-4 text-amber-500" />
          <span>Real-Time Shipment Progress</span>
        </h3>

        <div className="grid grid-cols-4 gap-2 relative">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm font-bold text-xs">
              ✓
            </div>
            <div className="text-xs font-bold text-zinc-900">Order Placed</div>
            <div className="text-[10px] text-zinc-400">Received</div>
          </div>

          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center mx-auto mb-2 shadow-sm font-bold text-xs animate-pulse">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-zinc-900">Quality Check</div>
            <div className="text-[10px] text-amber-600 font-semibold">In Progress</div>
          </div>

          <div className="text-center opacity-60">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-2 text-xs">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-zinc-600">Dispatched</div>
            <div className="text-[10px] text-zinc-400">BlueDart Air</div>
          </div>

          <div className="text-center opacity-60">
            <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-2 text-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-zinc-600">Delivered</div>
            <div className="text-[10px] text-zinc-400">Doorstep</div>
          </div>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl border border-yellow-100 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-yellow-100">
          <h2 className="text-lg font-bold text-zinc-900 font-['Outfit',sans-serif]">
            Order Receipt & Invoice Summary
          </h2>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-amber-50 hover:border-amber-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-zinc-600" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 mb-6 border-b border-yellow-100 text-xs">
          <div>
            <div className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
              Delivery Address
            </div>
            <div className="font-bold text-zinc-900 text-sm">{order.shippingAddress.fullName}</div>
            <div className="text-zinc-600 mt-1">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </div>
            <div className="text-zinc-500 mt-1">Phone: {order.shippingAddress.phone}</div>
          </div>

          <div>
            <div className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] mb-1">
              Payment Method
            </div>
            <div className="font-bold text-zinc-900 uppercase">
              {order.paymentMethod === 'upi' ? 'UPI / QR Code (Simulated)' : order.paymentMethod === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery'}
            </div>
            <div className="text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Transaction Status: Authorized
            </div>
            <div className="text-zinc-500 mt-1">Gopal Bags Official Warranty: 1-Year Included</div>
          </div>
        </div>

        {/* Ordered Items Table */}
        {order.items && order.items.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
              Purchased Handbags
            </div>
            {order.items.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor}`} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50/70 border border-zinc-100">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                  />
                  <div>
                    <span className="font-bold text-zinc-900 text-xs">{item.product.name}</span>
                    <p className="text-[11px] text-zinc-500">Qty: {item.quantity} {item.selectedColor && `• ${item.selectedColor}`}</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-zinc-900">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        <div className="pt-4 border-t border-yellow-100 space-y-2 text-xs text-zinc-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-zinc-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-semibold">
              <span>Discount</span>
              <span>- ₹{order.discount.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Courier Delivery</span>
            <span className="font-bold text-emerald-600">
              {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
            </span>
          </div>
          <div className="pt-3 border-t border-yellow-100 flex justify-between items-baseline">
            <span className="font-extrabold text-sm text-zinc-900">Total Paid</span>
            <span className="text-xl font-black text-zinc-950 font-['Outfit',sans-serif]">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-extrabold text-sm shadow-md shadow-amber-400/25 transition-all hover:scale-105"
        >
          <span>Continue Shopping Gopal Bags</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
