import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FoodItem, DailyMenu } from '../types';
import { useSettings } from '../context/SettingsContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { FoodCard } from '../components/FoodCard';
import { DailyMenuCard } from '../components/DailyMenuCard';
import {
  Sparkles,
  Utensils,
  HeartHandshake,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
  Flame,
  ChefHat,
  ShieldCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const { isAuthenticated, openAuthModal } = useCustomerAuth();
  const [featuredItems, setFeaturedItems] = useState<FoodItem[]>([]);
  const [dailyMenu, setDailyMenu] = useState<DailyMenu | null>(null);
  const [hasDailyMenu, setHasDailyMenu] = useState(false);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    // 1. Fetch Today's Daily Menu
    const fetchDailyMenu = async () => {
      try {
        setLoadingDaily(true);
        const res = await api.get('/daily-menu');
        if (res.data?.success && res.data?.hasMenu && res.data?.menu) {
          setDailyMenu(res.data.menu);
          setHasDailyMenu(true);
        } else {
          setHasDailyMenu(false);
        }
      } catch (err) {
        console.error('Error fetching today menu:', err);
        setHasDailyMenu(false);
      } finally {
        setLoadingDaily(false);
      }
    };

    // 2. Fetch Featured Food Items
    const fetchFeatured = async () => {
      try {
        setLoadingFeatured(true);
        const res = await api.get('/food?featuredOnly=true');
        if (res.data?.success && res.data?.items) {
          setFeaturedItems(res.data.items);
        }
      } catch (err) {
        console.error('Error fetching featured food items:', err);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchDailyMenu();
    fetchFeatured();
  }, []);

  const whatsappUrl = getWhatsAppUrl(
    'Hello Shree Ji Fast Food, I would like to order fresh food.',
    settings?.whatsappNumber || settings?.phoneNumber
  );

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal(() => {
        window.open(whatsappUrl, '_blank');
      });
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-50 via-cream-100 to-cream-200 pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-cream-300">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-saffron-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-warmamber-400/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Brand & Taglines */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-saffron-50 border border-saffron-200 px-4 py-1.5 rounded-full text-saffron-700 text-xs sm:text-sm font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-warmamber-500 fill-warmamber-400 animate-spin" />
                <span>100% Pure Vegetarian & Daily Fresh Meals</span>
              </div>

              <h1 className="font-serif font-black text-4xl sm:text-5xl xl:text-6xl text-deepbrown-950 tracking-tight leading-[1.15]">
                {settings?.restaurantName || 'SHREE JI FAST FOOD'}
                <span className="block text-2xl sm:text-3xl xl:text-4xl text-saffron-700 mt-2 font-serif font-extrabold italic">
                  "{settings?.tagline || 'Ghar Jaisa Swad, Har Din Kuch Khaas!'}"
                </span>
              </h1>

              <p className="text-base sm:text-lg text-deepbrown-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Freshly Prepared Meals, Special Thalis & Our Famous Aloo Parathas. Cooked fresh daily with pure ingredients and crafted according to your personalized spice and dietary preferences.
              </p>

              {/* Call to Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/menu"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-4 rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Utensils className="w-5 h-5" />
                  <span>Explore Our Menu</span>
                </Link>

                <a
                  href={whatsappUrl}
                  onClick={handleWhatsAppClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-4 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-cream-300/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-deepbrown-800">Prepared Fresh Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-deepbrown-800">Customized to Taste</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-deepbrown-800">Pure Veg Kitchen</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Indian Food Hero Imagery */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] sm:aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop"
                    alt="Famous Aloo Paratha Shree Ji Fast Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-lg border border-cream-200">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 block">
                          House Specialty
                        </span>
                        <h4 className="font-serif font-black text-sm sm:text-base text-deepbrown-900 truncate">
                          Famous Aloo Paratha
                        </h4>
                        <p className="text-[11px] sm:text-xs text-deepbrown-muted truncate">
                          Served hot with pure curd & homemade pickle
                        </p>
                      </div>
                      <Link
                        to="/menu"
                        className="p-2 sm:p-2.5 rounded-full bg-saffron-600 text-white hover:bg-saffron-700 transition-colors shrink-0"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Secondary Floating Badge - Safe Positioning without clipping */}
                <div className="hidden sm:flex absolute -top-4 -left-4 bg-amber-500 text-white p-3 rounded-2xl shadow-xl items-center gap-2.5 border-2 border-white">
                  <Flame className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider block">Signature</span>
                    <span className="text-xs font-black">Puri Sabji & Thali</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 1. OUR SPECIALITIES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3 py-1 rounded-full border border-saffron-200">
            What Makes Us Special
          </span>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-deepbrown-950">
            Our Signature Specialties
          </h2>
          <p className="text-sm sm:text-base text-deepbrown-muted">
            Prepared every single day using traditional homestyle methods and generous portions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            {
              title: 'Famous Aloo Paratha',
              desc: 'Crispy tawa-roasted golden flatbread packed with seasoned potato filling.',
              img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop',
              tag: 'Customer Favorite',
            },
            {
              title: 'Special Thali',
              desc: 'Wholesome royal meal with 2 sabjis, dal, rice, hot rotis/puris, and salad.',
              img: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=600&auto=format&fit=crop',
              tag: 'Complete Meal',
            },
            {
              title: 'Puri Sabji',
              desc: 'Steaming hot, fluffy puris served with spicy, flavorful tariwale aloo sabji.',
              img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=600&auto=format&fit=crop',
              tag: 'Daily Special',
            },
            {
              title: 'Daily Fresh Meals',
              desc: 'Light, healthy dal roti sabji cooked fresh twice a day with no soda.',
              img: 'https://images.unsplash.com/photo-1505253758473-96b301b5c81d?q=80&w=600&auto=format&fit=crop',
              tag: 'Ghar Jaisa',
            },
            {
              title: 'Customized Orders',
              desc: 'Prepared according to your preference—less spicy, extra butter, or specific veggies.',
              img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
              tag: 'Flexible Taste',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                  {item.tag}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-deepbrown-900 group-hover:text-saffron-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-deepbrown-muted leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>
                <Link
                  to="/specialities"
                  className="inline-flex items-center gap-1 text-xs font-bold text-saffron-700 hover:text-saffron-800 pt-2"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 2. TODAY'S SPECIAL MENU SECTION ================= */}
      <section className="bg-gradient-to-r from-amber-50 via-saffron-50/50 to-orange-50 py-16 border-y border-amber-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-saffron-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-warmamber-500 fill-warmamber-400" />
                <span>Cooked Fresh Every Morning & Evening</span>
              </div>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-deepbrown-950">
                Today's Special Dishes
              </h2>
              <p className="text-sm text-deepbrown-muted mt-1">
                The restaurant prepares different authentic dishes every day. Check today's fresh menu below!
              </p>
            </div>

            <Link
              to="/todays-special"
              className="inline-flex items-center gap-2 text-sm font-bold text-saffron-700 hover:text-saffron-800 bg-white px-4 py-2.5 rounded-xl border border-saffron-200 shadow-sm self-start md:self-auto"
            >
              <span>View Full Daily Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingDaily ? (
            <div className="bg-white p-12 rounded-2xl text-center space-y-3 border border-amber-200">
              <div className="w-8 h-8 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-deepbrown-muted font-medium">Checking today's fresh daily menu...</p>
            </div>
          ) : hasDailyMenu && dailyMenu && dailyMenu.items.length > 0 ? (
            <div className="space-y-6">
              {dailyMenu.specialAnnouncement && (
                <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-sm flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-warmamber-500 fill-warmamber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block">Today's Special Announcement</span>
                    <p className="text-sm text-deepbrown-900 font-medium">{dailyMenu.specialAnnouncement}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyMenu.items.map((item, idx) => (
                  <DailyMenuCard key={idx} item={item} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-2xl text-center max-w-2xl mx-auto border border-amber-200/80 shadow-premium">
              <ChefHat className="w-12 h-12 text-warmamber-500 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-xl text-deepbrown-900 mb-2">
                Today's menu will be updated soon.
              </h3>
              <p className="text-sm text-deepbrown-muted mb-6">
                Please contact us directly for current availability or custom meal preparation requests.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  onClick={handleWhatsAppClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-5 py-3 rounded-full shadow-sm hover:bg-[#20ba59]"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Check Today's Dishes on WhatsApp</span>
                </a>
                <Link
                  to="/custom-order"
                  className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-700 text-xs font-bold px-5 py-3 rounded-full border border-saffron-200 hover:bg-saffron-100"
                >
                  <span>Request Custom Meal</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 3. EXPLORE OUR MENU HIGHLIGHTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3 py-1 rounded-full border border-saffron-200">
              Freshly Cooked
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-deepbrown-950 mt-2">
              Featured Food Items
            </h2>
            <p className="text-sm text-deepbrown-muted mt-1">
              Popular delights from our live kitchen, made fresh upon every order.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-saffron-700 hover:text-saffron-800"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-cream-200" />
            ))}
          </div>
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl text-center border border-cream-300">
            <p className="text-deepbrown-muted text-sm">
              Menu items are being updated in real-time. Please explore our full menu page.
            </p>
            <Link to="/menu" className="mt-3 inline-block text-saffron-700 font-bold text-sm underline">
              Browse All Categories
            </Link>
          </div>
        )}
      </section>

      {/* ================= 4. WHY CHOOSE US ================= */}
      <section className="bg-cream-50 py-16 border-y border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-100/60 px-3 py-1 rounded-full">
              Our Food Philosophy
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-deepbrown-950">
              Why Customers Love Shree Ji Fast Food
            </h2>
            <p className="text-sm sm:text-base text-deepbrown-muted">
              We operate on the timeless Indian tradition that food should nourish the body and soul like home cooking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Clock,
                title: 'Freshly Prepared Daily',
                desc: 'No stale gravies or pre-frozen bases. Every meal is cooked fresh each morning and evening.',
              },
              {
                icon: HeartHandshake,
                title: 'Customized To Preference',
                desc: 'Prefer less spice, extra butter, or no onion-garlic? We prepare it exactly how you love it.',
              },
              {
                icon: ShieldCheck,
                title: 'Pure Vegetarian Kitchen',
                desc: 'Strictly 100% vegetarian culinary standards using clean, quality oils, spices, and ingredients.',
              },
              {
                icon: ChefHat,
                title: 'Ghar Jaisa Authentic Taste',
                desc: 'Homestyle recipes that feel light on the stomach and comforting, just like home food.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-cream-300 shadow-premium hover:shadow-premium-hover transition-all duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron-700 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-deepbrown-900">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-deepbrown-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 5 & 6. CUSTOMIZE YOUR MEAL SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-deepbrown-950 via-deepbrown-900 to-deepbrown-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border-2 border-saffron-600/30">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-saffron-600/20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block bg-saffron-600/80 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Special Flexibility
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
                Craving Food Made Exactly To Your Taste?
              </h2>
              <p className="text-sm sm:text-base text-cream-200/90 max-w-2xl leading-relaxed">
                Whether you need mild spice for children, special meals without onion and garlic, extra ghee on your parathas, or a specific vegetable sabji prepared for lunch or dinner—our kitchen makes it to order!
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/custom-order"
                  className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-500 text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-lg transition-colors"
                >
                  <span>Request Custom Food</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  onClick={handleWhatsAppClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-full text-sm font-bold border border-white/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss with Chef on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-deepbrown-900/80 p-6 rounded-2xl border border-deepbrown-800 space-y-3 text-xs text-cream-200">
              <h4 className="font-serif font-bold text-sm text-saffron-400 uppercase tracking-wide">
                Customization Options:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warmamber-400" />
                  <span>Mild / Medium / Desi Spicy options</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warmamber-400" />
                  <span>Jain / No Onion & Garlic on request</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warmamber-400" />
                  <span>Extra Crispy or Soft Phulkas / Parathas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warmamber-400" />
                  <span>Less Oil / Desi Ghee preparation</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. ABOUT OUR RESTAURANT SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=900&auto=format&fit=crop"
                alt="Shree Ji Indian Kitchen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-cream-300 hidden sm:block max-w-xs">
              <span className="text-saffron-700 font-serif font-black text-2xl block">100%</span>
              <p className="text-xs text-deepbrown-muted font-medium">
                Pure vegetarian homestyle ingredients cooked fresh every morning.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-50 px-3 py-1 rounded-full border border-saffron-200">
              About Shree Ji Fast Food
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-deepbrown-950">
              Ghar Jaisa Swad, Har Din Kuch Khaas!
            </h2>
            <p className="text-sm sm:text-base text-deepbrown-muted leading-relaxed">
              {settings?.aboutText ||
                'Welcome to Shree Ji Fast Food! We are committed to serving freshly prepared, wholesome Indian meals every single day. From our renowned Aloo Parathas and comforting Puri Sabji to our complete Special Thalis, our kitchen prepares each dish with pure ingredients, authentic home-style flavors, and customized taste according to your preference.'}
            </p>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-saffron-700 hover:text-saffron-800 font-bold text-sm"
              >
                <span>Read more about our kitchen & philosophy</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. CONTACT & LOCATION SECTION ================= */}
      <section className="bg-cream-50 py-16 border-t border-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-100/60 px-3 py-1 rounded-full">
              Get In Touch
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-deepbrown-950">
              Visit Us or Order Today
            </h2>
            <p className="text-sm text-deepbrown-muted">
              Connect with us for takeaway, daily meal subscriptions, or custom food queries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-saffron-50 text-saffron-700 flex items-center justify-center mx-auto">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-deepbrown-900">Address</h4>
              <p className="text-xs text-deepbrown-muted leading-relaxed">
                {settings?.address || 'Restaurant address editable in Admin Settings'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-deepbrown-900">Phone & WhatsApp</h4>
              <p className="text-xs text-deepbrown-muted">
                {settings?.phoneNumber || 'Phone editable in Admin Settings'}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-[#25D366] hover:underline"
              >
                Chat on WhatsApp →
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-cream-300 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-deepbrown-900">Opening Hours</h4>
              <p className="text-xs text-deepbrown-muted">
                {settings?.openingHours || 'Daily: 8:00 AM - 10:00 PM'}
              </p>
              <span className="text-[11px] font-semibold text-emerald-700 block">
                Fresh breakfast, lunch & dinner
              </span>
            </div>
          </div>

          <div className="text-center pt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-deepbrown-900 hover:bg-deepbrown-800 text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-colors"
            >
              <span>Go to Full Contact & Inquiry Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
