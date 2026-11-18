import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodItem } from '../types';
import { Sparkles, Clock, Flame, MessageCircle, ArrowRight, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface FoodCardProps {
  item: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { settings } = useSettings();
  const { isAuthenticated, openAuthModal } = useCustomerAuth();
  const navigate = useNavigate();

  const whatsappUrl = getWhatsAppUrl(
    `Hello Shree Ji Fast Food! I would like to order / inquire about: *${item.name}* (Price: ₹${item.price}). Is it currently ready?`,
    settings?.whatsappNumber || settings?.phoneNumber
  );

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between ${
        !item.isAvailable ? 'opacity-70 bg-cream-50' : ''
      }`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative h-52 sm:h-56 overflow-hidden bg-cream-200">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop'}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Left Indicators: Pure Veg Badge & Category */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {/* Indian Green Veg Icon */}
            <div className="bg-white/95 backdrop-blur-sm p-1 rounded border border-gray-200 shadow-sm" title="100% Pure Vegetarian">
              <div className="w-3.5 h-3.5 border-2 border-emerald-600 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>
            </div>

            {item.isSpecial && (
              <span className="inline-flex items-center gap-1 bg-amber-500/95 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                <Sparkles className="w-3 h-3 fill-current" />
                Special
              </span>
            )}
          </div>

          {/* Top Right: Today's Special or Availability Badge */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            {item.isTodaysSpecial && (
              <span className="bg-saffron-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                Today's Special
              </span>
            )}

            {!item.isAvailable && (
              <span className="bg-gray-800 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                Currently Out of Stock
              </span>
            )}
          </div>

          {/* Bottom Overlay Price Tag */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
              <span className="text-xs text-amber-300 font-medium">Price: </span>
              <span className="text-lg font-black tracking-tight text-white">₹{item.price}</span>
            </div>

            {item.preparationTimeMinutes && (
              <div className="flex items-center gap-1 text-[11px] bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>~{item.preparationTimeMinutes} mins</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-serif font-bold text-lg text-deepbrown-900 group-hover:text-saffron-700 transition-colors line-clamp-1">
              {item.name}
            </h3>

            {item.spiceLevel && (
              <span className="shrink-0 flex items-center gap-0.5 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200" title={`Spice Level: ${item.spiceLevel}`}>
                <Flame className="w-3 h-3 text-saffron-600 fill-saffron-500" />
                <span className="text-[10px] font-semibold">{item.spiceLevel}</span>
              </span>
            )}
          </div>

          <p className="text-xs text-deepbrown-muted leading-relaxed line-clamp-3 mb-4">
            {item.description}
          </p>

          {/* Customization Options Preview */}
          {item.customizationOptions && item.customizationOptions.length > 0 && (
            <div className="mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 block mb-1.5">
                Customizable to your taste:
              </span>
              <div className="flex flex-wrap gap-1">
                {item.customizationOptions.slice(0, 3).map((opt, i) => (
                  <span
                    key={i}
                    className="inline-block text-[10px] bg-cream-200 text-deepbrown-800 px-2 py-0.5 rounded-full"
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="p-5 pt-0 border-t border-cream-200/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal(() => {
                navigate(`/custom-order?food=${encodeURIComponent(item.name)}&id=${item._id}`);
              });
            } else {
              navigate(`/custom-order?food=${encodeURIComponent(item.name)}&id=${item._id}`);
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-saffron-50 hover:bg-saffron-100 text-saffron-700 hover:text-saffron-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-saffron-200 transition-colors"
        >
          {!isAuthenticated && <Lock className="w-3 h-3 text-saffron-500" />}
          <span>{isAuthenticated ? 'Customize' : 'Order / Customize'}</span>
          <ArrowRight className="w-3 h-3" />
        </button>

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
          className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition-colors"
          title={isAuthenticated ? 'Order on WhatsApp' : 'Login to Order on WhatsApp'}
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
