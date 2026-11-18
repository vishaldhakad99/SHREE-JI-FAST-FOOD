import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { DailyMenu } from '../types';
import { DailyMenuCard } from '../components/DailyMenuCard';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  Calendar,
  Sparkles,
  ChefHat,
  MessageCircle,
  Clock,
  ArrowRight,
  Info,
  RefreshCw,
} from 'lucide-react';

export const TodaysSpecialPage: React.FC = () => {
  const { settings } = useSettings();
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [hasMenu, setHasMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Format today's date nicely in Indian English (e.g. "Tuesday, 18 November 2026")
  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const fetchDailyMenu = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get('/daily-menu');
      if (res.data?.success && res.data?.hasMenu && res.data?.menu) {
        setDailyMenu(res.data.menu);
        setHasMenu(true);
      } else {
        setDailyMenu(null);
        setHasMenu(false);
      }
    } catch (err) {
      console.error('Error loading daily menu:', err);
      setHasMenu(false);
      setDailyMenu(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDailyMenu();
  }, []);

  const whatsappUrl = getWhatsAppUrl(
    'Hello Shree Ji Fast Food, please let me know what special items are prepared today!',
    settings?.whatsappNumber || settings?.phoneNumber
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Date Header & Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm">
          <Calendar className="w-4 h-4 text-warmamber-600" />
          <span>{todayFormatted}</span>
        </div>

        <h1 className="font-serif font-black text-4xl sm:text-5xl text-deepbrown-950">
          Today's Special Menu
        </h1>

        <p className="text-sm sm:text-base text-deepbrown-muted leading-relaxed">
          At Shree Ji Fast Food, we prepare different wholesome dishes every day! Below are the hot specials freshly made in our kitchen today.
        </p>

        <div className="flex justify-center pt-2">
          <button
            onClick={() => fetchDailyMenu(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 bg-white hover:bg-saffron-50 px-3 py-1.5 rounded-lg border border-saffron-200 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Menu'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center space-y-4 border border-cream-300 shadow-premium max-w-2xl mx-auto">
          <div className="w-10 h-10 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-deepbrown-800">
            Checking today's fresh kitchen preparations...
          </p>
        </div>
      ) : hasMenu && dailyMenu && dailyMenu.items.length > 0 ? (
        <div className="space-y-8">
          {/* Menu Title & Announcement Banner */}
          <div className="bg-gradient-to-r from-saffron-500 via-orange-500 to-amber-500 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-100">
              <Sparkles className="w-4 h-4 fill-amber-200 text-amber-200" />
              <span>Live Daily Special Board</span>
            </div>
            <h2 className="font-serif font-black text-2xl sm:text-3xl">
              {dailyMenu.title}
            </h2>
            {dailyMenu.specialAnnouncement && (
              <p className="text-sm sm:text-base text-white/95 font-medium bg-black/20 p-3.5 rounded-xl border border-white/20">
                📢 {dailyMenu.specialAnnouncement}
              </p>
            )}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dailyMenu.items.map((item, idx) => (
              <DailyMenuCard key={idx} item={item} />
            ))}
          </div>

          {/* Quick Inquiry Strip */}
          <div className="bg-cream-50 p-6 rounded-2xl border border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-saffron-600 shrink-0" />
              <p className="text-xs sm:text-sm text-deepbrown-800">
                Dishes are served fresh until sold out. We recommend inquiring early for lunch or dinner!
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Us Now</span>
            </a>
          </div>
        </div>
      ) : (
        /* Empty State as explicitly mandated by Prompt */
        <div className="bg-white rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto border border-amber-300/80 shadow-premium space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-warmamber-600 flex items-center justify-center mx-auto">
            <ChefHat className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif font-black text-2xl text-deepbrown-950">
              Today's menu will be updated soon. Please contact us for availability.
            </h3>
            <p className="text-xs sm:text-sm text-deepbrown-muted max-w-md mx-auto">
              Our kitchen team prepares the daily rotating menu every morning. Feel free to reach out directly to check what fresh sabjis, thalis, or specials are simmering right now!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Contact via WhatsApp</span>
            </a>

            <Link
              to="/custom-order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full shadow-md"
            >
              <span>Place Custom Food Inquiry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Trust & Transparency Note */}
      <div className="bg-white p-5 rounded-2xl border border-cream-300 max-w-3xl mx-auto flex items-start gap-3 text-xs text-deepbrown-muted">
        <Info className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
        <p>
          <strong>Authenticity Guaranteed:</strong> We never display fabricated daily menus. The items above reflect the live daily specials set directly by the restaurant kitchen for {todayFormatted}.
        </p>
      </div>
    </div>
  );
};
