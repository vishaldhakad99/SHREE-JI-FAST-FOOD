import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { NoticeBanner } from './NoticeBanner';
import { InstallAppButton } from './InstallAppButton';
import { getWhatsAppUrl } from '../utils/whatsapp';
import {
  Menu,
  X,
  UtensilsCrossed,
  Sparkles,
  MessageCircle,
  Clock,
  ShieldCheck,
  User,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();
  const { customer, isAuthenticated, openAuthModal, logout } = useCustomerAuth();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Menu', path: '/menu' },
    { name: "Today's Special", path: '/todays-special', highlight: true },
    { name: 'Specialities', path: '/specialities' },
    { name: 'Custom Order', path: '/custom-order' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsappUrl = getWhatsAppUrl(
    'Hello Shree Ji Fast Food, I would like to inquire about ordering food.',
    settings?.whatsappNumber || settings?.phoneNumber
  );

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-shadow duration-200 gpu-accelerated">
      {/* Notice Banner directly inside sticky header to prevent any vertical jump/jitter */}
      <NoticeBanner />

      <div
        className={`w-full transition-colors duration-200 ${
          isScrolled
            ? 'bg-[#FDFCF9] shadow-md border-b border-cream-300'
            : 'bg-[#FDFCF9] border-b border-cream-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Name - Strictly non-jumping, stable layout */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0 pr-2"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
                <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-serif font-black text-lg sm:text-2xl tracking-tight text-deepbrown-900 block truncate group-hover:text-saffron-700 transition-colors leading-tight">
                  {settings?.restaurantName || 'SHREE JI FAST FOOD'}
                </span>
                <span className="text-[10px] sm:text-xs text-saffron-700 font-bold tracking-wider uppercase block truncate leading-tight mt-0.5">
                  {settings?.tagline || 'Ghar Jaisa Swad, Har Din Kuch Khaas!'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 text-xs xl:text-sm font-semibold rounded-lg transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-saffron-700 bg-saffron-50/90 font-bold'
                      : 'text-deepbrown-800 hover:text-saffron-600 hover:bg-cream-200/60'
                  } ${link.highlight ? 'flex items-center gap-1.5 text-amber-700' : ''}`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-warmamber-500 fill-warmamber-400" />}
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-saffron-600 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Header Action Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-2.5">
              <InstallAppButton compact />

              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-saffron-50 border border-saffron-200/80 rounded-xl text-xs font-bold text-saffron-900 shadow-sm">
                  <User className="w-3.5 h-3.5 text-saffron-600" />
                  <span className="truncate max-w-[120px]">
                    {customer?.name || (customer?.phone ? `+91 ${customer.phone}` : customer?.email)}
                  </span>
                  <button
                    onClick={logout}
                    title="Logout"
                    className="p-1 text-stone-400 hover:text-red-600 hover:bg-saffron-100 rounded-lg transition-colors ml-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-saffron-600 hover:bg-saffron-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login / OTP</span>
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile Actions: WhatsApp Icon + Desktop App Icon + User Login + Hamburger */}
            <div className="flex lg:hidden items-center gap-1.5 shrink-0">
              <InstallAppButton compact />

              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsOpen(true);
                  } else {
                    openAuthModal();
                  }
                }}
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-xs font-bold shadow-sm transition-all ${
                  isAuthenticated
                    ? 'bg-saffron-100 text-saffron-800 border border-saffron-300'
                    : 'bg-saffron-600 text-white'
                }`}
                aria-label="Customer Account"
              >
                <User className="w-4 h-4" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366] text-white shadow-sm"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-deepbrown-900 bg-cream-200/80 hover:bg-cream-300 transition-colors"
                aria-label="Toggle Navigation"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isOpen && (
          <div className="lg:hidden bg-cream-50 border-t border-cream-200 px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-xl max-h-[80vh] overflow-y-auto">
            {/* Customer Profile / Login Section */}
            <div className="p-3 bg-stone-100/90 rounded-xl flex items-center justify-between border border-stone-200/80 mb-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-saffron-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {customer?.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-deepbrown-900 truncate">
                        {customer?.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-stone-600 truncate">
                        {customer?.phone ? `+91 ${customer.phone}` : customer?.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openAuthModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login with Mobile / Gmail to Order</span>
                </button>
              )}
            </div>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-saffron-100/90 text-saffron-800 font-bold'
                      : 'text-deepbrown-900 hover:bg-cream-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {link.highlight && <Sparkles className="w-4 h-4 text-warmamber-500 fill-warmamber-400" />}
                    <span>{link.name}</span>
                  </div>
                  {isActive(link.path) && <span className="w-2 h-2 rounded-full bg-saffron-600" />}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-cream-200 space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 rounded-xl font-bold shadow-sm text-sm"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order on WhatsApp</span>
              </a>

              <div className="flex items-center justify-between px-1 pt-1 text-xs text-deepbrown-muted font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {settings?.openingHours ? 'Daily Open' : 'Open Everyday'}
                </span>
                <Link
                  to="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1 text-saffron-700 font-bold hover:underline"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
