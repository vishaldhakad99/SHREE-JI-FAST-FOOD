import React from 'react';
import { DailyMenuItem } from '../types';
import { Sparkles, MessageCircle, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';

interface DailyMenuCardProps {
  item: DailyMenuItem;
}

export const DailyMenuCard: React.FC<DailyMenuCardProps> = ({ item }) => {
  const { settings } = useSettings();
  const { isAuthenticated, openAuthModal } = useCustomerAuth();

  const rawPhone = settings?.whatsappNumber || settings?.phoneNumber || '';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello Shree Ji Fast Food! I would like to order from Today's Special Menu: *${item.name}* (Price: ₹${item.price}). Please let me know how soon it will be ready!`
  );

  const whatsappUrl = cleanPhone.length >= 10
    ? `https://wa.me/${cleanPhone}?text=${whatsappMessage}`
    : `https://wa.me/?text=${whatsappMessage}`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      {/* Decorative Warm Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-saffron-500 to-warmamber-500" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            {/* Pure Veg Square Icon */}
            <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center p-0.5" title="Pure Veg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded">
              {item.category || 'Today Special'}
            </span>
          </div>

          {item.isSpecial && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-500" />
              Special Dish
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h4 className="font-serif font-bold text-lg text-deepbrown-900 group-hover:text-saffron-700 transition-colors">
            {item.name}
          </h4>
          <span className="text-lg font-black text-saffron-700 shrink-0">
            ₹{item.price}
          </span>
        </div>

        {item.description && (
          <p className="text-xs text-deepbrown-muted leading-relaxed mb-4">
            {item.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-cream-200 flex items-center justify-between gap-3">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
          item.isAvailable ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 bg-gray-100'
        }`}>
          {item.isAvailable ? 'Freshly Available Today' : 'Finished for today'}
        </span>

        {item.isAvailable && (
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal(() => {
                  window.open(whatsappUrl, '_blank');
                });
              } else {
                window.open(whatsappUrl, '_blank');
              }
            }}
            className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            {!isAuthenticated ? <Lock className="w-3 h-3 text-white/80" /> : <MessageCircle className="w-3.5 h-3.5 fill-current" />}
            <span>Order</span>
          </button>
        )}
      </div>
    </div>
  );
};
