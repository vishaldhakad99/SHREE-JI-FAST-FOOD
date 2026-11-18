import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import {
  UtensilsCrossed,
  Heart,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  ChefHat,
  MessageCircle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  const rawPhone = settings?.whatsappNumber || settings?.phoneNumber || '';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');
  const whatsappUrl = cleanPhone.length >= 10
    ? `https://wa.me/${cleanPhone}`
    : `https://wa.me/`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3.5 py-1 rounded-full border border-saffron-200">
          Our Story & Philosophy
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-deepbrown-950">
          About {settings?.restaurantName || 'Shree Ji Fast Food'}
        </h1>
        <p className="text-base sm:text-lg text-saffron-700 font-serif italic">
          "{settings?.tagline || 'Ghar Jaisa Swad, Har Din Kuch Khaas!'}"
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-300 shadow-premium grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-deepbrown-900 leading-snug">
            Wholesome Food Cooked with Purity, Care, and Tradition
          </h2>

          <div className="text-sm sm:text-base text-deepbrown-muted leading-relaxed space-y-4">
            <p>
              {settings?.aboutText ||
                'Welcome to Shree Ji Fast Food! We are committed to serving freshly prepared, wholesome Indian meals every single day. From our renowned Aloo Parathas and comforting Puri Sabji to our complete Special Thalis, our kitchen prepares each dish with pure ingredients, authentic home-style flavors, and customized taste according to your preference.'}
            </p>
            <p>
              Our kitchen operates on the simple belief that everyone deserves good, honest food made fresh daily. Whether you are living away from home, working busy hours, or enjoying a meal with family, our dishes bring you the warmth and nourishment of true home-cooked meals.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <span>Explore Our Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-md hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-cream-100 aspect-[4/3] relative">
            <img
              src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=900&auto=format&fit=crop"
              alt="Authentic Indian Thali"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs font-semibold">
                Freshly prepared Special Thali & Parathas daily
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Kitchen Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-cream-50 p-8 rounded-3xl border border-cream-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-saffron-100 text-saffron-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-deepbrown-900">
            Freshness Over Everything
          </h3>
          <p className="text-xs sm:text-sm text-deepbrown-muted leading-relaxed">
            We do not prepare mass commercial batches that sit for days. Our vegetables are chopped fresh and our dough is hand-kneaded each morning and evening.
          </p>
        </div>

        <div className="bg-cream-50 p-8 rounded-3xl border border-cream-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-deepbrown-900">
            Customization Flexibility
          </h3>
          <p className="text-xs sm:text-sm text-deepbrown-muted leading-relaxed">
            Your health and palate matter. From less spice to zero oil or Jain-friendly preparation without onion-garlic, we tailor dishes to your request.
          </p>
        </div>

        <div className="bg-cream-50 p-8 rounded-3xl border border-cream-300 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-deepbrown-900">
            100% Pure Vegetarian
          </h3>
          <p className="text-xs sm:text-sm text-deepbrown-muted leading-relaxed">
            A dedicated pure vegetarian kitchen following authentic traditional recipes and uncompromising hygiene standards.
          </p>
        </div>
      </div>
    </div>
  );
};
