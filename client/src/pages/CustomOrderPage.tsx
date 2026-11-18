import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { FoodItem } from '../types';
import {
  MessageCircle,
  Send,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Lock,
} from 'lucide-react';

export const CustomOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillFood = searchParams.get('food') || '';
  const prefillId = searchParams.get('id') || '';

  const { settings } = useSettings();
  const { customer, isAuthenticated, openAuthModal } = useCustomerAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Auto-fill from verified customer profile
  useEffect(() => {
    if (customer) {
      if (customer.name && customer.name !== 'Valued Customer') {
        setCustomerName(customer.name);
      }
      if (customer.phone) {
        setCustomerPhone(customer.phone);
      }
    }
  }, [customer]);
  const [selectedFoodName, setSelectedFoodName] = useState(prefillFood);
  const [selectedFoodId, setSelectedFoodId] = useState(prefillId);
  const [customDishName, setCustomDishName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Quick spice & preference tags
  const [selectedDietTags, setSelectedDietTags] = useState<string[]>([]);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch food catalog for the dropdown selector
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoadingItems(true);
        const res = await api.get('/food');
        if (res.data?.success && res.data?.items) {
          setFoodItems(res.data.items);
        }
      } catch (err) {
        console.error('Error loading food items for dropdown:', err);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchCatalog();
  }, []);

  const dietTagOptions = [
    'Mild Spice (Less Spicy)',
    'Medium Spice',
    'Extra Spicy',
    'No Onion / No Garlic (Jain)',
    'Extra Butter / Ghee',
    'Less Oil / Zero Ghee',
    'Extra Crispy Paratha',
    'Soft Phulka / Roti',
  ];

  const toggleDietTag = (tag: string) => {
    if (selectedDietTags.includes(tag)) {
      setSelectedDietTags(selectedDietTags.filter((t) => t !== tag));
    } else {
      setSelectedDietTags([...selectedDietTags, tag]);
    }
  };

  const handleFoodSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'custom') {
      setSelectedFoodName('custom');
      setSelectedFoodId('');
    } else {
      const found = foodItems.find((item) => item._id === val);
      if (found) {
        setSelectedFoodName(found.name);
        setSelectedFoodId(found._id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessResponse(null);

    // Gating: Require customer login before placing order
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    // Basic Validation
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanDigits = customerPhone.replace(/[^\d]/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    const finalItemName = selectedFoodName === 'custom' ? customDishName.trim() : selectedFoodName.trim();
    if (!finalItemName) {
      setErrorMessage('Please specify the food item or custom dish you would like to order.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide a delivery address or choose Self Pickup.');
      return;
    }

    // Combine diet tags into requirements
    const combinedRequirements = [
      selectedDietTags.length > 0 ? `Preferences: ${selectedDietTags.join(', ')}` : '',
      additionalRequirements.trim(),
    ]
      .filter(Boolean)
      .join('\n');

    try {
      setSubmitting(true);

      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        foodItemId: selectedFoodId || undefined,
        foodItemName: finalItemName,
        quantity: Number(quantity),
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress.trim() : undefined,
        additionalRequirements: combinedRequirements,
        source: 'website_form',
      };

      const res = await api.post('/orders', payload);

      if (res.data?.success) {
        localStorage.setItem('shreeji_last_order_phone', customerPhone.trim());
        setSuccessResponse(res.data);
      } else {
        setErrorMessage(res.data?.message || 'Failed to submit order enquiry.');
      }
    } catch (err: any) {
      console.error('Error submitting order enquiry:', err);
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'An error occurred while submitting your order.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3.5 py-1 rounded-full border border-saffron-200">
          Tailored To Your Taste
        </span>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-deepbrown-950">
          Request Custom Food Order
        </h1>
        <p className="text-xs sm:text-sm text-deepbrown-muted leading-relaxed">
          Tell us exactly what you want and how you prefer it cooked! We will review kitchen availability and confirm your order promptly.
        </p>
      </div>

      {/* Mandatory Order Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 p-4 sm:p-5 rounded-2xl flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-deepbrown-900 leading-relaxed">
          <strong className="text-amber-900 block font-bold mb-0.5">Notice Regarding Order Inquiries:</strong>
          This form generates an order inquiry for the kitchen. Because our meals are prepared fresh and daily specials change, <strong>the restaurant will verify availability and confirm your order before preparation begins.</strong>
        </div>
      </div>

      {/* Success View with Direct WhatsApp Link */}
      {successResponse ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-400 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-950">
              Inquiry Sent Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-deepbrown-muted max-w-md mx-auto">
              We have recorded your custom food request. For the quickest turnaround, you can also send this inquiry directly to our kitchen staff on WhatsApp below!
            </p>
          </div>

          <div className="bg-cream-100 p-4 rounded-xl text-left text-xs text-deepbrown-800 max-w-lg mx-auto space-y-1.5 border border-cream-300">
            <div><strong>Customer:</strong> {successResponse.order?.customerName}</div>
            <div><strong>Requested Item:</strong> {successResponse.order?.foodItemName} (Qty: {successResponse.order?.quantity})</div>
            <div><strong>Service:</strong> {successResponse.order?.deliveryType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}</div>
            <div><strong>Status:</strong> <span className="text-amber-700 font-bold uppercase">Pending Confirmation</span></div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={successResponse.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Send To Restaurant WhatsApp</span>
            </a>

            <button
              onClick={() => {
                setSuccessResponse(null);
                setCustomerName('');
                setCustomerPhone('');
                setCustomDishName('');
                setAdditionalRequirements('');
                setSelectedDietTags([]);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold text-deepbrown-800 bg-cream-200 hover:bg-cream-300 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        /* The Order Inquiry Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-premium space-y-8"
        >
          {/* Customer Auth Banner */}
          {!isAuthenticated ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-deepbrown-900">
                    Order karne ke liye pehle Login karein
                  </h4>
                  <p className="text-xs text-stone-600">
                    Mobile Number ya Gmail OTP se 10 second me login karein
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="w-full sm:w-auto px-4 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap"
              >
                Login / Send OTP
              </button>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Verified Customer: <strong>{customer?.name || 'Customer'}</strong> ({customer?.phone ? `+91 ${customer.phone}` : customer?.email})
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
                Active Session
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl text-xs sm:text-sm">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-saffron-600 text-white text-xs flex items-center justify-center">1</span>
              <span>Your Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Mobile Number (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Food Selection */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-saffron-600 text-white text-xs flex items-center justify-center">2</span>
              <span>Select Dish or Custom Meal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Choose Item from Menu or Request Custom <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedFoodId || (selectedFoodName === 'custom' ? 'custom' : '')}
                  onChange={handleFoodSelect}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                >
                  <option value="">-- Select from our menu --</option>
                  {foodItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} (₹{item.price})
                    </option>
                  ))}
                  <option value="custom">★ Request Custom Dish / Not Listed Above</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>
            </div>

            {/* If custom dish selected */}
            {(selectedFoodName === 'custom' || (!selectedFoodId && selectedFoodName)) && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <label className="block text-xs font-bold text-amber-900">
                  Custom Dish Name / Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kadhi Khichdi, Sev Tameta Sabji, Methi Thepla, etc."
                  value={customDishName || selectedFoodName}
                  onChange={(e) => {
                    setCustomDishName(e.target.value);
                    setSelectedFoodName(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-amber-300 bg-white text-sm text-deepbrown-900 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Section 3: Customization & Dietary Requirements */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-saffron-600 text-white text-xs flex items-center justify-center">3</span>
              <span>Preparation Preferences & Taste</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-deepbrown-800 mb-2">
                Quick Dietary / Cooking Preferences (Click to select)
              </label>
              <div className="flex flex-wrap gap-2">
                {dietTagOptions.map((tag) => {
                  const isSelected = selectedDietTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleDietTag(tag)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-saffron-600 text-white border-saffron-700 shadow-sm'
                          : 'bg-cream-100 text-deepbrown-800 border-cream-300 hover:bg-cream-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                Additional Instructions / Specific Requirements
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Please pack the curd separately, keep the sabji extra spicy, need 2 extra butter rotis, etc."
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
              />
            </div>
          </div>

          {/* Section 4: Pickup or Delivery */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-deepbrown-900 border-b border-cream-200 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-saffron-600 text-white text-xs flex items-center justify-center">4</span>
              <span>Service Type</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-saffron-600 bg-saffron-50/50 text-saffron-900'
                    : 'border-cream-300 bg-white text-deepbrown-800 hover:bg-cream-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryType"
                    checked={deliveryType === 'pickup'}
                    onChange={() => setDeliveryType('pickup')}
                    className="accent-saffron-600"
                  />
                  <div>
                    <span className="font-bold text-sm block">Self Pickup / Takeaway</span>
                    <span className="text-xs text-deepbrown-muted">Collect hot from the restaurant</span>
                  </div>
                </div>
                <ShoppingBag className="w-5 h-5 text-saffron-600" />
              </label>

              <label
                className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-saffron-600 bg-saffron-50/50 text-saffron-900'
                    : 'border-cream-300 bg-white text-deepbrown-800 hover:bg-cream-50'
                } ${!settings?.isDeliveryAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryType"
                    disabled={!settings?.isDeliveryAvailable}
                    checked={deliveryType === 'delivery'}
                    onChange={() => setDeliveryType('delivery')}
                    className="accent-saffron-600"
                  />
                  <div>
                    <span className="font-bold text-sm block">Home Delivery</span>
                    <span className="text-xs text-deepbrown-muted">
                      {settings?.isDeliveryAvailable
                        ? 'Subject to location and delivery rider availability'
                        : 'Currently unavailable (Restaurant supports Pickup)'}
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-deepbrown-800 mb-1.5">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No., Building/Society, Street, Area, Landmark"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 text-sm text-deepbrown-900 focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-deepbrown-muted flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No online payment required now. Order confirmed directly by restaurant.</span>
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-4 rounded-full text-sm font-bold shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
            >
              {!isAuthenticated ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>
                {submitting
                  ? 'Submitting Request...'
                  : !isAuthenticated
                  ? 'Login to Send Order'
                  : 'Send Order Inquiry'}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
