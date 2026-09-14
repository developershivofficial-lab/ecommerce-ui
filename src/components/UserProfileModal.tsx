import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  LogOut,
  Edit2,
  Check,
  Home,
  Briefcase,
  Building,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserDeliveryAddress } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToOrders?: () => void;
  onSuccessToast?: (title: string, message: string) => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Delhi NCR', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu & Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onGoToOrders,
  onSuccessToast
}) => {
  const { currentUser, logoutUser, updateDeliveryAddress } = useAuth();
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Address edit fields
  const [street, setStreet] = useState(currentUser?.deliveryAddress?.street || '');
  const [landmark, setLandmark] = useState(currentUser?.deliveryAddress?.landmark || '');
  const [city, setCity] = useState(currentUser?.deliveryAddress?.city || '');
  const [stateName, setStateName] = useState(currentUser?.deliveryAddress?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(currentUser?.deliveryAddress?.pincode || '');
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>(
    currentUser?.deliveryAddress?.addressType || 'Home'
  );

  if (!isOpen || !currentUser) return null;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddress: UserDeliveryAddress = {
      street: street.trim(),
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: stateName,
      pincode: pincode.trim(),
      addressType
    };
    updateDeliveryAddress(newAddress);
    setIsEditingAddress(false);
    if (onSuccessToast) {
      onSuccessToast('Address Updated', 'Your delivery address has been saved.');
    }
  };

  const initials = `${currentUser.firstName[0] || ''}${currentUser.lastName[0] || ''}`.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative w-full max-w-md bg-white rounded-3xl border border-yellow-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
      >
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-6 text-zinc-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-950/10 hover:bg-zinc-950/20 text-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center text-xl font-black shadow-md border-2 border-white/60">
              {initials || <User className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-lg font-black font-['Outfit',sans-serif] leading-tight">
                {currentUser.firstName} {currentUser.lastName}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-semibold mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 fill-emerald-300" />
                <span>Verified Gopal Bags Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Account Details */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
              Contact Details
            </h4>
            <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Email:</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                  <span>{currentUser.email}</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                    Brevo Verified
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-600">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Mobile:</span>
                </div>
                <span className="font-bold text-zinc-900">+91 {currentUser.mobile}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                Primary Delivery Address
              </h4>
              {!isEditingAddress && (
                <button
                  onClick={() => setIsEditingAddress(true)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Address</span>
                </button>
              )}
            </div>

            {!isEditingAddress ? (
              <div className="bg-amber-50/40 rounded-2xl p-3.5 border border-yellow-200/80 space-y-1.5 text-xs">
                {currentUser.deliveryAddress ? (
                  <>
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                      {currentUser.deliveryAddress.addressType === 'Home' && <Home className="w-3.5 h-3.5" />}
                      {currentUser.deliveryAddress.addressType === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                      {currentUser.deliveryAddress.addressType === 'Other' && <Building className="w-3.5 h-3.5" />}
                      <span>{currentUser.deliveryAddress.addressType} Address</span>
                    </div>
                    <p className="text-zinc-800 font-medium leading-relaxed">
                      {currentUser.deliveryAddress.street}
                      {currentUser.deliveryAddress.landmark ? `, Near ${currentUser.deliveryAddress.landmark}` : ''}
                    </p>
                    <p className="text-zinc-600">
                      {currentUser.deliveryAddress.city}, {currentUser.deliveryAddress.state} -{' '}
                      <span className="font-bold text-zinc-900">{currentUser.deliveryAddress.pincode}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-zinc-500 italic">No delivery address saved yet.</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSaveAddress} className="space-y-2.5 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
                <input
                  type="text"
                  required
                  placeholder="Street / House No."
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs"
                  />
                </div>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onClose();
                logoutUser();
                if (onSuccessToast) {
                  onSuccessToast('Signed Out', 'You have been logged out of Gopal Bags.');
                }
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
