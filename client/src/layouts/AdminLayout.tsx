import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import api from '../services/api';
import {
  playKitchenOrderBell,
  sendBrowserNotification,
  requestNotificationPermission,
} from '../utils/audioAlerts';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  MessageSquare,
  ShieldCheck,
  Bell,
  Volume2,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<any | null>(null);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef<boolean>(false);

  // Live real-time order listener with audio chime
  useEffect(() => {
    requestNotificationPermission();

    let isMounted = true;

    const checkNewOrders = async () => {
      try {
        const res = await api.get('/orders?status=new');
        if (res.data?.success && isMounted) {
          const newOrders = res.data.orders || [];

          if (!initialLoadDone.current) {
            newOrders.forEach((o: any) => knownOrderIds.current.add(o._id));
            initialLoadDone.current = true;
            return;
          }

          // Check if any order is new that we haven't alerted for
          const brandNew = newOrders.find((o: any) => !knownOrderIds.current.has(o._id));

          if (brandNew) {
            knownOrderIds.current.add(brandNew._id);
            setNewOrderAlert(brandNew);

            // 1. Play loud restaurant kitchen order bell
            playKitchenOrderBell();

            // 2. Trigger native browser push notification
            sendBrowserNotification('🔔 NEW ORDER RECEIVED!', {
              body: `New order #${brandNew.orderNumber || ''} from ${brandNew.customerName} for ${brandNew.foodItemName} (Qty: ${brandNew.quantity})`,
            });
          }
        }
      } catch (err) {
        // Silently retry on next poll
      }
    };

    checkNewOrders();
    const timer = setInterval(checkNewOrders, 4000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const quickAcceptOrder = async (orderId: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        status: 'accepted',
        adminNotes: 'Accepted by Kitchen',
      });
      setNewOrderAlert(null);
      window.location.reload();
    } catch (e) {
      console.error('Failed to quick accept order:', e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-saffron-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-deepbrown-800">Verifying secure admin credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login', { replace: true });
    return null;
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Food Items Management', path: '/admin/dashboard/food', icon: UtensilsCrossed },
    { name: 'Daily Menu Specials', path: '/admin/dashboard/daily-menu', icon: CalendarDays },
    { name: 'Order Enquiries', path: '/admin/dashboard/orders', icon: ShoppingBag },
    { name: 'Contact Inquiries', path: '/admin/dashboard/contacts', icon: MessageSquare },
    { name: 'Restaurant Settings', path: '/admin/dashboard/settings', icon: Sliders },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    if (path !== '/admin/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-cream-200 flex flex-col md:flex-row text-deepbrown-900 font-sans">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-deepbrown-950 text-white px-4 py-3 flex items-center justify-between border-b border-deepbrown-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-saffron-500" />
          <span className="font-serif font-bold text-base">Shree Ji Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-cream-200 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-deepbrown-950 text-cream-200 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-deepbrown-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron-600 flex items-center justify-center text-white font-bold">
                SJ
              </div>
              <div>
                <h2 className="font-serif font-black text-sm text-white tracking-wide">
                  {settings?.restaurantName || 'SHREE JI FAST FOOD'}
                </h2>
                <span className="text-[10px] text-saffron-400 font-semibold uppercase tracking-wider block">
                  Management Portal
                </span>
              </div>
            </div>
          </div>

          {/* Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-saffron-600 text-white shadow-md'
                      : 'text-cream-300 hover:bg-deepbrown-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-deepbrown-800 space-y-3">
          <div className="px-3 py-2 bg-deepbrown-900 rounded-lg text-xs">
            <span className="text-cream-400 block text-[10px] uppercase font-bold">Logged in as</span>
            <span className="text-white font-semibold truncate block">{user?.name || user?.email}</span>
            <span className="text-saffron-400 text-[10px] font-medium uppercase tracking-wider">
              Role: {user?.role}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-cream-300 bg-deepbrown-900 hover:bg-deepbrown-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-red-400 bg-deepbrown-900 hover:bg-red-950/60 hover:text-red-300 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl relative">
        {/* Real-time Order Alert Banner for Admin */}
        {newOrderAlert && (
          <div className="fixed top-4 right-4 left-4 md:left-auto md:w-[420px] z-50 bg-gradient-to-r from-red-600 via-saffron-600 to-amber-600 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/50 animate-bounce">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl animate-spin">🔔</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    NEW ORDER RECEIVED!
                  </span>
                  <h4 className="font-bold text-sm mt-1">
                    #{newOrderAlert.orderNumber || ''} • {newOrderAlert.customerName} ({newOrderAlert.customerPhone})
                  </h4>
                  <p className="text-xs font-semibold text-yellow-100 mt-0.5">
                    🍲 {newOrderAlert.foodItemName} (Qty: {newOrderAlert.quantity})
                  </p>
                  {newOrderAlert.deliveryAddress && (
                    <p className="text-[11px] text-white/80 truncate max-w-[280px]">
                      📍 {newOrderAlert.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setNewOrderAlert(null)}
                className="p-1.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 pt-2 border-t border-white/20 flex gap-2">
              <button
                onClick={() => quickAcceptOrder(newOrderAlert._id)}
                className="flex-1 py-2 bg-white text-emerald-800 font-black text-xs rounded-xl shadow hover:bg-cream-100 transition-colors"
              >
                ✓ Accept Order Now
              </button>
              <Link
                to="/admin/dashboard/orders"
                onClick={() => setNewOrderAlert(null)}
                className="px-4 py-2 bg-black/30 hover:bg-black/50 text-white font-bold text-xs rounded-xl transition-colors"
              >
                View Order
              </Link>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};
