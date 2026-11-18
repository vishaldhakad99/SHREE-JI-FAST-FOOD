import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import {
  Sparkles,
  CheckCircle2,
  ChefHat,
  MessageCircle,
  ArrowRight,
  Flame,
  Heart,
} from 'lucide-react';

export const SpecialitiesPage: React.FC = () => {
  const { settings } = useSettings();
  const { isAuthenticated, openAuthModal } = useCustomerAuth();

  const rawPhone = settings?.whatsappNumber || settings?.phoneNumber || '';
  const cleanPhone = rawPhone.replace(/[^\d]/g, '');

  const specialities = [
    {
      id: 'aloo-paratha',
      title: 'Famous Aloo Paratha',
      subtitle: 'The King of Parathas – Stuffed Generously, Roasted with Desi Touch',
      description:
        'Our crown jewel and most talked-about dish! We take fresh boiled potatoes, seasoned with crushed roasted cumin, carom seeds (ajwain), fresh green coriander, and our secret home spice blend. Stuffed inside a freshly kneaded whole wheat dough and cooked on tawa till perfectly golden and crisp.',
      accompaniments: 'Served piping hot with chilled thick curd, handmade spicy mango/lemon pickle, and a dollop of pure butter.',
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=900&auto=format&fit=crop',
      features: ['Crispy tawa cooked', 'Extra butter option available', 'Jain/No onion-garlic option', 'Pure whole wheat dough'],
      badge: 'Most Popular',
    },
    {
      id: 'special-thali',
      title: 'Special Royal Thali',
      subtitle: 'A Wholesome, Satisfying Indian Feast in Every Bite',
      description:
        'A comprehensive meal plate designed to satisfy every culinary craving. Features two distinct vegetable gravies (including our paneer special of the day and a seasonal dry sabji), fragrant Dal Tadka, steamed basmati rice, 4 hot whole-wheat phulkas (or crisp puris), fresh crunchy salad, raita, and sweet of the day.',
      accompaniments: 'Served with fresh mint chutney, roasted papad, and authentic pickle.',
      image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=900&auto=format&fit=crop',
      features: ['Complete nutritional balance', 'Choice between soft rotis or puris', 'Zero artificial colors', 'Freshly cooked twice daily'],
      badge: 'Chef Special',
    },
    {
      id: 'puri-sabji',
      title: 'Fresh Puri Sabji',
      subtitle: 'Crisp Golden Puris Paired with Aromatic Spiced Aloo Bhaji',
      description:
        'A nostalgic Indian breakfast and all-day comfort favorite! Four freshly rolled, fluffy, deep-golden puris served alongside traditional Tariwale Aloo (slow-simmered potato curry seasoned with mustard seeds, curry leaves, and ginger) or spicy chole.',
      accompaniments: 'Accompanied by spicy pickled chilies and sliced red onions with lemon.',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=900&auto=format&fit=crop',
      features: ['Fried in fresh, clean oil', 'No excessive heavy spices', 'Fluffy and non-greasy puris', 'Traditional home taste'],
      badge: 'Classic Favorite',
    },
    {
      id: 'daily-meals',
      title: 'Daily Homemade-Style Meals',
      subtitle: 'Light, Wholesome "Ghar Jaisa" Meals Prepared Twice Every Day',
      description:
        'Ideal for office goers, students, and families looking for everyday healthy food. Prepared just like mother cooks at home—light yellow dal, seasonal green vegetable sabji, soft puffed phulkas, and fragrant rice. Free from heavy commercial restaurant soda and excess grease.',
      accompaniments: 'Served with homemade pickle and fresh seasonal salad.',
      image: 'https://images.unsplash.com/photo-1505253758473-96b301b5c81d?q=80&w=900&auto=format&fit=crop',
      features: ['Daily rotating vegetable menu', 'Gentle on stomach', 'No soda or preservative agents', 'Available for lunch & dinner'],
      badge: 'Everyday Wholesome',
    },
    {
      id: 'custom-food',
      title: 'Customized Food Orders',
      subtitle: 'Your Plate, Your Taste – Prepared According to Your Exact Preference',
      description:
        'The biggest USP of Shree Ji Fast Food! We know that everyone has unique tastebuds. Want your paratha extra spicy with green chilies? Need food prepared strictly without onion and garlic? Prefer rotis with zero oil? Looking for a specific vegetable cooked for your lunch box? Tell us and we will prepare it specially for you!',
      accompaniments: 'Customized packaging for takeaway or desk lunch.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=900&auto=format&fit=crop',
      features: ['Personalized spice calibration', 'Dietary flexibility', 'Fresh pan-to-plate preparation', 'Direct coordination with kitchen'],
      badge: 'Unique USP',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3.5 py-1 rounded-full border border-saffron-200">
          Pure Vegetarian Heritage
        </span>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-deepbrown-950">
          Our Renowned Specialities
        </h1>
        <p className="text-sm sm:text-base text-deepbrown-muted leading-relaxed">
          Crafted with love, authentic spices, and daily fresh ingredients. Discover what makes Shree Ji Fast Food the beloved choice for home-style Indian cuisine.
        </p>
      </div>

      {/* Specialities List */}
      <div className="space-y-16">
        {specialities.map((item, index) => {
          const isReversed = index % 2 !== 0;
          const itemWhatsappUrl = cleanPhone.length >= 10
            ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello Shree Ji Fast Food, I would like to inquire about ordering your speciality: *${item.title}*.`)}`
            : `https://wa.me/?text=${encodeURIComponent(`Hello Shree Ji Fast Food, I would like to inquire about ordering your speciality: *${item.title}*.`)}`;

          return (
            <div
              key={item.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-10 rounded-3xl border border-cream-300 shadow-premium ${
                isReversed ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div className={`lg:col-span-5 relative ${isReversed ? 'lg:order-2' : ''}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md border-2 border-cream-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-saffron-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {item.badge}
                  </div>
                </div>
              </div>

              {/* Text Side */}
              <div className={`lg:col-span-7 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                <div>
                  <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider block mb-1">
                    Signature Dish
                  </span>
                  <h2 className="font-serif font-black text-2xl sm:text-3xl text-deepbrown-900">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-deepbrown-muted mt-1 italic">
                    {item.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-deepbrown-muted leading-relaxed">
                  {item.description}
                </p>

                <div className="bg-cream-100 p-3.5 rounded-xl border border-cream-200/80 text-xs text-deepbrown-800">
                  <span className="font-bold text-saffron-800 block mb-0.5">Accompaniments:</span>
                  {item.accompaniments}
                </div>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {item.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs text-deepbrown-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    to={`/custom-order?food=${encodeURIComponent(item.title)}`}
                    className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-full transition-colors shadow-sm"
                  >
                    <span>Request This Dish</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={itemWhatsappUrl}
                    onClick={(e) => {
                      if (!isAuthenticated) {
                        e.preventDefault();
                        openAuthModal(() => {
                          window.open(itemWhatsappUrl, '_blank');
                        });
                      }
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-full transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
