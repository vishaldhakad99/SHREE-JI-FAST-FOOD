import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { UtensilsCrossed, Phone, MapPin, Clock, MessageCircle, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  const currentYear = new Date().getFullYear();
  const rawPhone = settings?.whatsappNumber || settings?.phoneNumber || '';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const whatsappUrl = cleanPhone.length >= 10
    ? `https://wa.me/${cleanPhone}`
    : `https://wa.me/`;

  return (
    <footer className="bg-deepbrown-950 text-cream-200 pt-16 pb-8 border-t-4 border-saffron-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-deepbrown-800">
          {/* Column 1: Brand & USP */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-xl text-white tracking-wide">
                  {settings?.restaurantName || 'SHREE JI FAST FOOD'}
                </h3>
                <p className="text-xs text-saffron-400 font-medium">
                  {settings?.tagline || 'Ghar Jaisa Swad, Har Din Kuch Khaas!'}
                </p>
              </div>
            </div>

            <p className="text-sm text-cream-300/80 leading-relaxed">
              Wholesome, freshly prepared home-style meals, Special Thalis, Puri Sabji, and our famous Aloo Parathas made fresh daily according to your taste and preference.
            </p>

            <div className="pt-2">
              <span className="inline-block bg-deepbrown-800/80 text-saffron-400 text-xs px-3 py-1.5 rounded-full border border-saffron-500/20 font-medium">
                100% Pure Vegetarian Kitchen
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-bold text-base tracking-wide border-b border-deepbrown-800 pb-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-cream-300 hover:text-saffron-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-cream-300 hover:text-saffron-400 transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link to="/todays-special" className="text-cream-300 hover:text-saffron-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                  Today's Special Menu
                </Link>
              </li>
              <li>
                <Link to="/specialities" className="text-cream-300 hover:text-saffron-400 transition-colors">
                  Famous Specialities
                </Link>
              </li>
              <li>
                <Link to="/custom-order" className="text-cream-300 hover:text-saffron-400 transition-colors">
                  Custom Meal Request
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream-300 hover:text-saffron-400 transition-colors">
                  About Our Restaurant
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream-300 hover:text-saffron-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Timings */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-bold text-base tracking-wide border-b border-deepbrown-800 pb-2">
              Contact & Hours
            </h4>
            <ul className="space-y-3 text-sm text-cream-300/90">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  {settings?.address || 'Address managed in Admin Settings'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-saffron-500 shrink-0" />
                <span className="text-xs">
                  {settings?.phoneNumber || 'Contact managed in Admin Settings'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:underline"
                >
                  WhatsApp: {settings?.whatsappNumber || 'Available'}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-warmamber-400 shrink-0 mt-0.5" />
                <span className="text-xs">
                  {settings?.openingHours || 'Daily: 8:00 AM - 10:00 PM'}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Service Availability */}
          <div className="space-y-4">
            <h4 className="text-white font-serif font-bold text-base tracking-wide border-b border-deepbrown-800 pb-2">
              Service Info
            </h4>
            <div className="space-y-3 text-xs text-cream-300/80">
              <div className="bg-deepbrown-900 p-3 rounded-lg border border-deepbrown-800">
                <span className="text-white font-semibold block mb-1">Takeaway & Pickup:</span>
                <span className={settings?.isPickupAvailable ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                  {settings?.isPickupAvailable ? '✓ Available Every Day' : 'Currently Unavailable'}
                </span>
              </div>

              <div className="bg-deepbrown-900 p-3 rounded-lg border border-deepbrown-800">
                <span className="text-white font-semibold block mb-1">Home Delivery:</span>
                <span className={settings?.isDeliveryAvailable ? 'text-emerald-400 font-medium' : 'text-amber-400'}>
                  {settings?.isDeliveryAvailable ? '✓ Delivery Available (Call to confirm)' : 'Pickup preferred / Inquire via WhatsApp'}
                </span>
              </div>

              <p className="text-[11px] text-cream-400 italic">
                * Daily fresh preparation. Please inform staff in advance for customized spice or dietary requests.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Admin Access */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p className="flex items-center gap-1 text-center sm:text-left">
            © {currentYear} {settings?.restaurantName || 'Shree Ji Fast Food'}. Freshness & Taste Guaranteed with
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-cream-300 hover:text-saffron-400 px-3 py-1.5 rounded bg-deepbrown-900 border border-deepbrown-800 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-saffron-500" />
              <span>Staff & Admin Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
